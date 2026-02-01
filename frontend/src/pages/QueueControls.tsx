import {ArrowBigRight, DoorOpen, Pause, Play, SquarePlus} from 'lucide-react';
import LoadingButton from "@/components/LoadingButton.tsx";

interface QueueControlsProps {
    userType: "admin" | "user";
    isPaused: boolean;
    isInQueue: boolean;
    onTogglePause: () => Promise<void>;
    onAdvanceQueue: () => Promise<void>;
    onJoinQueue: () => Promise<void>;
    onLeaveQueue: () => Promise<void>;
}

export function QueueControls({userType, isInQueue, isPaused, onTogglePause, onLeaveQueue, onAdvanceQueue, onJoinQueue}: QueueControlsProps) {
    return (
        <div
            className="bg-slate-800/50 backdrop-blur-sm rounded-lg md:rounded-xl p-4 md:p-6 mb-4 md:mb-6 border border-slate-700">
            <h2 className="text-lg md:text-xl mb-3 md:mb-4">Queue Controls</h2>
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                {userType == "user" ? <> <LoadingButton
                    disabled={isPaused || isInQueue}
                    onClick={onJoinQueue}
                    className={`flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 rounded-lg text-sm md:text-base transition-all border border-yellow-600/50 ${isPaused || isInQueue ? 'opacity-50' : 'opacity-100'}`}
                >
                    <SquarePlus className="w-4 h-4 md:w-5 md:h-5"/>
                    Join Queue
                </LoadingButton>
                    <LoadingButton
                        disabled={!isInQueue}
                      onClick={onLeaveQueue}
                      className={`flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm md:text-base transition-all border border-red-600/50 ${!isInQueue ? 'opacity-50' : 'opacity-100'}`}
                    >
                      <DoorOpen className="w-4 h-4 md:w-5 md:h-5" />
                      Leave Queue
                    </LoadingButton>
                </>: null}
                {userType == "admin" ?
                    (<>
                        <LoadingButton
                            onClick={onTogglePause}
                            className={`flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-lg text-sm md:text-base transition-all ${
                                isPaused
                                    ? 'bg-green-600 hover:bg-green-700 text-white'
                                    : 'bg-orange-600 hover:bg-orange-700 text-white'
                            }`}
                        >
                            {isPaused ? (
                                <>
                                    <Play className="w-4 h-4 md:w-5 md:h-5"/>
                                    Resume Queue
                                </>
                            ) : (
                                <>
                                    <Pause className="w-4 h-4 md:w-5 md:h-5"/>
                                    Pause Queue
                                </>
                            )}
                        </LoadingButton>
                        {/*Clear Queue unimplemented in the backend*/}
                        {/*<button*/}
                        {/*  onClick={onClearQueue}*/}
                        {/*  className="flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm md:text-base transition-all border border-red-600/50"*/}
                        {/*>*/}
                        {/*  <Trash2 className="w-4 h-4 md:w-5 md:h-5" />*/}
                        {/*  Clear Queue*/}
                        {/*</button>*/}
                        <LoadingButton
                            onClick={onAdvanceQueue}
                            className="flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 rounded-lg text-sm md:text-base transition-all border border-yellow-600/50"
                        >
                            <ArrowBigRight className="w-4 h-4 md:w-5 md:h-5"/>
                            Advance Queue
                        </LoadingButton>
                    </>) : null
                }
            </div>
        </div>
    );
}