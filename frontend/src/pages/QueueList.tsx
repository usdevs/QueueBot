import { X, Clock } from 'lucide-react';
import type { QueueEntry } from './AdminDashboard';

interface QueueListProps {
  queue: QueueEntry[];
  onRemove: (id: string) => void;
  isPaused: boolean;
}

export function QueueList({ queue, onRemove, isPaused }: QueueListProps) {
  // const getWaitTime = (joinedAt: Date) => {
  //   const minutes = Math.floor((Date.now() - joinedAt.getTime()) / 60000);
  //   return minutes;
  // };

  if (queue.length === 0) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg md:rounded-xl p-8 md:p-12 border border-slate-700 text-center">
        <p className="text-slate-400 text-base md:text-lg">No one in queue</p>
      </div>
    );
  }

    return (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
            {/* Header */}
            <div className="p-4 md:p-6 border-b border-slate-700 bg-slate-800/30">
                <div className="flex items-center justify-between mb-1">
                    <h2 className="text-lg font-semibold text-slate-100">Live Queue</h2>
                    <span className="text-xs font-medium bg-blue-600/20 text-blue-400 px-2 py-1 rounded-full border border-blue-600/30">
          {queue.length} Total
        </span>
                </div>

                {isPaused && (
                    <div className="mt-3 flex items-center gap-2 text-orange-400 bg-orange-400/10 border border-orange-400/20 p-2 rounded-lg text-sm">
                        <span className="animate-pulse">●</span>
                        Queue is currently paused
                    </div>
                )}
            </div>

            {/* Queue List */}
            <div className="divide-y divide-slate-700/50">
                {queue.length === 0 ? (
                    <div className="p-10 text-center text-slate-500 text-sm italic">
                        No one is in line yet.
                    </div>
                ) : (
                    queue.map((entry, index) => entry == null ? null : (
                        <div key={entry.id} className="p-4 bg-slate-900/30 flex items-center gap-4">

                            {/* Position */}
                            <div className="flex-shrink-0 w-10 h-10 bg-slate-800 rounded-lg flex flex-col items-center justify-center border border-slate-700">
                                <span className="text-[10px] text-slate-500 uppercase leading-none mb-1">Pos</span>
                                <span className="text-sm font-bold text-blue-400 leading-none">{index + 1}</span>
                            </div>

                            {/* Name & Time */}
                            <div className="flex-1 min-w-0">
                                <p className="text-slate-100 font-medium truncate">{entry.name}</p>
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{entry?.joinedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onRemove(entry.id)}
                                    disabled={isPaused}
                                    className="p-2.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 active:bg-red-500/20 disabled:opacity-30 disabled:grayscale transition-all"
                                    aria-label="Remove entry"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
