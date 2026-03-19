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

const STEM_SOURCES: StemSources = {
  drone: require('./Crystalline_Depths.mp3'),
  rhythm: require('./Crystalline_Currents.mp3'),
  textureA: require('./Crystalline_Echos.mp3'),
  textureB: require('./Cerebral_Echoes.mp3'),
  textureC: require('./Cerebral_Echoes (1).mp3'),
  textureD: require('./Cerebral_Echoes (2).mp3'),
  textureE: require('./Subliminal_Slumber.mp3'),
};

type AppStage = 'onboarding' | 'paywall' | 'player';

export default function App() {
  const engineRef = useRef(new SoundscapeEngine());

  const [mode, setMode] = useState<SoundscapeMode>('Focus');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasStems, setHasStems] = useState(false);
  const [stage, setStage] = useState<AppStage>('onboarding');
  const [intent, setIntent] = useState<SoundscapeMode>('Focus');

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

  const handlePlaybackToggle = async () => {
    if (!isReady || !hasStems) {
      return;
    }

    if (isPlaying) {
      await engineRef.current.pause();
      setIsPlaying(false);
      return;
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
      <View style={styles.playerContainer}>
        <Text style={styles.kicker}>Generative Prototype</Text>
        <Text style={styles.title}>Soundscape</Text>
        <Text style={styles.subtitle}>Mode: {mode}</Text>

        {!isReady && (
          <View style={styles.loadingRow}>
            <ActivityIndicator color="#f2efe8" />
            <Text style={styles.loadingText}>Preparing audio engine...</Text>
          </View>
        )}

        {isReady && !hasStems && (
          <Text style={styles.notice}>
            No audio stems loaded. Verify the bundled MP3 files are present in the app root.
          </Text>
        )}

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
          <Text style={styles.playButtonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
        </Pressable>

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
      <Text style={styles.kicker}>Step 1 of 2</Text>
      <Text style={styles.title}>When do you need support most?</Text>
      <Text style={styles.subtitle}>Pick your primary intent. You can switch modes later anytime.</Text>

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
      <Text style={styles.kicker}>Step 2 of 2</Text>
      <Text style={styles.title}>Start Your 7-Day Trial</Text>
      <Text style={styles.subtitle}>Best for {intent.toLowerCase()} right now</Text>

      <View style={styles.card}>
        <Text style={styles.cardPrice}>$59.99/year</Text>
        <Text style={styles.cardDetail}>Then billed annually after trial unless canceled.</Text>
        <Text style={styles.cardDetail}>Includes Focus, Relax, Sleep, and Move soundscapes.</Text>
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
    backgroundColor: '#171b24',
  },
  container: {
    flex: 1,
    backgroundColor: '#171b24',
    paddingHorizontal: 24,
    justifyContent: 'center',
    paddingBottom: 24,
  },
  playerContainer: {
    flex: 1,
    backgroundColor: '#171b24',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  kicker: {
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: '#9ea7b8',
    marginBottom: 10,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: '#f2efe8',
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 32,
    fontSize: 18,
    color: '#bfc7d6',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingText: {
    marginLeft: 10,
    color: '#dde4f2',
  },
  notice: {
    color: '#fde8aa',
    marginBottom: 20,
    lineHeight: 20,
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
    borderColor: '#4c5567',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: '#242b39',
  },
  modeButtonActive: {
    borderColor: '#f2efe8',
    backgroundColor: '#3a4357',
  },
  modeButtonText: {
    color: '#c7cfdd',
    fontSize: 16,
    fontWeight: '600',
  },
  modeButtonTextActive: {
    color: '#ffffff',
  },
  playButton: {
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#f2efe8',
  },
  playButtonText: {
    fontSize: 18,
    color: '#111722',
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  card: {
    borderWidth: 1,
    borderColor: '#4c5567',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 18,
    backgroundColor: '#242b39',
  },
  cardPrice: {
    color: '#f2efe8',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardDetail: {
    color: '#c7cfdd',
    lineHeight: 20,
    marginBottom: 4,
  },
  secondaryLink: {
    marginTop: 14,
    alignItems: 'center',
  },
  secondaryLinkText: {
    color: '#bfc7d6',
    textDecorationLine: 'underline',
  },
});
