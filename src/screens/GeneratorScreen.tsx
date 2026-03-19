import React from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable, TextInput } from 'react-native';

type GeneratorScreenProps = {
  onClose: () => void;
};

export function GeneratorScreen({ onClose }: GeneratorScreenProps) {
  const [task, setTask] = React.useState<'deep-work' | 'reading' | 'creative'>('deep-work');
  const [genre, setGenre] = React.useState<'ambient' | 'synthwave' | 'brown-noise'>('ambient');
  const [speed, setSpeed] = React.useState('standard');
  const [generatedPrompt, setGeneratedPrompt] = React.useState('');
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    generatePrompt();
  }, []);

  const generatePrompt = () => {
    const speedMap: Record<string, { label: string; text: string }> = {
      slow: {
        label: 'Slow (12s)',
        text: 'Very slow, 12-second cycle continuous LFO panning from 100% Left to 100% Right.',
      },
      standard: {
        label: 'Standard (8s)',
        text: 'Smooth 8-second cycle continuous LFO panning from Left to Right.',
      },
      fast: {
        label: 'Fast (4s)',
        text: 'Fast 4-second cycle continuous LFO panning from Left to Right.',
      },
    };

    const taskMap: Record<string, string> = {
      'deep-work': 'Driving, repetitive, predictable rhythm. 70 BPM.',
      'reading': 'Floating, drone-like, very minimal percussion. Wash of sound. 50 BPM.',
      'creative': 'Uplifting warm textures, steady heartbeat rhythm. 80 BPM.',
    };

    const genreMap: Record<string, string> = {
      'ambient': 'dark ambient / drone',
      'synthwave': 'atmospheric synthwave',
      'brown-noise': 'textural brown noise',
    };

    const speedInfo = speedMap[speed];
    const structure = taskMap[task];
    const genreLabel = genreMap[genre];

    const prompt = `Generate a three-dimensional, binaurally panned spatial audio track optimized as a non-pharmacological ADHD focus aid.

  [COGNITIVE TARGET]
  State: ${task}
  Goal: improve attentional stability through bilateral auditory stimulation and predictable novelty.

  [CORE VIBE]
Genre: ${genreLabel}
Structure: ${structure}
Rule: Strictly instrumental, ABSOLUTELY NO VOCALS or human speech.

[SPATIAL / 8D PARAMETERS]
1. Panning: ${speedInfo.text}
2. Reverb: Large Cathedral/Cavern reverb (60-70% wet) for 3D spatial illusion outside the head.
3. EQ: Dynamic EQ filtering. Muffle high frequencies on the rear pan to simulate doppler effect.
  4. Binaural: Embed a subtle continuous ~14Hz difference between L/R channels.
  5. Attention Design: smooth phase-locked repetition, no abrupt drops, clear stereo orbit.

  Use this prompt with Suno, Udio, Stable Audio, MusicGen, or AudioLDM to generate your custom focus track.`;

    setGeneratedPrompt(prompt);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  React.useEffect(() => {
    generatePrompt();
  }, [task, genre, speed]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Research Prompt Generator</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Generate research-aligned prompts for Suno, Udio, Stable Audio, MusicGen, and AudioLDM.</Text>

        {/* Control Group 1 */}
        <View style={styles.controlGroup}>
          <Text style={styles.label}>1. Cognitive State</Text>
          <View style={styles.buttonGroup}>
            {(['deep-work', 'reading', 'creative'] as const).map((option) => (
              <Pressable
                key={option}
                style={[
                  styles.optionButton,
                  task === option && styles.optionButtonActive,
                ]}
                onPress={() => setTask(option)}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    task === option && styles.optionButtonTextActive,
                  ]}
                >
                  {option === 'deep-work'
                    ? 'Deep Work'
                    : option === 'reading'
                      ? 'Reading'
                      : 'Creative'}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Control Group 2 */}
        <View style={styles.controlGroup}>
          <Text style={styles.label}>2. Acoustic Texture</Text>
          <View style={styles.buttonGroup}>
            {(['ambient', 'synthwave', 'brown-noise'] as const).map((option) => (
              <Pressable
                key={option}
                style={[
                  styles.optionButton,
                  genre === option && styles.optionButtonActive,
                ]}
                onPress={() => setGenre(option)}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    genre === option && styles.optionButtonTextActive,
                  ]}
                >
                  {option === 'ambient'
                    ? 'Ambient'
                    : option === 'synthwave'
                      ? 'Synthwave'
                      : 'Brown Noise'}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Control Group 3 */}
        <View style={styles.controlGroup}>
          <Text style={styles.label}>3. Oscillation Speed</Text>
          <View style={styles.buttonGroup}>
            {(['slow', 'standard', 'fast'] as const).map((option) => (
              <Pressable
                key={option}
                style={[
                  styles.optionButton,
                  speed === option && styles.optionButtonActive,
                ]}
                onPress={() => setSpeed(option)}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    speed === option && styles.optionButtonTextActive,
                  ]}
                >
                  {option === 'slow' ? 'Slow (12s)' : option === 'standard' ? 'Standard (8s)' : 'Fast (4s)'}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {/* Output Box */}
      <View style={styles.outputSection}>
        <View style={styles.outputHeader}>
          <Text style={styles.outputLabel}>Generated Prompt</Text>
          <Pressable onPress={copyToClipboard} style={styles.copyButton}>
            <Text style={styles.copyButtonText}>{copied ? '✓ Copied' : 'Copy'}</Text>
          </Pressable>
        </View>
        <TextInput
          style={styles.promptOutput}
          value={generatedPrompt}
          editable={false}
          multiline
          scrollEnabled
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Prompt template encodes bilateral stimulation, entrainment cues, and spatial tracking constraints from your source document.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0f172a',
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff8e6',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 24,
    color: '#93c5fd',
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
    marginBottom: 8,
  },
  controlGroup: {
    gap: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#93c5fd',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3b82f6',
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
  },
  optionButtonActive: {
    borderColor: '#fcd34d',
    backgroundColor: '#f59e0b',
  },
  optionButtonText: {
    color: '#bfdbfe',
    fontWeight: '700',
    fontSize: 13,
  },
  optionButtonTextActive: {
    color: '#1e293b',
  },
  outputSection: {
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 8,
  },
  outputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  outputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#93c5fd',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  copyButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#334155',
    borderRadius: 8,
  },
  copyButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#cbd5e1',
  },
  promptOutput: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 14,
    color: '#7dd3fc',
    fontFamily: 'monospace',
    fontSize: 12,
    minHeight: 240,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(51, 65, 85, 0.3)',
  },
  footerText: {
    fontSize: 12,
    color: '#cbd5e1',
    lineHeight: 18,
    fontStyle: 'italic',
  },
});
