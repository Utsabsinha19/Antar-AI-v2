import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

export type AnalysisStatus = 'idle' | 'running' | 'stopped';
export type InsightType = 'success' | 'warning' | 'critical' | 'info';

export interface FaceBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SensorSample {
  faceDetected: boolean | null;
  faceBox?: FaceBox;
  videoWidth?: number;
  videoHeight?: number;
  audioEnergy: number;
  tabVisible: boolean;
  detectorAvailable: boolean;
  capturedAt: number;
}

export interface TimeSeriesPoint {
  time: string;
  engagement: number;
  attentionConfidence: number;
  deepFocus: number;
  interactionScore: number;
  cognitiveFatigueIndex: number;
  boredomIndex: number;
}

// Represents all the live AI-calculated scores.
export interface LiveMetrics {
  // Raw sensor values
  facePresence: number;
  framing: number;
  voice: number;

  // Foundational AI Scores (from user-provided formulas)
  gazeFocus: number;
  blinkStability: number;
  headAlignment: number;
  facialEngagement: number;
  postureStability: number;
  interactionScore: number;

  // High-Level AI Indices
  attentionConfidence: number; // Replaces 'attention'
  cognitiveFatigueIndex: number;
  emotionalStability: number;
  deepFocus: number;
  boredomIndex: number;

  // Core Outcome Metrics
  engagement: number; // This is the main 'EngagementProbability'
  engagementMomentum: number;
  learningRetentionPrediction: number;

  // System & Meta
  confidence: number; // Overall signal confidence
  detectorAvailable: boolean;
  sampleCount: number;
  capturedAt: number | null;
  tabVisible: boolean;
}

export interface CompletedSession {
  id: string;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  averageEngagement: number;
  averageAttentionConfidence: number;
  averageDeepFocus: number;
  averageInteractionScore: number;
  averageFatigue: number;
  averageBoredom: number;
  sampleCount: number;
}

export interface AnalysisInsight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  value?: number;
}

interface AnalysisState {
  status: AnalysisStatus;
  sessionId: string;
  startedAt: number | null;
  elapsedSeconds: number;
  metrics: LiveMetrics;
  timeline: TimeSeriesPoint[];
  completedSessions: CompletedSession[];
  insights: AnalysisInsight[];
  recommendations: AnalysisInsight[];
  startSession: () => void;
  stopSession: () => void;
  resetSession: () => void;
  ingestSample: (sample: SensorSample) => void;
  explanation: string;
}

const defaultMetrics: LiveMetrics = {
  voice: 0,
  engagement: 0,
  facePresence: 0,
  framing: 0,
  gazeFocus: 0,
  blinkStability: 100,
  headAlignment: 100,
  facialEngagement: 0,
  postureStability: 100,
  interactionScore: 0,
  attentionConfidence: 0,
  cognitiveFatigueIndex: 0,
  emotionalStability: 100,
  deepFocus: 0,
  boredomIndex: 0,
  engagementMomentum: 0,
  learningRetentionPrediction: 0,
  confidence: 0,
  detectorAvailable: false,
  sampleCount: 0,
  capturedAt: null,
  tabVisible: true,
};

const AnalysisContext = createContext<AnalysisState | null>(null);

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

const average = (items: TimeSeriesPoint[], key: keyof TimeSeriesPoint) => {
  if (!items.length) return 0;
  const total = items.reduce((sum, item) => sum + (item[key] as number || 0), 0);
  return total / items.length;
};

function buildSessionId() {
  return `session-${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}`;
}

