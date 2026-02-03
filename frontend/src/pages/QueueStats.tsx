import {Users, CheckCircle, PauseCircle, RefreshCw} from 'lucide-react';
import LoadingButton from "@/components/LoadingButton.tsx";

interface QueueStatsProps {
  userType: "user" | "admin";
  peopleAhead: number | null;
  totalWaiting: number;
  isPaused: boolean;
  onRefresh: () => void;
}

export function QueueStats({ userType, onRefresh, peopleAhead, totalWaiting, isPaused }: QueueStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 md:gap-4 mb-4 md:mb-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-5 border border-slate-700">
            <div className="flex flex-col md:flex-row items-start justify-between gap-2">
                <div className="flex-1">
                    <div className="flex flex-row">
                        <p className="text-slate-400 text-xs md:text-sm mb-1">{userType == "admin" ? "People Waiting" : "People Ahead"}</p>
                        <LoadingButton className={`w-4 h-4 ml-2 visible`} onClick={onRefresh}>
                            <RefreshCw className="w-4 h-4"/>
                        </LoadingButton>

                    </div>
                    <p className="text-2xl md:text-3xl">{userType == "admin" ? totalWaiting : (peopleAhead ?? "-") == 0 ? "It's Your Turn" : peopleAhead }</p>
                </div>
                <div className="bg-blue-600/20 p-2 md:p-3 rounded-lg self-end md:self-start">
                    <Users className="w-4 h-4 md:w-6 md:h-6 text-blue-500" />
                </div>
            </div>
        </div>

      {/*Disabled because unimplemented*/}
      {/*<div className="bg-slate-800/50 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-5 border border-slate-700">*/}
      {/*  <div className="flex flex-col md:flex-row items-start justify-between gap-2">*/}
      {/*    <div className="flex-1">*/}
      {/*      <p className="text-slate-400 text-xs md:text-sm mb-1">Completed Today</p>*/}
      {/*      <p className="text-2xl md:text-3xl">{totalCompleted}</p>*/}
      {/*    </div>*/}
      {/*    <div className="bg-green-600/20 p-2 md:p-3 rounded-lg self-end md:self-start">*/}
      {/*      <CheckCircle className="w-4 h-4 md:w-6 md:h-6 text-green-500" />*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}

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