// ============================================================
// HeatmapChart - Session intensity heatmap from captured samples
// ============================================================

import { motion } from 'framer-motion';
import { TimeSeriesPoint } from '@/store/analysisStore';

interface Props {
  data?: TimeSeriesPoint[];
}

const rows = ['0-5m', '5-10m', '10-15m', '15-20m', '20m+'];
const cols = ['Attention', 'Focus', 'Voice', 'Engage'];

function getColor(value: number): string {
  if (value >= 80) return 'rgba(0, 240, 255, 0.8)';
  if (value >= 60) return 'rgba(0, 240, 255, 0.5)';
  if (value >= 40) return 'rgba(180, 74, 255, 0.5)';
  if (value >= 20) return 'rgba(180, 74, 255, 0.25)';
  return 'rgba(255, 255, 255, 0.05)';
}

function parseSeconds(time: string) {
  const [minutes, seconds] = time.split(':').map(Number);
  return minutes * 60 + seconds;
}

function average(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

export default function HeatmapChart({ data = [] }: Props) {
  const buckets = rows.map((_, bucketIndex) => {
    const min = bucketIndex * 300;
    const max = bucketIndex === rows.length - 1 ? Number.POSITIVE_INFINITY : min + 300;
    const bucket = data.filter(point => {
      const seconds = parseSeconds(point.time);
      return seconds >= min && seconds < max;
    });

    return [
      average(bucket.map(point => point.attention)),
      average(bucket.map(point => point.focus)),
      average(bucket.map(point => point.voice)),
      average(bucket.map(point => point.engagement)),
    ];
  });

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[420px]">
        <div className="grid grid-cols-[64px_repeat(4,1fr)] gap-2 mb-2">
          <div />
          {cols.map(col => (
            <div key={col} className="text-[10px] text-gray-500 text-center">{col}</div>
          ))}
        </div>
        {buckets.map((row, rowIndex) => (
          <div key={rows[rowIndex]} className="grid grid-cols-[64px_repeat(4,1fr)] gap-2 mb-2 items-center">
            <span className="text-[10px] text-gray-500 text-right">{rows[rowIndex]}</span>
            {row.map((value, colIndex) => (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: rowIndex * 0.05 + colIndex * 0.03 }}
                className="h-10 rounded-md flex items-center justify-center text-[10px] text-white/80"
                style={{ background: getColor(value) }}
                title={`${rows[rowIndex]} ${cols[colIndex]}: ${Math.round(value)}%`}
              >
                {Math.round(value)}%
              </motion.div>
            ))}
          </div>
        ))}
        <div className="flex items-center gap-2 mt-4 ml-16">
          <span className="text-[10px] text-gray-500">Low</span>
          {[10, 30, 50, 70, 90].map(value => (
            <div key={value} className="w-3 h-3 rounded-sm" style={{ background: getColor(value) }} />
          ))}
          <span className="text-[10px] text-gray-500">High</span>
        </div>
      </div>
    </div>
  );
}
