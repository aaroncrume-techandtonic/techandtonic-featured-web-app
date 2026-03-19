import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type ResearchScreenProps = {
  onClose: () => void;
};

export function ResearchScreen({ onClose }: ResearchScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>X</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Research Foundation</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Core Thesis</Text>
        <Text style={styles.bodyText}>
          8D audio is treated here as three-dimensional, binaurally panned spatial audio that creates
          the perceptual illusion of sound moving around the listener in a 360-degree field.
          The intended cognitive effect for ADHD is improved attentional stability through bilateral
          stimulation, predictable motion, and controlled novelty.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Neurobiology Model</Text>
        <Text style={styles.bodyText}>
          The report frames ADHD distractibility through under-arousal and optimal stimulation theory,
          where the nervous system seeks additional input to maintain engagement. Spatially moving audio
          can provide a structured sensory target that reduces compulsive context switching.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mechanism Stack</Text>
        <View style={styles.cardList}>
          <Card title="Bilateral Auditory Stimulation" text="Alternating left-right emphasis may reduce habituation and maintain attentional anchoring." />
          <Card title="Neural Entrainment and Phase-Locking" text="Rhythm plus stable panning cycles are used to support sustained attentional synchrony." />
          <Card title="Perceptual Spatial Tracking" text="Reverb, doppler-style filtering, and motion cues encourage continuous cognitive tracking." />
          <Card title="Instrumental Constraint" text="No vocals keeps language networks from competing with task-relevant cognition." />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI Generation Pipeline</Text>
        <Text style={styles.bodyText}>
          The workflow is designed for text-to-audio systems including Suno, Udio, Stable Audio,
          and MusicGen. Prompt structure encodes spatial motion, reverb geometry, dynamic EQ behavior,
          and optional beta-range binaural differences.
        </Text>
      </View>

      <View style={[styles.section, styles.lastSection]}>
        <Text style={styles.sectionTitle}>Citations in Source Document</Text>
        <View style={styles.citationList}>
          <Citation text="1. 8D audio as three-dimensional, binaurally panned spatial audio and reported focus effects." />
          <Citation text="3. ADHD prevalence data and need for non-pharmacological adjuncts." />
          <Citation text="4. Bilateral stimulation context from EMDR and related frameworks." />
          <Citation text="6. Persistence of ADHD symptoms and limits of multimodal treatment alone." />
          <Citation text="8. Neurological responses including entrainment and phase-locking in attentional systems." />
          <Citation text="10. Continuous cognitive tracking induced by spatial acoustic manipulation." />
          <Citation text="11. AI text-to-audio model applicability for spatial focus soundscape generation." />
          <Citation text="15. Dopamine and norepinephrine under-arousal framing in ADHD." />
          <Citation text="16. Dynamic panning as a defining feature of the 8D profile." />
        </View>
      </View>
    </ScrollView>
  );
}

type CardProps = {
  title: string;
  text: string;
};

function Card({ title, text }: CardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardText}>{text}</Text>
    </View>
  );
}

type CitationProps = {
  text: string;
};

function Citation({ text }: CitationProps) {
  return (
    <View style={styles.citationRow}>
      <Text style={styles.citationDot}>-</Text>
      <Text style={styles.citationText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0f172a',
    paddingBottom: 28,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 22,
    color: '#93c5fd',
    fontWeight: '700',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#fff8e6',
    fontSize: 20,
    fontWeight: '700',
    marginRight: 32,
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 65, 85, 0.3)',
  },
  lastSection: {
    borderBottomWidth: 0,
  },
  sectionTitle: {
    color: '#fff8e6',
    fontSize: 21,
    fontWeight: '700',
    marginBottom: 10,
  },
  bodyText: {
    color: '#cbd5e1',
    lineHeight: 24,
    fontSize: 15,
  },
  cardList: {
    gap: 10,
  },
  card: {
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
  },
  cardTitle: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardText: {
    color: '#bfdbfe',
    lineHeight: 20,
    fontSize: 13,
  },
  citationList: {
    gap: 8,
  },
  citationRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  citationDot: {
    color: '#7dd3fc',
    fontWeight: '700',
  },
  citationText: {
    color: '#dbeafe',
    flex: 1,
    lineHeight: 20,
    fontSize: 13,
  },
});
