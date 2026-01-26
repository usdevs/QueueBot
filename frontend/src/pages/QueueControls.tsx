import { Pause, Play, Trash2 } from 'lucide-react';

interface QueueControlsProps {
  isPaused: boolean;
  onTogglePause: () => void;
  onClearQueue: () => void;
}

export function QueueControls({ isPaused, onTogglePause, onClearQueue }: QueueControlsProps) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg md:rounded-xl p-4 md:p-6 mb-4 md:mb-6 border border-slate-700">
      <h2 className="text-lg md:text-xl mb-3 md:mb-4">Queue Controls</h2>
      <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
        <button
          onClick={onTogglePause}
          className={`flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-lg text-sm md:text-base transition-all ${
            isPaused
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-orange-600 hover:bg-orange-700 text-white'
          }`}
        >
          {isPaused ? (
            <>
              <Play className="w-4 h-4 md:w-5 md:h-5" />
              Resume Queue
            </>
          ) : (
            <>
              <Pause className="w-4 h-4 md:w-5 md:h-5" />
              Pause Queue
            </>
          )}
        </button>

        <button
          onClick={onClearQueue}
          className="flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm md:text-base transition-all border border-red-600/50"
        >
          <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
          Clear Queue
        </button>
      </div>
    </div>
  );
}