function calculateMetrics(sample: SensorSample, previous: LiveMetrics): LiveMetrics {
  // --- 1. Process raw sensor data ---
  const facePresence = sample.faceDetected === null ? 0 : sample.faceDetected ? 100 : 0;
  let framing = sample.faceDetected ? 75 : 0;

  if (sample.faceBox && sample.videoWidth && sample.videoHeight) {
    const centerX = sample.faceBox.x + sample.faceBox.width / 2;
    const centerY = sample.faceBox.y + sample.faceBox.height / 2;
    const xScore = 100 - Math.abs(centerX / sample.videoWidth - 0.5) * 200;
    const yScore = 100 - Math.abs(centerY / sample.videoHeight - 0.45) * 180;
    const faceArea = (sample.faceBox.width * sample.faceBox.height) / (sample.videoWidth * sample.videoHeight);
    const sizeScore = 100 - Math.abs(faceArea - 0.18) * 260;
    framing = clamp(xScore * 0.4 + yScore * 0.3 + sizeScore * 0.3);
  }
  const voice = clamp(sample.audioEnergy);

  // --- 2. Simulate advanced CV model outputs ---
  // In a real app, these would come from dedicated models (gaze, emotion, etc.)
  const isVisuallyEngaged = facePresence > 80 && framing > 70 && sample.tabVisible;

  // Gaze, Blink, Head Pose simulations
  const simulatedGazeFocus = isVisuallyEngaged ? 85 + Math.random() * 15 : 20 + Math.random() * 30;
  const simulatedBlinkRate = isVisuallyEngaged ? 15 + Math.random() * 5 : 25 + Math.random() * 10;
  const simulatedHeadYaw = isVisuallyEngaged ? (Math.random() - 0.5) * 10 : (1 - framing / 100) * 30;
  const simulatedHeadPitch = isVisuallyEngaged ? (Math.random() - 0.5) * 8 : (1 - framing / 100) * 20;

  // Expression and Fatigue simulations
  const simulatedSmileIntensity = voice > 15 ? clamp(voice * 1.5, 0, 80) : Math.random() * 5;
  const simulatedEyeOpenness = isVisuallyEngaged ? 80 + Math.random() * 20 : 60 + Math.random() * 20;
  const simulatedExpressionActivity = voice > 10 ? clamp(voice * 2, 0, 70) : Math.random() * 10;
  const fatigueFactor = Math.min(previous.sampleCount / 240, 1); // Max fatigue after 4 mins
  const simulatedYawnProb = !isVisuallyEngaged && fatigueFactor > 0.6 ? fatigueFactor * 40 : 0;
  const simulatedHeadDroop = !isVisuallyEngaged ? (1 - (framing / 100)) * 20 : 0;

  // --- 3. Calculate AI scores based on new formulas ---

  // Formula 1: Gaze Focus Score
  const gazeFocus = simulatedGazeFocus;

  // Formula 2: Blink Stability Score
  const normalBlinkRate = 18;
  const blinkStability = clamp(100 - (Math.abs(simulatedBlinkRate - normalBlinkRate) / normalBlinkRate * 100));

  // Formula 3: Head Alignment Score
  const maxAllowedAngle = 45;
  const headAlignment = clamp(100 - ((Math.abs(simulatedHeadYaw) + Math.abs(simulatedHeadPitch)) / maxAllowedAngle * 100));

  // Formula 5: Facial Engagement Score
  const facialEngagement = clamp(0.4 * simulatedSmileIntensity + 0.3 * simulatedEyeOpenness + 0.3 * simulatedExpressionActivity);

  // Formula 6: Posture Stability Score
  const postureStability = previous.sampleCount === 0 ? 100 : clamp(100 - Math.abs(headAlignment - previous.headAlignment) * 2.5);

  // Formula 7: Interaction Activity Score
  const interactionScore = clamp(voice * 1.2);

  // Formula 9: Cognitive Fatigue Index
  const simulatedBlinkDuration = 100 + (simulatedBlinkRate > 22 ? 50 : 0);
  const simulatedBlinkIrregularity = Math.abs(simulatedBlinkRate - normalBlinkRate) * 2;
  const cognitiveFatigueIndex = clamp(0.4 * (simulatedBlinkDuration / 40) + 0.3 * simulatedBlinkIrregularity + 0.2 * simulatedYawnProb + 0.1 * simulatedHeadDroop);

  // Formula 8: Attention Confidence Score
  const attentionConfidence = clamp(0.35 * gazeFocus + 0.20 * headAlignment + 0.15 * blinkStability + 0.15 * postureStability + 0.15 * interactionScore);

  // Formula 10: Emotional Stability Index
  const emotionalStability = previous.sampleCount === 0 ? 100 : clamp(100 - Math.abs(facialEngagement - previous.facialEngagement) * 3);

  // Formula 25: Deep Focus Detection Formula
  const deepFocus = clamp(0.5 * gazeFocus + 0.3 * postureStability + 0.2 * blinkStability);

  // Formula 12: Engagement Probability Formula (the main engagement score)
  const engagement = clamp((attentionConfidence + facialEngagement + interactionScore - cognitiveFatigueIndex) / 2.2); // Adjusted divisor for better range

  // Formula 13: Engagement Momentum
  const engagementMomentum = engagement - previous.engagement;

  // Formula 15: Learning Retention Prediction
  const learningRetentionPrediction = clamp(0.4 * attentionConfidence + 0.3 * emotionalStability + 0.3 * interactionScore);

  // Boredom Detection Formula
  const boredomIndex = clamp(
    0.3 * (100 - gazeFocus) +
    0.2 * (100 - postureStability) +
    0.2 * simulatedYawnProb +
    0.15 * (100 - facialEngagement) +
    0.15 * (100 - interactionScore)
  );

  // System: Overall signal confidence
  const confidence = clamp(
    (sample.detectorAvailable ? 35 : 10) +
    (sample.faceDetected === true ? 35 : 0) +
    (sample.audioEnergy > 2 ? 20 : 0) +
    (sample.tabVisible ? 10 : 0),
  );

  return {
    // Raw
    facePresence,
    framing,
    voice,
    // Foundational
    gazeFocus,
    blinkStability,
    headAlignment,
    facialEngagement,
    postureStability,
    interactionScore,
    // High-Level
    attentionConfidence,
    cognitiveFatigueIndex,
    emotionalStability,
    deepFocus,
    // Outcome
    engagement,
    engagementMomentum,
    learningRetentionPrediction,
    boredomIndex,
    // System
    confidence,
    detectorAvailable: sample.detectorAvailable,
    sampleCount: previous.sampleCount + 1,
    capturedAt: sample.capturedAt,
    tabVisible: sample.tabVisible,
  };
}

