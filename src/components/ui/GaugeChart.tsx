// ============================================================
// GaugeChart — Animated circular gauge for engagement scores
// ============================================================

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Props {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  color?: string;
  glowColor?: string;
}

export default function GaugeChart({
  value,
  size = 180,
  strokeWidth = 12,
  label = 'Score',
  color = '#00f0ff',
  glowColor = 'rgba(0, 240, 255, 0.3)',
}: Props) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const arc = circumference * 0.75; // 270 degrees
  const offset = arc - (animatedValue / 100) * arc;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 300);
    return () => clearTimeout(timer);
  }, [value]);

  const getColor = (val: number) => {
    if (val >= 80) return '#39ff14';
    if (val >= 60) return color;
    if (val >= 40) return '#ff6b35';
    return '#ff006e';
  };

  const activeColor = getColor(value);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-[135deg]">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arc} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Active arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={activeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arc} ${circumference}`}
            strokeLinecap="round"
            initial={{ strokeDashoffset: arc }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 2, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 8px ${glowColor})` }}
          />
        </svg>
        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-4xl font-bold font-display"
            style={{ color: activeColor }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {Math.round(animatedValue)}
          </motion.span>
          <span className="text-xs text-gray-400 uppercase tracking-wider mt-1">{label}</span>
        </div>
      </div>
    </div>
  );
}
