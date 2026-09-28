'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Mic, StopCircle, Radio } from 'lucide-react';

interface ListeningVisualizerProps {
  transcript?: string;
  onStopListening?: () => void;
  className?: string;
}

export const ListeningVisualizer: React.FC<ListeningVisualizerProps> = ({
  transcript = 'Capturing continuous voice / event stream...',
  onStopListening,
  className = '',
}) => {
  // Waveform bars with staggered animation
  const bars = [16, 28, 40, 24, 36, 48, 30, 20, 38, 22, 14];

  return (
    <div
      className={`w-full p-4 rounded-2xl border border-blue-200/80 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/20 text-left space-y-3 shadow-sm ${className}`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600" />
          </div>
          <span className="text-xs font-semibold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
            <span>Streaming Multimodal Audio Channel</span>
          </span>
        </div>

        {onStopListening && (
          <button
            type="button"
            onClick={onStopListening}
            className="flex items-center gap-1 text-[11px] font-medium text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100 transition"
          >
            <StopCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>Finish Stream</span>
          </button>
        )}
      </div>

      {/* Micro-animated Soundwave Bars */}
      <div className="h-12 flex items-center justify-center gap-1.5 bg-blue-100/40 dark:bg-zinc-950/60 rounded-xl px-4 border border-blue-200/40 dark:border-blue-950">
        <Mic className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2 opacity-80" />
        {bars.map((height, i) => (
          <motion.div
            key={i}
            className="w-1 bg-blue-500 dark:bg-blue-400 rounded-full"
            animate={{
              height: [8, height, 10],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: i * 0.08,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Live Transcript / Input preview */}
      <div className="p-2.5 rounded-lg bg-white/80 dark:bg-zinc-900/60 border border-blue-100 dark:border-blue-950/80 text-xs text-zinc-700 dark:text-zinc-300">
        <span className="font-semibold text-zinc-500 text-[10px] uppercase tracking-wide block mb-0.5">
          Realtime Transcript:
        </span>
        <p className="italic text-zinc-800 dark:text-zinc-200">{transcript}</p>
      </div>
    </div>
  );
};
