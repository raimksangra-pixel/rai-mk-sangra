import React from 'react';
import { ChunkProgress } from '../types';

interface SegmentVisualizerProps {
  threads: ChunkProgress[];
  threadsCount: number;
  totalProgress: number;
  isDownloading: boolean;
}

export const SegmentVisualizer: React.FC<SegmentVisualizerProps> = ({
  threads,
  threadsCount,
  totalProgress,
  isDownloading,
}) => {
  return (
    <div className="w-full bg-slate-900/70 border border-white/5 rounded-lg p-2.5 space-y-2">
      <div className="flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5 font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Parallel Multi-Thread Engine ({threadsCount} Active Connections)
        </span>
        <span className="font-mono text-emerald-400">{Math.round(totalProgress)}% Assembled</span>
      </div>

      {/* Chunky Segmented Visualizer Bar */}
      <div className="grid grid-cols-8 sm:grid-cols-16 gap-1 bg-black/40 p-1.5 rounded border border-white/5">
        {threads.map((thread) => (
          <div
            key={thread.id}
            className="group relative flex flex-col items-center"
            title={`Thread #${thread.id}: ${thread.progress}% (${thread.speed})`}
          >
            <div className="w-full h-4 rounded-sm bg-slate-800 overflow-hidden relative">
              <div
                className={`h-full transition-all duration-300 ${
                  thread.progress >= 100
                    ? 'bg-emerald-500'
                    : isDownloading
                    ? 'bg-gradient-to-t from-indigo-500 to-pink-500 animate-pulse'
                    : 'bg-indigo-600/50'
                }`}
                style={{ width: `${thread.progress}%` }}
              />
            </div>
            <span className="text-[9px] font-mono text-slate-400 mt-0.5 group-hover:text-white transition-colors">
              #{thread.id}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
