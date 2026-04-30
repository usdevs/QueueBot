import {useState, useEffect} from 'react';
import {ChevronDown, Check} from 'lucide-react';
import {Settings} from "@/pages/AdminDashboard.tsx";

interface SettingsAccordionProps {
    settings: Settings;
    onSettingsChange: (settings: Settings) => void;
    onSaveSettings: (settings: Settings) => Promise<Response>;
    userType: 'admin' | 'user';
}

export function SettingsAccordion({settings, onSettingsChange, onSaveSettings, userType}: SettingsAccordionProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [formData, setFormData] = useState({
        eventName: settings.eventName,
        venue: settings.venue,
        positionBeforePing: settings.positionBeforePing.toString(),
    });

    useEffect(() => {
        setFormData({
            eventName: settings.eventName,
            venue: settings.venue,
            positionBeforePing: settings.positionBeforePing.toString(),
        });
    }, [settings]);

    if (userType !== 'admin') return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const updatedSettings = {
            eventName: formData.eventName,
            venue: formData.venue,
            positionBeforePing: parseInt(formData.positionBeforePing, 10) || 0,
        }

        onSettingsChange(updatedSettings);

        onSaveSettings(updatedSettings).then((res) => {
            if (res.status) {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 2000);
            }
        });
    };

    return (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden mb-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-700/30 transition"
            >
                <h3 className="text-lg font-semibold text-white">Customize Event</h3>
                <ChevronDown
                    size={20}
                    className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <form onSubmit={handleSubmit} className="border-t border-slate-700 p-4 space-y-4 bg-slate-900/30">

                    {/* Event Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Event Name
                        </label>
                        <input
                            type="text"
                            name="eventName"
                            value={formData.eventName}
                            onChange={handleChange}
                            placeholder="e.g., Queue for Registration"
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    {/* Venue */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Venue
                        </label>
                        <input
                            type="text"
                            name="venue"
                            value={formData.venue}
                            onChange={handleChange}
                            placeholder="e.g., Main Hall, Building A"
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    {/* Notify Before */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Notify How Many People Before
                        </label>
                        <input
                            type="number"
                            name="positionBeforePing"
                            value={formData.positionBeforePing}
                            onChange={handleChange}
                            placeholder="e.g., 5"
                            min="0"
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    {/* Save Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
                    >
                        Save Settings
                    </button>
                </form>
            )}

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div
                        className="bg-slate-800 rounded-xl p-8 border border-slate-700 shadow-lg animate-in fade-in zoom-in duration-300">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                                <Check size={32} className="text-green-400"/>
                            </div>

                            <h2 className="text-2xl font-bold text-white">Settings Saved!</h2>
                            <p className="text-slate-300 text-center">
                                Event settings have been updated successfully.
                            </p>

                            <div className="bg-slate-900/50 rounded-lg p-4 w-full mt-2 space-y-2">
                                <p className="text-sm text-slate-400">
                                    <span className="text-slate-300 font-medium">Event:</span> {settings.eventName}
                                </p>
                                <p className="text-sm text-slate-400">
                                    <span className="text-slate-300 font-medium">Venue:</span> {settings.venue}
                                </p>
                                <p className="text-sm text-slate-400">
                                    <span
                                        className="text-slate-300 font-medium">Notify Before:</span> {settings.positionBeforePing} people
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}