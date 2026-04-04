import {useEffect, useState} from 'react';
import {QueueStats} from './QueueStats';
import {QueueControls} from './QueueControls';
import {QueueList} from './QueueList';
import {createPath} from "@/components/utils.ts";
import {Page} from "@/components/Page.tsx";
import {HamburgerMenu} from '@/components/HamburgerMenu';
import {SettingsAccordion} from '@/components/SettingsAccordion';

interface Settings {
  eventName: string;
  venue: string;
  notifyBefore: number;
}

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
    const [settings, setSettings] = useState<Settings>({
        eventName: 'NUSC Queue',
        venue: 'Main Hall',
        notifyBefore: 5,
    });
    const [showSettings, setShowSettings] = useState(false);

    // ✅ FIRST useEffect - Setup fake data
    useEffect(() => {
        if (!sessionStorage.getItem("jwt")) {
            sessionStorage.setItem("jwt", "fake-jwt-token-dev");
            sessionStorage.setItem("user-type", "admin");
        }
        
        setQueue([
            { id: "1", name: "John", joinedAt: new Date() },
            { id: "2", name: "Jane", joinedAt: new Date() },
            { id: "3", name: "Bob", joinedAt: new Date() },
        ]);
    }, []);

    // ✅ SECOND useEffect - Fetch data (commented out for now)
    useEffect(() => {
        // Skip backend calls for development
        // const fetchData = async () => { ... }
        // fetchData();
    }, []);

    // ✅ NOW define userType (after all hooks)
    if (sessionStorage.getItem("jwt") == null) {
        return (<div>Error</div>);
    }

    const userType = sessionStorage.getItem("user-type") as ("admin" | "user");

    // Handler functions
    const handleRemove = async (id: string) => {
        await fetch(createPath(`queue/entries/${id}`),
            {method: "DELETE", headers: {Authorization: sessionStorage.getItem("jwt")!,}})
            .then(async (res) => {
                if (res.status == 200) {
                    reloadQueue((await res.json())['entries']);
                }
            });
    };

    const handleLeaveQueue = async () => {
        await fetch(createPath(`queue/entries/me`),
            {method: "DELETE", headers: {Authorization: sessionStorage.getItem("jwt")!,}})
            .then(async (res) => {
                if (res.status == 200) {
                    setInQueue(false);
                    handleRefresh();
                }
            });
    };

    const reloadQueue = (entries: any[]) => {
        setQueue(entries.map((entry) => {
            return {
                name: entry['name'],
                joinedAt: new Date(entry['timeCreated']),
                id: entry['telegram_id']
            };
        }));
    }

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
        await Promise.all([
            fetch(createPath("queue/status"),
                {method: "GET", headers: {Authorization: sessionStorage.getItem("jwt")!,}})
                .then(async (res) => {
                    if (res.status == 200) {
                        setIsPaused(!(await res.json())['status']);
                    }
                }),
            fetch(createPath("queue/entries/me"),
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
                })
        ]);
    }

    // ✅ RETURN JSX
    return (
        <Page>
            <HamburgerMenu onSettingsClick={() => setShowSettings(!showSettings)} />
            
            <div className="min-h-screen bg-slate-950 text-white p-3 md:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 mb-4 md:mb-6 border border-slate-800">
                        <h1 className="text-2xl md:text-3xl mb-1 md:mb-2">{settings.eventName}</h1>
                        <p className="text-sm text-slate-400">{settings.venue}</p>
                        {userType === "admin" && (
                            <p className="text-sm md:text-base text-slate-400">Admin Dashboard</p>
                        )}
                    </div>

                    {/* Settings Accordion - Only for Admin */}
                    {userType === 'admin' && showSettings && (
                        <SettingsAccordion 
                            settings={settings}
                            onSettingsChange={setSettings}
                            userType={userType}
                        />
                    )}

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
                    {userType === "admin" ? (
                        <QueueList
                            queue={queue}
                            onRemove={handleRemove}
                            isPaused={isPaused}
                        />
                    ) : inQueue ? (
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
                            <p className="text-3xl text-white text-center m-4">{`You are ${username}!`}</p>
                            <p className="text-center text-slate-300 pb-4">Event: {settings.eventName}</p>
                            <p className="text-center text-slate-300 pb-4">Venue: {settings.venue}</p>
                        </div>
                    ) : null}
                </div>
            </div>
        </Page>
    );
}
