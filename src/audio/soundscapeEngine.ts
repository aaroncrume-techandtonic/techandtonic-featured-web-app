import { Audio } from 'expo-av';
import type { AVPlaybackSource } from 'expo-av';

export type SoundscapeMode = 'Focus' | 'Relax' | 'Sleep' | 'Move';

export type StemKey =
  | 'drone'
  | 'rhythm'
  | 'textureA'
  | 'textureB'
  | 'textureC'
  | 'textureD'
  | 'textureE';

export type StemSources = {
  [K in StemKey]?: AVPlaybackSource;
};

type ModeMix = Record<StemKey, number>;
type ModeScene = Partial<Record<StemKey, number>>;

const STEM_KEYS: StemKey[] = [
  'drone',
  'rhythm',
  'textureA',
  'textureB',
  'textureC',
  'textureD',
  'textureE',
];

const MASTER_GAIN = 0.42;

const MODE_SCENES: Record<SoundscapeMode, ModeScene[]> = {
  Focus: [
    { drone: 0.55, rhythm: 0.45, textureA: 0.22 },
    { drone: 0.5, rhythm: 0.4, textureC: 0.26 },
    { drone: 0.52, rhythm: 0.36, textureB: 0.18, textureD: 0.12 },
  ],
  Relax: [
    { drone: 0.58, textureA: 0.26, textureE: 0.2 },
    { drone: 0.6, textureB: 0.22, textureD: 0.2 },
    { drone: 0.54, textureA: 0.2, textureC: 0.16, textureE: 0.16 },
  ],
  Sleep: [
    { drone: 0.6, textureE: 0.28, textureD: 0.18 },
    { drone: 0.64, textureA: 0.2, textureE: 0.22 },
    { drone: 0.58, textureB: 0.15, textureD: 0.16, textureE: 0.24 },
  ],
  Move: [
    { rhythm: 0.62, drone: 0.24, textureC: 0.18 },
    { rhythm: 0.58, drone: 0.2, textureA: 0.12, textureC: 0.16 },
    { rhythm: 0.66, drone: 0.18, textureB: 0.14, textureD: 0.14 },
  ],
};

const FADE_STEP_MS = 100;
const EVOLUTION_INTERVAL_MS = 55000;
const EVOLUTION_FADE_MS = 14000;

const EVOLVING_TEXTURES: StemKey[] = ['textureA', 'textureB', 'textureC', 'textureD', 'textureE'];

const SILENT_MIX: ModeMix = {
  drone: 0,
  rhythm: 0,
  textureA: 0,
  textureB: 0,
  textureC: 0,
  textureD: 0,
  textureE: 0,
};

export class SoundscapeEngine {
  private sounds: Partial<Record<StemKey, Audio.Sound>> = {};
  private volumes: ModeMix = { ...SILENT_MIX };
  private activeMode: SoundscapeMode = 'Focus';
  private activeSceneIndex = 0;
  private evolutionTimer: ReturnType<typeof setInterval> | null = null;

  async init(stemSources: StemSources): Promise<void> {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    const initialMix = this.sceneToMix(MODE_SCENES.Focus[0]);

    for (const key of STEM_KEYS) {
      this.sounds[key] = await this.loadStem(stemSources[key], initialMix[key]);
    }

    this.volumes = { ...initialMix };

    await this.randomizeStemOffsets();
  }

  hasLoadedStems(): boolean {
    return STEM_KEYS.some((key) => Boolean(this.sounds[key]));
  }

  async play(): Promise<void> {
    const playable = STEM_KEYS.map((key) => this.sounds[key]?.playAsync());
    await Promise.all(playable);
    this.startEvolutionLoop();
  }

  async pause(): Promise<void> {
    this.stopEvolutionLoop();
    const playable = STEM_KEYS.map((key) => this.sounds[key]?.pauseAsync());
    await Promise.all(playable);
  }

  async setMode(mode: SoundscapeMode, fadeMs = 1200): Promise<void> {
    this.activeMode = mode;
    this.activeSceneIndex = 0;
    const mix = this.sceneToMix(MODE_SCENES[mode][this.activeSceneIndex]);
    await this.applyMix(mix, fadeMs);
  }

  async dispose(): Promise<void> {
    this.stopEvolutionLoop();
    const unloads = STEM_KEYS.map((key) => this.sounds[key]?.unloadAsync());
    await Promise.all(unloads);

    this.sounds = {};
  }

