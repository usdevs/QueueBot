import { CheckCircle, X, Clock } from 'lucide-react';
import type { QueueEntry } from './AdminDashboard';

interface QueueListProps {
  queue: QueueEntry[];
  onRemove: (id: string) => void;
  onComplete: (id: string) => void;
  isPaused: boolean;
}

export function QueueList({ queue, onRemove, onComplete, isPaused }: QueueListProps) {
  const getWaitTime = (joinedAt: Date) => {
    const minutes = Math.floor((Date.now() - joinedAt.getTime()) / 60000);
    return minutes;
  };

  if (queue.length === 0) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg md:rounded-xl p-8 md:p-12 border border-slate-700 text-center">
        <p className="text-slate-400 text-base md:text-lg">No one in queue</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg md:rounded-xl p-4 md:p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h2 className="text-lg md:text-xl">Queue Management</h2>
        <span className="text-sm md:text-base text-slate-400">{queue.length} {queue.length === 1 ? 'person' : 'people'}</span>
      </div>

      {isPaused && (
        <div className="bg-orange-600/20 border border-orange-600/50 rounded-lg p-3 md:p-4 mb-3 md:mb-4">
          <p className="text-orange-300 text-sm md:text-base">⚠️ Queue is currently paused. No new entries will be processed.</p>
        </div>
      )}

      <div className="space-y-2 md:space-y-3">
        {queue.map((entry, index) => (
          <div
            key={entry.id}
            className="bg-slate-900/50 rounded-lg p-3 md:p-4 border border-slate-700 hover:border-slate-600 transition-all"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
              {/* Position */}
              <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-blue-600/20 rounded-lg flex items-center justify-center border border-blue-600/50">
                <span className="text-lg md:text-xl text-blue-400">{index + 1}</span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-base md:text-lg mb-1">{entry.name}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-slate-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 md:w-4 md:h-4" />
                    <span>Waiting {getWaitTime(entry.joinedAt)} min</span>
                  </div>
                  <span className="text-slate-600 hidden sm:inline">•</span>
                  <span className="hidden sm:inline">Joined {entry.joinedAt.toLocaleTimeString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Complete */}
                <button
                  onClick={() => onComplete(entry.id)}
                  className="flex-1 sm:flex-none px-3 md:px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all flex items-center justify-center gap-2 text-sm md:text-base"
                  title="Mark as completed"
                >
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                  <span>Complete</span>
                </button>

                {/* Remove */}
                <button
                  onClick={() => onRemove(entry.id)}
                  className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-all border border-red-600/50"
                  title="Remove from queue"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
