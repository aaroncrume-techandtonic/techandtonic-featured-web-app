import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  SoundscapeEngine,
  type SoundscapeMode,
  type StemSources,
} from './src/audio/soundscapeEngine';
import { InfoScreen } from './src/screens/InfoScreen';
import { GeneratorScreen } from './src/screens/GeneratorScreen';

const STEM_SOURCES: StemSources = {
  drone: require('./Crystalline_Depths.mp3'),
  rhythm: require('./Crystalline_Currents.mp3'),
  textureA: require('./Crystalline_Echos.mp3'),
  textureB: require('./Cerebral_Echoes.mp3'),
  textureC: require('./Cerebral_Echoes (1).mp3'),
  textureD: require('./Cerebral_Echoes (2).mp3'),
  textureE: require('./Subliminal_Slumber.mp3'),
};

type AppStage = 'onboarding' | 'paywall' | 'player' | 'info' | 'generator';
const SESSION_OPTIONS = [15, 30, 45, 60];

export default function App() {
  const engineRef = useRef(new SoundscapeEngine());

  const [mode, setMode] = useState<SoundscapeMode>('Focus');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasStems, setHasStems] = useState(false);
  const [stage, setStage] = useState<AppStage>('onboarding');
  const [intent, setIntent] = useState<SoundscapeMode>('Focus');
  const [sessionMinutes, setSessionMinutes] = useState(30);
  const [secondsLeft, setSecondsLeft] = useState(30 * 60);

  const handleNavigateTo = (newStage: AppStage) => {
    setStage(newStage);
  };

  useEffect(() => {
    let mounted = true;

    async function bootAudio() {
      await engineRef.current.init(STEM_SOURCES);

      if (mounted) {
        setHasStems(engineRef.current.hasLoadedStems());
        setIsReady(true);
      }
    }

    bootAudio();

    return () => {
      mounted = false;
      engineRef.current.dispose();
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      setSecondsLeft(sessionMinutes * 60);
    }
  }, [sessionMinutes, isPlaying]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying || secondsLeft > 0) {
      return;
    }

    void engineRef.current.pause();
    setIsPlaying(false);
  }, [isPlaying, secondsLeft]);

  const handlePlaybackToggle = async () => {
    if (!isReady || !hasStems) {
      return;
    }

    if (isPlaying) {
      await engineRef.current.pause();
      setIsPlaying(false);
      return;
    }

    if (secondsLeft === 0) {
      setSecondsLeft(sessionMinutes * 60);
    }

    await engineRef.current.play();
    setIsPlaying(true);
  };

  const handleModeChange = async (nextMode: SoundscapeMode) => {
    setMode(nextMode);
    await engineRef.current.setMode(nextMode);
  };

  const handleOnboardingComplete = (selectedIntent: SoundscapeMode) => {
    setIntent(selectedIntent);
    setMode(selectedIntent);
    setStage('paywall');
  };

  const handleUnlockTrial = async () => {
    await handleModeChange(intent);
    setStage('player');
  };

  if (stage === 'info') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <InfoScreen onClose={() => setStage('player')} />
        <StatusBar style="light" />
      </SafeAreaView>
    );
  }

  if (stage === 'generator') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <GeneratorScreen onClose={() => setStage('player')} />
        <StatusBar style="light" />
      </SafeAreaView>
    );
  }

  if (stage === 'onboarding') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <OnboardingScreen onContinue={handleOnboardingComplete} />
        <StatusBar style="light" />
      </SafeAreaView>
    );
  }

  if (stage === 'paywall') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <PaywallScreen intent={intent} onStartTrial={handleUnlockTrial} onBack={() => setStage('onboarding')} />
        <StatusBar style="light" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.bgOrbTop} />
      <View style={styles.bgOrbBottom} />
      <View style={styles.playerContainer}>
        <Text style={styles.kicker}>8D Audio for ADHD</Text>
        <Text style={styles.title}>Find Your Rhythm</Text>
        <Text style={styles.subtitle}>Current mode: {mode}</Text>

        <View style={styles.timerCard}>
          <Text style={styles.timerLabel}>Session timer</Text>
          <Text style={styles.timerValue}>{formatClock(secondsLeft)}</Text>
          <Text style={styles.timerHint}>Choose a short sprint or longer immersion.</Text>
          <View style={styles.sessionRow}>
            {SESSION_OPTIONS.map((minutes) => (
              <Pressable
                key={minutes}
                style={[styles.sessionChip, sessionMinutes === minutes && styles.sessionChipActive]}
                onPress={() => setSessionMinutes(minutes)}
              >
                <Text style={[styles.sessionChipText, sessionMinutes === minutes && styles.sessionChipTextActive]}>
                  {minutes}m
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {!isReady && (
          <View style={styles.loadingRow}>
            <ActivityIndicator color="#fff8e6" />
            <Text style={styles.loadingText}>Preparing audio engine...</Text>
          </View>
        )}

        {isReady && !hasStems && (
          <Text style={styles.notice}>
            No audio stems loaded. Verify the bundled MP3 files are present in the app root.
          </Text>
        )}

        <Text style={styles.sectionLabel}>Choose a listening mode</Text>
        <View style={styles.modeRow}>
          <ModeButton
            label="Focus"
            selected={mode === 'Focus'}
            onPress={() => handleModeChange('Focus')}
          />
          <ModeButton
            label="Relax"
            selected={mode === 'Relax'}
            onPress={() => handleModeChange('Relax')}
          />
          <ModeButton
            label="Sleep"
            selected={mode === 'Sleep'}
            onPress={() => handleModeChange('Sleep')}
          />
          <ModeButton
            label="Move"
            selected={mode === 'Move'}
            onPress={() => handleModeChange('Move')}
          />
        </View>

        <Pressable
          style={[styles.playButton, (!isReady || !hasStems) && styles.buttonDisabled]}
          onPress={handlePlaybackToggle}
          disabled={!isReady || !hasStems}
        >
          <Text style={styles.playButtonText}>{isPlaying ? 'Pause Session' : 'Start Session'}</Text>
        </Pressable>

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>Focus cue</Text>
          <Text style={styles.tipText}>
            Keep one tab open, one task active, and let the soundscape run until the timer completes.
          </Text>
        </View>

        <View style={styles.navRow}>
          <Pressable style={styles.navButton} onPress={() => handleNavigateTo('info')}>
            <Text style={styles.navButtonText}>Learn the Science</Text>
          </Pressable>
          <Pressable style={styles.navButton} onPress={() => handleNavigateTo('generator')}>
            <Text style={styles.navButtonText}>AI Generator</Text>
          </Pressable>
        </View>

        <Pressable style={styles.secondaryLink} onPress={() => setStage('paywall')}>
          <Text style={styles.secondaryLinkText}>View subscription screen</Text>
        </Pressable>
      </View>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

type OnboardingScreenProps = {
  onContinue: (selectedIntent: SoundscapeMode) => void;
};

function OnboardingScreen({ onContinue }: OnboardingScreenProps) {
  const [selectedIntent, setSelectedIntent] = useState<SoundscapeMode>('Focus');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.bgOrbTop} />
      <View style={styles.bgOrbBottom} />
      <Text style={styles.kicker}>8D Audio for ADHD | Step 1 of 2</Text>
      <Text style={styles.title}>Anchor Your Focus</Text>
      <Text style={styles.subtitle}>Choose your intention. 8D spatial audio will handle the rest.</Text>

      <View style={styles.intentGrid}>
        <ModeButton
          label="Focus"
          selected={selectedIntent === 'Focus'}
          onPress={() => setSelectedIntent('Focus')}
        />
        <ModeButton
          label="Relax"
          selected={selectedIntent === 'Relax'}
          onPress={() => setSelectedIntent('Relax')}
        />
        <ModeButton
          label="Sleep"
          selected={selectedIntent === 'Sleep'}
          onPress={() => setSelectedIntent('Sleep')}
        />
        <ModeButton
          label="Move"
          selected={selectedIntent === 'Move'}
          onPress={() => setSelectedIntent('Move')}
        />
      </View>

      <Pressable style={styles.playButton} onPress={() => onContinue(selectedIntent)}>
        <Text style={styles.playButtonText}>Continue</Text>
      </Pressable>
    </ScrollView>
  );
}

type PaywallScreenProps = {
  intent: SoundscapeMode;
  onStartTrial: () => void;
  onBack: () => void;
};

function PaywallScreen({ intent, onStartTrial, onBack }: PaywallScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.bgOrbTop} />
      <View style={styles.bgOrbBottom} />
      <Text style={styles.kicker}>8D Audio for ADHD | Step 2 of 2</Text>
      <Text style={styles.title}>Start Your Free Trial</Text>
      <Text style={styles.subtitle}>Optimized for {intent.toLowerCase()} with bilateral spatial anchoring</Text>

      <View style={styles.card}>
        <Text style={styles.cardPrice}>$59.99/year</Text>
        <Text style={styles.cardDetail}>Includes 4 ADHD-optimized modes with 8D spatial audio.</Text>
        <Text style={styles.cardDetail}>Auto-panning, reverb, doppler filtering, and binaural beating.</Text>
        <Text style={styles.cardDetail}>Free 7-day trial—cancel anytime.</Text>
      </View>

      <Pressable style={styles.playButton} onPress={onStartTrial}>
        <Text style={styles.playButtonText}>Start Free Trial</Text>
      </Pressable>

      <Pressable style={styles.secondaryLink} onPress={onBack}>
        <Text style={styles.secondaryLinkText}>Back to onboarding</Text>
      </Pressable>
    </View>
  );
}