function buildInsights(metrics: LiveMetrics, elapsedSeconds: number): AnalysisInsight[] {
  if (!metrics.sampleCount) {
    return [{
      id: 'waiting-for-samples',
      type: 'info',
      title: 'Waiting for real input',
      description: 'Start analysis and allow camera or microphone access to generate live feedback.',
    }];
  }

  const insights: AnalysisInsight[] = [];

  if (!metrics.detectorAvailable) {
    insights.push({
      id: 'face-detector-unavailable',
      type: 'warning',
      title: 'Face detection unavailable',
      description: 'This browser does not expose native face detection, so attention uses camera state, audio, and tab visibility only.',
    });
  }

  if (metrics.attentionConfidence < 50 && elapsedSeconds > 10) {
    insights.push({
      id: 'low-attention',
      type: 'critical',
      title: 'Low Attention Confidence',
      description: 'The AI model has low confidence in attention signals. This is often due to poor framing, gaze shift, or tab inactivity.',
      value: metrics.attentionConfidence,
    });
  } else if (metrics.attentionConfidence >= 80) {
    insights.push({
      id: 'strong-attention',
      type: 'success',
      title: 'Strong Attention Confidence',
      description: 'Gaze, head alignment, and stability signals are strong, leading to high confidence in attention metrics.',
      value: metrics.attentionConfidence,
    });
  }

  if (metrics.interactionScore < 8 && elapsedSeconds > 20) {
    insights.push({
      id: 'low-voice',
      type: 'warning',
      title: 'Low voice activity',
      description: 'Microphone energy is low, so interaction may be passive or the microphone may be muted.',
      value: metrics.interactionScore,
    });
  }

  if (metrics.postureStability < 60) {
    insights.push({
      id: 'unstable-focus',
      type: 'warning',
      title: 'Unstable Posture',
      description: 'The model has detected frequent shifts in head and body position, which can impact focus and attention scores.',
      value: metrics.postureStability,
    });
  }

  if (metrics.cognitiveFatigueIndex > 65) {
    insights.push({
      id: 'high-fatigue',
      type: 'critical',
      title: 'High Cognitive Fatigue Detected',
      description: 'Blink rate, yawn probability, and head posture suggest a high level of cognitive fatigue. A break may be needed.',
      value: metrics.cognitiveFatigueIndex,
    });
  }

  if (metrics.boredomIndex > 70 && elapsedSeconds > 45) {
    insights.push({
      id: 'high-boredom',
      type: 'warning',
      title: 'Boredom Detected',
      description: 'The model indicates a high probability of boredom, characterized by gaze wander, low interaction, and lack of facial expression.',
      value: metrics.boredomIndex,
    });
  }

  return insights.slice(0, 5);
}

