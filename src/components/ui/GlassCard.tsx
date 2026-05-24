// ============================================================
// GlassCard — Reusable glassmorphism card component
// ============================================================

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'cyan' | 'purple' | 'none';
  animate?: boolean;
  delay?: number;
  onClick?: () => void;
}

export default function GlassCard({ children, className = '', hover = true, glow = 'none', animate = true, delay = 0, onClick }: Props) {
  const glowClass = glow === 'cyan' ? 'glow-cyan' : glow === 'purple' ? 'glow-purple' : '';
  
  const content = (
    <div
      onClick={onClick}
      className={`
        glass rounded-2xl p-6
        ${hover ? 'hover:bg-white/[0.06] transition-all duration-300 hover:border-white/15' : ''}
        ${glowClass}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );

  if (!animate) return content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {content}
    </motion.div>
  );
}