type ModeButtonProps = {
  label: SoundscapeMode;
  selected: boolean;
  onPress: () => void;
};

function ModeButton({ label, selected, onPress }: ModeButtonProps) {
  return (
    <Pressable style={[styles.modeButton, selected && styles.modeButtonActive]} onPress={onPress}>
      <Text style={[styles.modeButtonText, selected && styles.modeButtonTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingHorizontal: 24,
    justifyContent: 'center',
    paddingBottom: 24,
  },
  playerContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  bgOrbTop: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(0, 199, 190, 0.22)',
  },
  bgOrbBottom: {
    position: 'absolute',
    bottom: -70,
    left: -30,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(255, 196, 87, 0.16)',
  },
  kicker: {
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: '#7dd3fc',
    marginBottom: 10,
    fontWeight: '700',
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    color: '#fff8e6',
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 22,
    fontSize: 19,
    color: '#c7d2fe',
    lineHeight: 26,
  },
  timerCard: {
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 18,
    padding: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    marginBottom: 18,
  },
  timerLabel: {
    color: '#93c5fd',
    fontSize: 13,
    marginBottom: 6,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  timerValue: {
    color: '#fff8e6',
    fontSize: 34,
    fontWeight: '800',
  },
  timerHint: {
    color: '#bfd5ff',
    marginTop: 2,
    marginBottom: 10,
  },
  sessionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sessionChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#3b82f6',
    paddingVertical: 7,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
  },
  sessionChipActive: {
    borderColor: '#fcd34d',
    backgroundColor: '#f59e0b',
  },
  sessionChipText: {
    color: '#bfdbfe',
    fontWeight: '700',
  },
  sessionChipTextActive: {
    color: '#1e293b',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingText: {
    marginLeft: 10,
    color: '#dbeafe',
  },
  notice: {
    color: '#fde68a',
    marginBottom: 20,
    lineHeight: 20,
  },
  sectionLabel: {
    color: '#cbd5e1',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    fontWeight: '700',
  },
  modeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  intentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  modeButton: {
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(15, 23, 42, 0.86)',
  },
  modeButtonActive: {
    borderColor: '#fcd34d',
    backgroundColor: '#0369a1',
  },
  modeButtonText: {
    color: '#cbd5e1',
    fontSize: 16,
    fontWeight: '600',
  },
  modeButtonTextActive: {
    color: '#fff8e6',
  },
  playButton: {
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#fcd34d',
  },
  playButtonText: {
    fontSize: 18,
    color: '#0f172a',
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  tipCard: {
    marginTop: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    padding: 12,
  },
  tipTitle: {
    color: '#7dd3fc',
    fontWeight: '700',
    marginBottom: 4,
  },
  tipText: {
    color: '#dbeafe',
    lineHeight: 20,
  },
  card: {
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 18,
    backgroundColor: 'rgba(15, 23, 42, 0.84)',
  },
  cardPrice: {
    color: '#fff8e6',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardDetail: {
    color: '#dbeafe',
    lineHeight: 20,
    marginBottom: 4,
  },
  secondaryLink: {
    marginTop: 14,
    alignItems: 'center',
  },
  secondaryLinkText: {
    color: '#93c5fd',
    textDecorationLine: 'underline',
  },
  navRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  navButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
  },
  navButtonText: {
    color: '#dbeafe',
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'center',
  },
});

function formatClock(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  return `${mm}:${ss}`;
}
