import {useEffect, useState} from 'react';
import {QueueStats} from './QueueStats';
import {QueueControls} from './QueueControls';
import {QueueList} from './QueueList';
import {createPath} from "@/components/utils.ts";


export interface QueueEntry {
    id: string;
    name: string;
    joinedAt: Date;
    status: 'waiting' | 'in-progress' | 'completed';
}

export function AdminDashboard() {
    const [isPaused, setIsPaused] = useState(false);

    const [queue, setQueue] = useState<QueueEntry[]>([
        {id: '1', name: 'Alice', joinedAt: new Date(Date.now() - 15 * 60000), status: 'waiting'},
        {id: '2', name: 'Bob', joinedAt: new Date(Date.now() - 12 * 60000), status: 'waiting'},
        {id: '3', name: 'Charlie', joinedAt: new Date(Date.now() - 10 * 60000), status: 'waiting'},
        {id: '4', name: 'Dave', joinedAt: new Date(Date.now() - 8 * 60000), status: 'waiting'},
        {id: '5', name: 'Ellie', joinedAt: new Date(Date.now() - 6 * 60000), status: 'waiting'},
        {id: '6', name: 'Frank', joinedAt: new Date(Date.now() - 4 * 60000), status: 'waiting'},
        {id: '7', name: 'Grace', joinedAt: new Date(Date.now() - 3 * 60000), status: 'waiting'},
        {id: '8', name: 'Henry', joinedAt: new Date(Date.now() - 1 * 60000), status: 'waiting'},
    ]);

    const [totalCompleted] = useState(3);

    const handleRemove = (id: string) => {
        setQueue(queue.filter(entry => entry.id !== id));
    };

    const handleComplete = (id: string) => {
        setQueue(queue.filter(e => e.id !== id));
    };

    const handleClearQueue = () => {
        if (window.confirm('Are you sure you want to clear the entire queue?')) {
            setQueue([]);
        }
    };

    const handleTogglePause = () => {
        setIsPaused(!isPaused);
    };

    if (sessionStorage.getItem("jwt") == null) {
        return (<div>Error</div>);
    }

    useEffect(() => {

        const fetchData = async () => {
            fetch(createPath("queue/status"),
                {method: "GET", headers: { Authorization: sessionStorage.getItem("jwt")!,}})
                .then(async (res) => {
                    setIsPaused((await res.json())['status']);
                });
        }
        fetchData();

    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-white p-3 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div
                    className="bg-slate-900/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 mb-4 md:mb-6 border border-slate-800">
                    <h1 className="text-2xl md:text-3xl mb-1 md:mb-2">NUSC Queuebot</h1>
                    <p className="text-sm md:text-base text-slate-400">Admin Dashboard</p>
                </div>

                {/* Statistics */}
                <QueueStats
                    totalWaiting={queue.length}
                    totalCompleted={totalCompleted}
                    isPaused={isPaused}
                />

                {/* Controls */}
                <QueueControls
                    isPaused={isPaused}
                    onTogglePause={handleTogglePause}
                    onClearQueue={handleClearQueue}
                />

                {/* Content */}
                <QueueList
                    queue={queue}
                    onRemove={handleRemove}
                    onComplete={handleComplete}
                    isPaused={isPaused}
                />
            </div>
        </div>
    );
}