import { Users, CheckCircle, PauseCircle } from 'lucide-react';

interface QueueStatsProps {
  totalWaiting: number;
  totalCompleted: number;
  isPaused: boolean;
}

export function QueueStats({ totalWaiting, totalCompleted, isPaused }: QueueStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-5 border border-slate-700">
        <div className="flex flex-col md:flex-row items-start justify-between gap-2">
          <div className="flex-1">
            <p className="text-slate-400 text-xs md:text-sm mb-1">People Waiting</p>
            <p className="text-2xl md:text-3xl">{totalWaiting}</p>
          </div>
          <div className="bg-blue-600/20 p-2 md:p-3 rounded-lg self-end md:self-start">
            <Users className="w-4 h-4 md:w-6 md:h-6 text-blue-500" />
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-5 border border-slate-700">
        <div className="flex flex-col md:flex-row items-start justify-between gap-2">
          <div className="flex-1">
            <p className="text-slate-400 text-xs md:text-sm mb-1">Completed Today</p>
            <p className="text-2xl md:text-3xl">{totalCompleted}</p>
          </div>
          <div className="bg-green-600/20 p-2 md:p-3 rounded-lg self-end md:self-start">
            <CheckCircle className="w-4 h-4 md:w-6 md:h-6 text-green-500" />
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-5 border border-slate-700">
        <div className="flex flex-col md:flex-row items-start justify-between gap-2">
          <div className="flex-1">
            <p className="text-slate-400 text-xs md:text-sm mb-1">Queue Status</p>
            <p className="text-2xl md:text-3xl">{isPaused ? 'Paused' : 'Active'}</p>
          </div>
          <div className={`${isPaused ? 'bg-red-600/20' : 'bg-green-600/20'} p-2 md:p-3 rounded-lg self-end md:self-start`}>
            {isPaused ? (
              <PauseCircle className="w-4 h-4 md:w-6 md:h-6 text-red-500" />
            ) : (
              <CheckCircle className="w-4 h-4 md:w-6 md:h-6 text-green-500" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}