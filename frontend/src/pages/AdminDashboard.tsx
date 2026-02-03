import {useEffect, useState} from 'react';
import {QueueStats} from './QueueStats';
import {QueueControls} from './QueueControls';
import {QueueList} from './QueueList';
import {createPath} from "@/components/utils.ts";
import {Page} from "@/components/Page.tsx";

export interface QueueEntry {
    id: string;
    name: string;
    joinedAt: Date;
}

export function AdminDashboard() {
    const [isPaused, setIsPaused] = useState(false);

    const [queue, setQueue] = useState<QueueEntry[]>([]);
    const [inQueue, setInQueue] = useState(false);
    const [username, setUsername] = useState("");

    const [peopleAhead, setPeopleAhead] = useState(null);

    const handleRemove = async (id: string) => {
        await fetch(createPath(`queue/entries/${id}`),
            {method: "DELETE", headers: {Authorization: sessionStorage.getItem("jwt")!,}})
            .then(async (res) => {
                if (res.status == 200) {
                    setQueue((await res.json())['entries']);
                }

            });
    };

    const handleLeaveQueue = async () => {
        await fetch(createPath(`queue/entries/me`),
            {method: "DELETE", headers: {Authorization: sessionStorage.getItem("jwt")!,}})
            .then(async (res) => {
                if (res.status == 200) {
                    setInQueue(false);
                    // fetch queue stats
                    handleRefresh();
                }
            });
    };

    // Unimplemented
    // const handleClearQueue = () => {
    //     if (window.confirm('Are you sure you want to clear the entire queue?')) {
    //         setQueue([]);
    //     }
    // };

    const handleAdvanceQueue = async () => {
        await fetch(createPath("queue/next"),
            {method: "POST", headers: {Authorization: sessionStorage.getItem("jwt")!,}})
            .then(async (res) => {
                if (res.status == 200) {
                    let entries: any[] = (await res.json())['entries'];
                    setQueue(entries.map((entry) => {
                        return {
                            name: entry['name'],
                            joinedAt: new Date(entry['timeCreated']),
                            id: entry['telegram_id']
                        };
                    }));
                }
            });
    };

    const handleJoinQueue = async () => {
        await fetch(createPath(`queue/entries`),
            {method: "POST", headers: {Authorization: sessionStorage.getItem("jwt")!,}})
            .then(async (res) => {
                if (res.status == 201) {
                    const me = (await res.json());
                    setPeopleAhead(me['ahead']);
                    setInQueue(true);
                    setUsername(me["name"]);
                }
            });
    }

    const handleTogglePause = async () => {
        await fetch(createPath(`queue/status?open=${isPaused}`),
            {method: "PATCH", headers: {Authorization: sessionStorage.getItem("jwt")!,}})
            .then(async (res) => {
                if (res.status == 200) {
                    setIsPaused(!(await res.json())['isOpen']);
                }
            });
    };

    const handleRefresh = async () => {
        await fetch(createPath("queue/entries/me"),
            {method: "GET", headers: {Authorization: sessionStorage.getItem("jwt")!,}})
            .then(async (res) => {
                if (res.status == 200) {
                    const me = (await res.json());
                    setPeopleAhead(me["ahead"]);
                    if (me["name"] != undefined) {
                        setInQueue(true);
                        setUsername(me["name"]);
                    }
                }
            });
    }

    if (sessionStorage.getItem("jwt") == null) {
        return (<div>Error</div>);
    }

    const userType = sessionStorage.getItem("user-type") as ("admin" | "user");

    useEffect(() => {

        const fetchData = async () => {
            fetch(createPath("queue/status"),
                {method: "GET", headers: {Authorization: sessionStorage.getItem("jwt")!,}})
                .then(async (res) => {
                    if (res.status == 200) {
                        setIsPaused(!(await res.json())['status']);
                    }
                });

            if (userType == "admin") {
                fetch(createPath("queue/entries"),
                    {method: "GET", headers: {Authorization: sessionStorage.getItem("jwt")!,}})
                    .then(async (res) => {
                        if (res.status == 200) {
                            let entries: any[] = (await res.json())['entries'];
                            setQueue(entries.map((entry) => {
                                return {
                                    name: entry['name'],
                                    joinedAt: new Date(entry['timeCreated']),
                                    id: entry['telegram_id']
                                };
                            }));
                        }

                    });
            } else {
                handleRefresh();
            }

        }

        fetchData();

    }, []);

    return (
        <Page>
        <div className="min-h-screen bg-slate-950 text-white p-3 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div
                    className="bg-slate-900/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 mb-4 md:mb-6 border border-slate-800">
                    <h1 className="text-2xl md:text-3xl mb-1 md:mb-2">NUSC Queuebot</h1>
                    {userType == "user" && inQueue ?
                        <p className="text-2xl text-green-400">You Are Queued Up!</p> : null}
                    {userType == "admin" ?
                        <p className="text-sm md:text-base text-slate-400">Admin Dashboard</p> : null}
                </div>

                {/* Statistics */}
                <QueueStats
                    userType={userType}
                    peopleAhead={peopleAhead}
                    totalWaiting={queue.length}
                    isInQueue={inQueue}
                    isPaused={isPaused}
                    onRefresh={handleRefresh}
                />

                {/* Controls */}
                <QueueControls
                    userType={userType}
                    isPaused={isPaused}
                    isInQueue={inQueue}
                    onTogglePause={handleTogglePause}
                    onJoinQueue={handleJoinQueue}
                    onLeaveQueue={handleLeaveQueue}
                    onAdvanceQueue={handleAdvanceQueue}
                />

                {/* Content */}
                {userType == "admin" ?
                    <QueueList
                        queue={queue}
                        onRemove={handleRemove}
                        isPaused={isPaused}
                    /> : inQueue ? (<div
                        className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
                        <p className="text-3xl text-white text-center m-4">{`You are ${username}!`}</p>
                    </div>) : null}
            </div>
        </div>
        </Page>
    );
}