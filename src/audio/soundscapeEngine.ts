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

const STEM_KEYS: StemKey[] = [
  'drone',
  'rhythm',
  'textureA',
  'textureB',
  'textureC',
  'textureD',
  'textureE',
];

const MODE_MIX: Record<SoundscapeMode, ModeMix> = {
  Focus: {
    drone: 0.32,
    rhythm: 0.7,
    textureA: 0.2,
    textureB: 0.22,
    textureC: 0.3,
    textureD: 0.1,
    textureE: 0.12,
  },
  Relax: {
    drone: 0.62,
    rhythm: 0.18,
    textureA: 0.38,
    textureB: 0.4,
    textureC: 0.2,
    textureD: 0.2,
    textureE: 0.2,
  },
  Sleep: {
    drone: 0.78,
    rhythm: 0,
    textureA: 0.5,
    textureB: 0.35,
    textureC: 0.08,
    textureD: 0.45,
    textureE: 0.5,
  },
  Move: {
    drone: 0.2,
    rhythm: 0.92,
    textureA: 0.1,
    textureB: 0.15,
    textureC: 0.45,
    textureD: 0.32,
    textureE: 0.08,
  },
};

const FADE_STEP_MS = 100;
const EVOLUTION_INTERVAL_MS = 45000;
const EVOLUTION_FADE_MS = 10000;

const EVOLVING_TEXTURES: StemKey[] = ['textureA', 'textureB', 'textureC', 'textureD', 'textureE'];

export class SoundscapeEngine {
  private sounds: Partial<Record<StemKey, Audio.Sound>> = {};
  private volumes: ModeMix = { ...MODE_MIX.Focus };
  private activeMode: SoundscapeMode = 'Focus';
  private evolutionTimer: ReturnType<typeof setInterval> | null = null;

  async init(stemSources: StemSources): Promise<void> {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    for (const key of STEM_KEYS) {
      this.sounds[key] = await this.loadStem(stemSources[key], MODE_MIX.Focus[key]);
    }

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
    const mix = MODE_MIX[mode];
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
    const baseMix = MODE_MIX[this.activeMode];
    const evolvedMix: ModeMix = { ...baseMix };

    for (const key of EVOLVING_TEXTURES) {
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
}
