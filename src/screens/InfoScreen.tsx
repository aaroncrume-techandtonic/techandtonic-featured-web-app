import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';

type InfoScreenProps = {
  onClose: () => void;
};

export function InfoScreen({ onClose }: InfoScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Science of Spatial Focus Audio</Text>
      </View>

      {/* Section 1: The Bilateral Anchor */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>The Bilateral Anchor</Text>
        <Text style={styles.sectionText}>
          Your source document frames 8D audio as three-dimensional, binaurally panned spatial audio.
          For ADHD, the goal is non-pharmacological attentional support through bilateral stimulation,
          predictable movement, and enough novelty to reduce compulsive distraction switching.
        </Text>

        <View style={styles.cardGrid}>
          <View style={styles.card}>
            <Text style={styles.cardIcon}>〰️</Text>
            <Text style={styles.cardTitle}>Bilateral Stimulation</Text>
            <Text style={styles.cardDesc}>
              Continuous left-right panning provides alternating sensory emphasis that may prevent habituation
              and stabilize attention through active auditory tracking.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardIcon}>⚡</Text>
            <Text style={styles.cardTitle}>Under-Arousal Compensation</Text>
            <Text style={styles.cardDesc}>
              The model suggests ADHD distractibility is partly an under-stimulation adaptation. Spatial motion can
              supply structured sensory input without task-breaking interruption.
            </Text>
          </View>
        </View>
      </View>

      {/* Section 2: Core Components */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>The 8D Formula</Text>

        <View style={styles.componentsList}>
          <ComponentCard
            icon="∿"
            title="LFO Auto-Panning"
            desc="Slow 8-10 second cycles create full-width stereo motion that keeps the brain in a gentle tracking loop."
          />
          <ComponentCard
            icon="☁️"
            title="Large Hall Reverb"
            desc="Pushes source perception outside the head, turning headphones into a simulated acoustic environment."
          />
          <ComponentCard
            icon="🎛️"
            title="Doppler EQ Filtering"
            desc="Dynamic front-back filtering sharpens spatial realism and reinforces continuous movement cues."
          />
          <ComponentCard
            icon="🧠"
            title="Binaural Beating"
            desc="Subtle interaural offset near 14 Hz is used as an entrainment layer for attentional rhythm support."
          />
          <ComponentCard
            icon="🔇"
            title="Vocal Absence"
            desc="No vocals avoids language-network capture, keeping cognitive bandwidth available for task execution."
          />
        </View>
      </View>

      {/* Section 3: How It Helps */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why This Works for ADHD</Text>
        <View style={styles.bulletList}>
          <BulletPoint text="Bilateral motion reduces auditory habituation" />
          <BulletPoint text="Predictable novelty helps prevent attention drift" />
          <BulletPoint text="Continuous spatial tracking occupies background stimulus seeking" />
          <BulletPoint text="Instrumental profile limits semantic interference" />
          <BulletPoint text="Designed as an adjunct to broader treatment, not a replacement" />
        </View>
      </View>

      <View style={[styles.section, styles.lastSection]}>
        <Text style={styles.sectionTitle}>Source Citations</Text>
        <View style={styles.bulletList}>
          <BulletPoint text="[1] 8D audio definition and reported focus effects" />
          <BulletPoint text="[3] ADHD prevalence and adjunct non-pharmacological need" />
          <BulletPoint text="[6] Symptom persistence and multimodal treatment limits" />
          <BulletPoint text="[8] Bilateral stimulation, entrainment, and phase-locking" />
          <BulletPoint text="[10] Spatial acoustic tracking demand" />
          <BulletPoint text="[11] AI workflow targets: Suno, Udio, Stable Audio, MusicGen" />
        </View>
      </View>
    </ScrollView>
  );
}

type ComponentCardProps = {
  icon: string;
  title: string;
  desc: string;
};

function ComponentCard({ icon, title, desc }: ComponentCardProps) {
  return (
    <View style={styles.componentCard}>
      <Text style={styles.componentIcon}>{icon}</Text>
      <Text style={styles.componentTitle}>{title}</Text>
      <Text style={styles.componentDesc}>{desc}</Text>
    </View>
  );
}

type BulletPointProps = {
  text: string;
};

function BulletPoint({ text }: BulletPointProps) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletDot}>•</Text>
      <Text style={styles.bulletText}>{text}</Text>
    </View>
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
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 65, 85, 0.3)',
  },
  lastSection: {
    borderBottomWidth: 0,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff8e6',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    color: '#cbd5e1',
    lineHeight: 24,
    marginBottom: 16,
  },
  cardGrid: {
    gap: 12,
  },
  card: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 14,
    padding: 14,
  },
  cardIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff8e6',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 13,
    color: '#bfd5ff',
    lineHeight: 20,
  },
  componentsList: {
    gap: 12,
  },
  componentCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 14,
    padding: 14,
  },
  componentIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  componentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff8e6',
    marginBottom: 6,
  },
  componentDesc: {
    fontSize: 13,
    color: '#dbeafe',
    lineHeight: 20,
  },
  bulletList: {
    gap: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bulletDot: {
    fontSize: 16,
    color: '#7dd3fc',
    fontWeight: '700',
  },
  bulletText: {
    fontSize: 15,
    color: '#dbeafe',
    lineHeight: 22,
    flex: 1,
  },
});