  private async loadStem(source: AVPlaybackSource | undefined, volume: number): Promise<Audio.Sound | null> {
    if (!source) {
      return null;
    }

    const sound = new Audio.Sound();
    await sound.loadAsync(
      source,
      {
        isLooping: true,
        shouldPlay: false,
        volume,
      }
    );

    return sound;
  }

  private async fadeSoundVolume(
    sound: Audio.Sound | null,
    fromVolume: number,
    toVolume: number,
    fadeMs: number
  ): Promise<void> {
    if (!sound) {
      return;
    }

    if (fadeMs <= 0) {
      await sound.setVolumeAsync(toVolume);
      return;
    }

    const steps = Math.max(1, Math.round(fadeMs / FADE_STEP_MS));

    for (let step = 1; step <= steps; step += 1) {
      const progress = step / steps;
      const nextVolume = fromVolume + (toVolume - fromVolume) * progress;
      await sound.setVolumeAsync(nextVolume);
      await this.wait(FADE_STEP_MS);
    }
  }

  private wait(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  private async applyMix(mix: ModeMix, fadeMs: number): Promise<void> {
    const fades = STEM_KEYS.map((key) =>
      this.fadeSoundVolume(this.sounds[key] ?? null, this.volumes[key], mix[key], fadeMs)
    );

    await Promise.all(fades);
    this.volumes = { ...mix };
  }

  private startEvolutionLoop(): void {
    this.stopEvolutionLoop();

    this.evolutionTimer = setInterval(() => {
      void this.evolveActiveMix();
    }, EVOLUTION_INTERVAL_MS);
  }

  private stopEvolutionLoop(): void {
    if (!this.evolutionTimer) {
      return;
    }

    clearInterval(this.evolutionTimer);
    this.evolutionTimer = null;
  }

  private async evolveActiveMix(): Promise<void> {
    const scenes = MODE_SCENES[this.activeMode];
    const nextSceneIndex = this.pickNextSceneIndex(scenes.length, this.activeSceneIndex);
    this.activeSceneIndex = nextSceneIndex;

    const baseMix = this.sceneToMix(scenes[nextSceneIndex]);
    const evolvedMix: ModeMix = { ...baseMix };

    for (const key of EVOLVING_TEXTURES) {
      if (baseMix[key] < 0.01) {
        continue;
      }

      const drift = this.randomFloat(-0.08, 0.08);
      evolvedMix[key] = this.clamp(baseMix[key] + drift, 0, 1);
    }

    await this.applyMix(evolvedMix, EVOLUTION_FADE_MS);
    await this.randomSeekOneTexture();
  }

  private async randomizeStemOffsets(): Promise<void> {
    for (const key of STEM_KEYS) {
      const sound = this.sounds[key];
      if (!sound) {
        continue;
      }

      const status = await sound.getStatusAsync();
      if (!status.isLoaded || !status.durationMillis || status.durationMillis < 12000) {
        continue;
      }

      const maxPosition = Math.floor(status.durationMillis * 0.78);
      const randomOffset = Math.floor(Math.random() * maxPosition);
      await sound.setPositionAsync(randomOffset);
    }
  }

  private async randomSeekOneTexture(): Promise<void> {
    const available = EVOLVING_TEXTURES.filter((key) => Boolean(this.sounds[key]));
    if (available.length === 0) {
      return;
    }

    const selected = available[Math.floor(Math.random() * available.length)];
    const sound = this.sounds[selected];
    if (!sound) {
      return;
    }

    const status = await sound.getStatusAsync();
    if (!status.isLoaded || !status.durationMillis || status.durationMillis < 12000) {
      return;
    }

    const minPosition = Math.floor(status.durationMillis * 0.15);
    const maxPosition = Math.floor(status.durationMillis * 0.85);
    const randomOffset = Math.floor(this.randomFloat(minPosition, maxPosition));
    await sound.setPositionAsync(randomOffset);
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }

  private randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  private sceneToMix(scene: ModeScene): ModeMix {
    const mix: ModeMix = { ...SILENT_MIX };

    for (const key of STEM_KEYS) {
      const value = scene[key] ?? 0;
      mix[key] = this.clamp(value * MASTER_GAIN, 0, 1);
    }

    return mix;
  }

  private pickNextSceneIndex(sceneCount: number, currentIndex: number): number {
    if (sceneCount <= 1) {
      return 0;
    }

    let next = currentIndex;
    while (next === currentIndex) {
      next = Math.floor(Math.random() * sceneCount);
    }

    return next;
  }
}