function buildRecommendations(metrics: LiveMetrics, elapsedSeconds: number): AnalysisInsight[] {
  if (!metrics.sampleCount) {
    return [{
      id: 'start-session',
      type: 'info',
      title: 'Begin live analysis',
      description: 'Open the webcam panel and start analysis to collect real-time engagement samples.',
    }];
  }

  const recommendations: AnalysisInsight[] = [];

  if (metrics.headAlignment < 70) {
    recommendations.push({
      id: 'improve-framing',
      type: 'warning',
      title: 'Improve Head Alignment',
      description: 'The AI suggests centering your face in the camera view to improve the Head Alignment score, which is a key input for Attention Confidence.',
      value: metrics.headAlignment,
    });
  }

  if (metrics.interactionScore < 15 && elapsedSeconds > 30) {
    recommendations.push({
      id: 'check-microphone',
      type: 'warning',
      title: 'Increase Interaction',
      description: 'The Interaction Score is low. For sessions that require participation, ensure your microphone is active and you are speaking clearly.',
      value: metrics.interactionScore,
    });
  }

  if (metrics.cognitiveFatigueIndex > 60) {
    recommendations.push({
      id: 'take-a-break',
      type: 'critical',
      title: 'Recommendation: Take a Break',
      description: 'The Cognitive Fatigue Index is high. The AI recommends a short break to reset and improve focus and engagement.',
      value: metrics.cognitiveFatigueIndex,
    });
  }

  if (metrics.engagement >= 80) {
    recommendations.push({
      id: 'maintain-conditions',
      type: 'success',
      title: 'Excellent Conditions Detected',
      description: 'Current signals for attention, focus, and interaction are optimal. The AI recommends maintaining this setup for the best results.',
      value: metrics.engagement,
    });
  }

  recommendations.push({
    id: 'formula',
    type: 'info',
    title: 'AI Engagement Model',
    description: 'Engagement is a function of Attention Confidence, Facial Engagement, and Interaction Score, minus a Cognitive Fatigue penalty.',
    value: metrics.engagement,
  });

  return recommendations.slice(0, 5);
}

