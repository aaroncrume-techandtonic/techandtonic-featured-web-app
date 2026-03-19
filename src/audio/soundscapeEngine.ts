import { Audio } from 'expo-av';

export type SoundscapeMode = 'Focus' | 'Relax' | 'Sleep' | 'Move';

type StemUris = {
  drone?: string;
  rhythm?: string;
};

type ModeMix = {
  droneVolume: number;
  rhythmVolume: number;
};

const MODE_MIX: Record<SoundscapeMode, ModeMix> = {
  Focus: {
    droneVolume: 0.35,
    rhythmVolume: 0.75,
  },
  Relax: {
    droneVolume: 0.65,
    rhythmVolume: 0.2,
  },
  Sleep: {
    droneVolume: 0.9,
    rhythmVolume: 0,
  },
  Move: {
    droneVolume: 0.25,
    rhythmVolume: 0.95,
  },
};

const FADE_STEP_MS = 100;

export class SoundscapeEngine {
  private droneSound: Audio.Sound | null = null;
  private rhythmSound: Audio.Sound | null = null;
  private droneVolume = MODE_MIX.Focus.droneVolume;
  private rhythmVolume = MODE_MIX.Focus.rhythmVolume;

  async init(stemUris: StemUris): Promise<void> {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    this.droneSound = await this.loadStem(stemUris.drone, MODE_MIX.Focus.droneVolume);
    this.rhythmSound = await this.loadStem(stemUris.rhythm, MODE_MIX.Focus.rhythmVolume);
  }

  hasLoadedStems(): boolean {
    return Boolean(this.droneSound || this.rhythmSound);
  }

  async play(): Promise<void> {
    await Promise.all([
      this.droneSound?.playAsync(),
      this.rhythmSound?.playAsync(),
    ]);
  }

  async pause(): Promise<void> {
    await Promise.all([
      this.droneSound?.pauseAsync(),
      this.rhythmSound?.pauseAsync(),
    ]);
  }

  async setMode(mode: SoundscapeMode, fadeMs = 1200): Promise<void> {
    const mix = MODE_MIX[mode];

    await Promise.all([
      this.fadeSoundVolume(this.droneSound, this.droneVolume, mix.droneVolume, fadeMs),
      this.fadeSoundVolume(this.rhythmSound, this.rhythmVolume, mix.rhythmVolume, fadeMs),
    ]);

    this.droneVolume = mix.droneVolume;
    this.rhythmVolume = mix.rhythmVolume;
  }

  async dispose(): Promise<void> {
    await Promise.all([
      this.droneSound?.unloadAsync(),
      this.rhythmSound?.unloadAsync(),
    ]);

    this.droneSound = null;
    this.rhythmSound = null;
  }

  private async loadStem(uri: string | undefined, volume: number): Promise<Audio.Sound | null> {
    if (!uri) {
      return null;
    }

    const sound = new Audio.Sound();
    await sound.loadAsync(
      { uri },
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
}
