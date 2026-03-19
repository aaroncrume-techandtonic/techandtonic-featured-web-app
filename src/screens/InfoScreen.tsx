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
        <Text style={styles.headerTitle}>The Science Behind 8D</Text>
      </View>

      {/* Section 1: The Bilateral Anchor */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>The Bilateral Anchor</Text>
        <Text style={styles.sectionText}>
          ADHD brains often have an under-stimulated prefrontal cortex, causing a constant search for novel stimuli. 8D audio provides continuous, predictable movement that occupies this background craving while anchoring foreground attention.
        </Text>

        <View style={styles.cardGrid}>
          <View style={styles.card}>
            <Text style={styles.cardIcon}>〰️</Text>
            <Text style={styles.cardTitle}>The "Window Wiper" Effect</Text>
            <Text style={styles.cardDesc}>
              Smooth panning from left to right ear activates alternating brain hemispheres, grounding the nervous system similar to EMDR therapy.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardIcon}>⚡</Text>
            <Text style={styles.cardTitle}>Optimal Arousal</Text>
            <Text style={styles.cardDesc}>
              Acts as a physiological "fidget spinner," keeping dopamine baseline high enough to prevent your attention from wandering.
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
            desc="Slow 8-10s cycle pans audio smoothly left to right, creating the grounding bilateral stimulation ideal for ADHD focus."
          />
          <ComponentCard
            icon="☁️"
            title="Large Hall Reverb"
            desc="Creates illusion of massive physical space. Heavy reverb pushes audio outward, reducing auditory claustrophobia."
          />
          <ComponentCard
            icon="🎛️"
            title="Doppler EQ Filtering"
            desc="High frequencies shift based on panning direction, mimicking Head-Related Transfer Functions for 3D realism."
          />
          <ComponentCard
            icon="🧠"
            title="Binaural Beating"
            desc="Different frequencies in each ear create a 14Hz difference, encouraging Beta wave focus states."
          />
          <ComponentCard
            icon="🔇"
            title="Vocal Absence"
            desc="Strictly instrumental—no human speech to engage language centers. Keeps focus uninterrupted."
          />
        </View>
      </View>

      {/* Section 3: How It Helps */}
      <View style={[styles.section, styles.lastSection]}>
        <Text style={styles.sectionTitle}>Why This Works for ADHD</Text>
        <View style={styles.bulletList}>
          <BulletPoint text="Fills the dopamine gap without overwhelming" />
          <BulletPoint text="Provides predictable novelty" />
          <BulletPoint text="Grounds wandering attention" />
          <BulletPoint text="Reduces internal distraction" />
          <BulletPoint text="Scientifically aligned with bilateral stimulation" />
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