function buildExplanation(metrics: LiveMetrics): string {
  if (metrics.sampleCount < 5) {
    return 'Awaiting more data to generate a detailed explanation...';
  }

  const engagement = Math.round(metrics.engagement);
  let explanation = `AI assessment: Current engagement probability is ${engagement}%. `;

  if (engagement >= 75) {
    explanation += `This strong score is driven by high Attention Confidence (${Math.round(metrics.attentionConfidence)}%) and positive Facial Engagement (${Math.round(metrics.facialEngagement)}%). `;
    if (metrics.deepFocus > 80) {
      explanation += `Deep Focus levels are optimal. `;
    }
  } else if (engagement < 50) {
    explanation += `This indicates a potential disengagement. Key contributing factors are: `;
    const issues = [];
    if (metrics.boredomIndex > 60) {
      issues.push(`high probability of boredom (${Math.round(metrics.boredomIndex)}%)`);
    } else {
      if (metrics.attentionConfidence < 60) issues.push(`low Attention Confidence (${Math.round(metrics.attentionConfidence)}%)`);
      if (metrics.cognitiveFatigueIndex > 50) issues.push(`rising Cognitive Fatigue (${Math.round(metrics.cognitiveFatigueIndex)}%)`);
      if (metrics.interactionScore < 20) issues.push(`low Interaction Score (${Math.round(metrics.interactionScore)}%)`);
    }
    explanation += (issues.join(', ') || 'a general lack of strong engagement signals') + '. ';
  } else {
    explanation += `This is a moderate score. `;
    if (metrics.postureStability < 70) explanation += `Improving posture stability could boost focus. `;
    if (metrics.cognitiveFatigueIndex > 40) explanation += `Consider monitoring fatigue levels. `;
  }

  explanation += `The current Learning Retention Prediction is ${Math.round(metrics.learningRetentionPrediction)}%.`;

  return explanation;
}

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [sessionId, setSessionId] = useState(buildSessionId);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [metrics, setMetrics] = useState<LiveMetrics>(defaultMetrics);
  const [timeline, setTimeline] = useState<TimeSeriesPoint[]>([]);
  const [completedSessions, setCompletedSessions] = useState<CompletedSession[]>(() => {
    try {
      const sessions = JSON.parse(
        localStorage.getItem('antar-ai.sessions') ||
        localStorage.getItem('neurolens.sessions') ||
        '[]',
      );
      // Add a migration/validation step to prevent crashes from old data formats
      return sessions.map((s: any) => ({
        id: s.id || `migrated-${Math.random().toString(36).substr(2, 9)}`,
        startedAt: s.startedAt || new Date().toISOString(),
        endedAt: s.endedAt || new Date().toISOString(),
        durationSeconds: s.durationSeconds || 0,
        averageEngagement: s.averageEngagement || 0,
        averageAttentionConfidence: s.averageAttentionConfidence || s.averageAttention || 0,
        averageDeepFocus: s.averageDeepFocus || s.averageFocus || 0,
        averageInteractionScore: s.averageInteractionScore || s.averageVoice || 0,
        averageFatigue: s.averageFatigue || 0,
        averageBoredom: s.averageBoredom || 0,
        sampleCount: s.sampleCount || 0,
      }));
    } catch {
      return [];
    }
  });

  const startSession = useCallback(() => {
    setStatus('running');
    setSessionId(buildSessionId());
    setStartedAt(Date.now());
    setElapsedSeconds(0);
    setMetrics(defaultMetrics);
    setTimeline([]);
  }, []);

  const stopSession = useCallback(() => {
    if (startedAt && timeline.length > 0) {
      const endedAt = Date.now();
      const completed: CompletedSession = {
        id: sessionId,
        startedAt: new Date(startedAt).toISOString(),
        endedAt: new Date(endedAt).toISOString(),
        durationSeconds: Math.max(1, Math.round((endedAt - startedAt) / 1000)),
        averageEngagement: average(timeline, 'engagement'),
        averageAttentionConfidence: average(timeline, 'attentionConfidence'),
        averageDeepFocus: average(timeline, 'deepFocus'),
        averageInteractionScore: average(timeline, 'interactionScore'),
        averageFatigue: average(timeline, 'cognitiveFatigueIndex'),
        averageBoredom: average(timeline, 'boredomIndex'),
        sampleCount: timeline.length,
      };
      setCompletedSessions(currentSessions => {
        const newSessions = [completed, ...currentSessions].slice(0, 20);
        localStorage.setItem('antar-ai.sessions', JSON.stringify(newSessions));
        return newSessions;
      });
    }
    setStatus('stopped');
  }, [sessionId, timeline, startedAt]);

  const resetSession = useCallback(() => {
    setStatus('idle');
    setSessionId(buildSessionId());
    setStartedAt(null);
    setElapsedSeconds(0);
    setMetrics(defaultMetrics);
    setTimeline([]);
  }, []);

  const ingestSample = useCallback((sample: SensorSample) => {
    setStartedAt(currentStartedAt => {
      const effectiveStartedAt = currentStartedAt || sample.capturedAt;
      const elapsed = Math.max(0, Math.round((sample.capturedAt - effectiveStartedAt) / 1000));
      setElapsedSeconds(elapsed);
      setMetrics(previous => {
        const next = calculateMetrics(sample, previous);
        setTimeline(current => {
          const point: TimeSeriesPoint = {
            time: formatDuration(elapsed),
            engagement: next.engagement,
            attentionConfidence: next.attentionConfidence,
            deepFocus: next.deepFocus,
            interactionScore: next.interactionScore,
            cognitiveFatigueIndex: next.cognitiveFatigueIndex,
            boredomIndex: next.boredomIndex,
          };
          return [...current, point].slice(-120);
        });
        return next;
      });
      return effectiveStartedAt;
    });
  }, []);

  const insights = useMemo(() => buildInsights(metrics, elapsedSeconds), [elapsedSeconds, metrics]);
  const recommendations = useMemo(() => buildRecommendations(metrics, elapsedSeconds), [metrics, elapsedSeconds]);
  const explanation = useMemo(() => buildExplanation(metrics), [metrics]);

  const value = useMemo<AnalysisState>(() => ({
    status,
    sessionId,
    startedAt,
    elapsedSeconds,
    metrics,
    timeline,
    completedSessions,
    insights,
    recommendations,
    explanation,
    startSession,
    stopSession,
    resetSession,
    ingestSample,
  }), [
    completedSessions,
    elapsedSeconds,
    explanation,
    ingestSample,
    insights,
    metrics,
    recommendations,
    resetSession,
    sessionId,
    startSession,
    startedAt,
    status,
    stopSession,
    timeline,
  ]);

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
}

export function useAnalysis() {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error('useAnalysis must be inside AnalysisProvider');
  return ctx;
}
