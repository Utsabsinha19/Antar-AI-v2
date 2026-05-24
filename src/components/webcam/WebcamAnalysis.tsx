// ============================================================
// WebcamAnalysis - Live camera and microphone analysis
// ============================================================

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Camera, CameraOff, Maximize2, Minimize2, RefreshCw, Mic, AlertTriangle } from 'lucide-react';
import { FaceBox, useAnalysis } from '@/store/analysisStore';

interface NativeFace {
  boundingBox: DOMRectReadOnly;
}

interface NativeFaceDetector {
  detect: (source: HTMLVideoElement) => Promise<NativeFace[]>;
}

type FaceDetectorConstructor = new (options?: { fastMode?: boolean; maxDetectedFaces?: number }) => NativeFaceDetector;

declare global {
  interface Window {
    FaceDetector?: FaceDetectorConstructor;
    webkitAudioContext?: typeof AudioContext;
  }
}

export default function WebcamAnalysis() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const detectorRef = useRef<NativeFaceDetector | null>(null);

  const { metrics, status, startSession, stopSession, ingestSample } = useAnalysis();
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [faceBox, setFaceBox] = useState<FaceBox | null>(null);
  const [detectorAvailable, setDetectorAvailable] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const facePresenceRef = useRef(metrics.facePresence);

  const cleanup = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    audioContextRef.current?.close();
    audioContextRef.current = null;
    analyserRef.current = null;
    setIsStreaming(false);
    setFaceBox(null);
  }, []);

  useEffect(() => cleanup, [cleanup]);

  // Effect to trigger pulse animation on first face detection
  useEffect(() => {
    if (metrics.facePresence > 0 && facePresenceRef.current === 0) {
      setIsPulsing(true);
    }
    facePresenceRef.current = metrics.facePresence;
  }, [metrics.facePresence]);

  // Effect to synchronize component state with global analysis status
  useEffect(() => {
    if (status === 'running' && !isStreaming) {
      void startWebcam();
    } else if (status !== 'running' && isStreaming) {
      cleanup();
    }
  }, [status, isStreaming, startWebcam, cleanup]);

  const readAudioEnergy = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return 0;

    const data = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(data);
    let sum = 0;
    for (const sample of data) {
      const centered = (sample - 128) / 128;
      sum += centered * centered;
    }
    const rms = Math.sqrt(sum / data.length);
    return Math.min(100, rms * 320);
  }, []);

  const analyzeFrame = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !isStreaming) return;

    let detectedBox: FaceBox | undefined;
    let faceDetected: boolean | null = detectorAvailable ? false : null;

    if (detectorRef.current && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      try {
        const faces = await detectorRef.current.detect(video);
        const face = faces[0];
        if (face) {
          const box = face.boundingBox;
          detectedBox = {
            x: box.x,
            y: box.y,
            width: box.width,
            height: box.height,
          };
          faceDetected = true;
          setFaceBox(detectedBox);
        } else {
          setFaceBox(null);
        }
      } catch {
        faceDetected = null;
        setDetectorAvailable(false);
        detectorRef.current = null;
      }
    }

    ingestSample({
      faceDetected,
      faceBox: detectedBox,
      videoWidth: video.videoWidth,
      videoHeight: video.videoHeight,
      audioEnergy: readAudioEnergy(),
      tabVisible: document.visibilityState === 'visible',
      detectorAvailable,
      capturedAt: Date.now(),
    });

    rafRef.current = window.setTimeout(() => {
      void analyzeFrame();
    }, 700) as unknown as number;
  }, [detectorAvailable, ingestSample, isStreaming, readAudioEnergy]);

  const startWebcam = useCallback(async () => {
    if (isStreaming) return;
    setIsLoading(true);
    setError(null);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Media devices API not supported');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 960 }, height: { ideal: 540 } },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        const audioContext = new AudioContextClass();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 1024;
        audioContext.createMediaStreamSource(stream).connect(analyser);
        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
      }

      if (window.FaceDetector) {
        detectorRef.current = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
        setDetectorAvailable(true);
      } else {
        detectorRef.current = null;
        setDetectorAvailable(false);
      }

      setIsStreaming(true);
    } catch (err) {
      cleanup();
      console.error('Webcam error:', err);
      setError('Unable to access camera or microphone. Please check browser permissions.');
      if (status === 'running') {
        stopSession(); // Revert global state if starting failed
      }
    } finally {
      setIsLoading(false);
    }
  }, [isStreaming, cleanup, status, stopSession]);

  const stopWebcam = useCallback(() => {
    stopSession();
    cleanup();
  }, [cleanup, stopSession]);

  useEffect(() => {
    if (isStreaming) {
      void analyzeFrame();
    }
  }, [analyzeFrame, isStreaming]);

  const faceBoxStyle = faceBox && videoRef.current
    ? {
        left: `${(faceBox.x / videoRef.current.videoWidth) * 100}%`,
        top: `${(faceBox.y / videoRef.current.videoHeight) * 100}%`,
        width: `${(faceBox.width / videoRef.current.videoWidth) * 100}%`,
        height: `${(faceBox.height / videoRef.current.videoHeight) * 100}%`,
      }
    : undefined;

  const pulseVariants: Variants = {
    initial: {
      scale: 1,
      boxShadow: '0 0 20px rgba(0,240,255,0.22)',
    },
    pulse: {
      scale: [1, 1.1, 1],
      boxShadow: [
        '0 0 20px rgba(0,240,255,0.22)',
        '0 0 40px rgba(0,240,255,0.5)',
        '0 0 20px rgba(0,240,255,0.22)',
      ],
      transition: { duration: 1.5, ease: 'easeInOut' },
    },
  };

  return (
    <div className={`glass rounded-2xl overflow-hidden transition-all ${expanded ? 'fixed inset-4 z-50' : ''}`}>
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${isStreaming ? 'bg-green-400 pulse-glow' : 'bg-gray-600'}`} />
          <h3 className="text-sm font-semibold">Live Sensor Analysis</h3>
          {isStreaming && <span className="text-[10px] text-green-400 uppercase tracking-wider">Recording</span>}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
        >
          {expanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
      </div>

      <div className="relative aspect-video bg-dark-800">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${isStreaming ? 'opacity-100' : 'opacity-0'}`}
        />

        {!isStreaming && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <Camera size={48} className="text-gray-600 mb-4" />
            <p className="text-sm text-gray-300 mb-2">Start a real analysis session</p>
            <p className="text-xs text-gray-500 mb-4 max-w-sm">
              Antar AI will use your camera, microphone energy, and tab visibility to calculate live engagement.
            </p>
            <button
              onClick={startSession}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <Camera size={16} />
              Start Analysis
            </button>
            {error && <p className="text-xs text-red-400 mt-3">{error}</p>}
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <RefreshCw size={32} className="text-cyan-400 animate-spin mb-3" />
            <p className="text-sm text-gray-400">Requesting camera and microphone...</p>
            <p className="text-xs text-gray-500 mt-1">Please allow browser access</p>
          </div>
        )}

        <AnimatePresence>
          {isStreaming && (
            <motion.div
              key="webcam-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
            >
              {faceBoxStyle && (
                <motion.div
                  className="absolute border-2 border-cyan-400/70 rounded-xl"
                  style={faceBoxStyle}
                  variants={pulseVariants}
                  initial="initial"
                  animate={isPulsing ? 'pulse' : 'initial'}
                  onAnimationComplete={() => setIsPulsing(false)}
                />
              )}

              <div className="absolute top-3 left-3 space-y-1">
                <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2.5 py-1.5 flex items-center gap-2">
                  {detectorAvailable ? (
                    <>
                      <div className={`w-1.5 h-1.5 rounded-full ${metrics.facePresence > 0 ? 'bg-green-400' : 'bg-yellow-400'}`} />
                      <span className="text-[10px] text-gray-200 font-mono">
                        {metrics.facePresence > 0 ? 'FACE DETECTED' : 'SEARCHING FACE'}
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={12} className="text-yellow-400" />
                      <span className="text-[10px] text-yellow-300 font-mono">FACE API UNAVAILABLE</span>
                    </>
                  )}
                </div>
                <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2.5 py-1.5 flex items-center gap-2">
                  <Mic size={12} className="text-cyan-400" />
                  <span className="text-[10px] text-gray-200 font-mono">VOICE ENERGY {metrics.voice.toFixed(0)}%</span>
                </div>
              </div>

              <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-sm rounded-xl p-3 grid grid-cols-4 gap-2">
                {[
                  { label: 'ATT', value: metrics.attentionConfidence, color: '#00f0ff' },
                  { label: 'FOC', value: metrics.deepFocus, color: '#39ff14' },
                  { label: 'VOICE', value: metrics.voice, color: '#b44aff' },
                  { label: 'ENG', value: metrics.engagement, color: '#ff6b35' },
                ].map(item => (
                  <div key={item.label} className="text-center">
                    <p className="text-[9px] text-gray-500 font-mono">{item.label}</p>
                    <p className="text-sm font-mono font-bold" style={{ color: item.color }}>
                      {item.value.toFixed(0)}%
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isStreaming && (
        <div className="p-3 flex items-center justify-between border-t border-white/5">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>Status: <span className="text-cyan-400 capitalize">{status}</span></span>
            <span>Confidence: <span className="text-green-400">{metrics.confidence.toFixed(0)}%</span></span>
          </div>
          <button
            onClick={stopWebcam}
            className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/30 transition-colors flex items-center gap-1.5"
          >
            <CameraOff size={12} />
            Stop
          </button>
        </div>
      )}
    </div>
  );
}
