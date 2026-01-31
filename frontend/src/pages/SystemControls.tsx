// import { useState } from "react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/card";
// import { Button } from "../components/button";
// import { Badge } from "../components/badge";
// import { Switch } from "../components/switch";
// import { Label } from "../components/label";
// import { Input } from "../components/input";
// import {
//   Play,
//   Pause,
//   StopCircle,
//   RefreshCw,
//   Settings,
//   Bell,
//   BellOff
// } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogFooter,
// } from "../components/dialog";
//
// interface SystemControlsProps {
//   isActive: boolean;
//   isPaused: boolean;
//   onStart: () => void;
//   onPause: () => void;
//   onStop: () => void;
//   onReset: () => void;
//   settings: {
//     maxCapacity: number;
//     sessionDuration: number;
//     autoNotifications: boolean;
//   };
//   onUpdateSettings: (settings: SystemControlsProps['settings']) => void;
// }
//
// export function SystemControls({
//   isActive,
//   isPaused,
//   onStart,
//   onPause,
//   onStop,
//   onReset,
//   settings,
//   onUpdateSettings
// }: SystemControlsProps) {
//   const [localSettings, setLocalSettings] = useState(settings);
//   const [isSettingsOpen, setIsSettingsOpen] = useState(false);
//
//   const handleSaveSettings = () => {
//     onUpdateSettings(localSettings);
//     setIsSettingsOpen(false);
//   };
//
//   const getSystemStatus = () => {
//     if (!isActive) return { label: "Offline", variant: "secondary" as const };
//     if (isPaused) return { label: "Paused", variant: "outline" as const };
//     return { label: "Active", variant: "default" as const, className: "bg-green-600" };
//   };
//
//   const status = getSystemStatus();
//
//   return (
//     <Card>
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <div>
//             <CardTitle>System Controls</CardTitle>
//             <CardDescription>Manage photobooth queue system</CardDescription>
//           </div>
//           <Badge variant={status.variant} className={status.className}>
//             {status.label}
//           </Badge>
//         </div>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <div className="flex flex-wrap gap-2">
//           {!isActive ? (
//             <Button onClick={onStart} className="gap-2 bg-green-600 hover:bg-green-700">
//               <Play className="size-4" />
//               Start Queue
//             </Button>
//           ) : (
//             <>
//               {!isPaused ? (
//                 <Button onClick={onPause} variant="outline" className="gap-2">
//                   <Pause className="size-4" />
//                   Pause Queue
//                 </Button>
//               ) : (
//                 <Button onClick={onStart} className="gap-2 bg-green-600 hover:bg-green-700">
//                   <Play className="size-4" />
//                   Resume Queue
//                 </Button>
//               )}
//               <Button onClick={onStop} variant="destructive" className="gap-2">
//                 <StopCircle className="size-4" />
//                 Stop Queue
//               </Button>
//             </>
//           )}
//
//           <Button onClick={onReset} variant="outline" className="gap-2">
//             <RefreshCw className="size-4" />
//             Reset Queue
//           </Button>
//
//           <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
//             <DialogTrigger asChild>
//               <Button variant="outline" className="gap-2 ml-auto">
//                 <Settings className="size-4" />
//                 Settings
//               </Button>
//             </DialogTrigger>
//             <DialogContent>
//               <DialogHeader>
//                 <DialogTitle>Queue Settings</DialogTitle>
//                 <DialogDescription>
//                   Configure queue system parameters
//                 </DialogDescription>
//               </DialogHeader>
//               <div className="space-y-6 py-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="maxCapacity">Maximum Queue Capacity</Label>
//                   <Input
//                     id="maxCapacity"
//                     type="number"
//                     value={localSettings.maxCapacity}
//                     onChange={(e) => setLocalSettings({
//                       ...localSettings,
//                       maxCapacity: parseInt(e.target.value) || 0
//                     })}
//                     min={1}
//                     max={100}
//                   />
//                   <p className="text-xs text-muted-foreground">
//                     Maximum number of users allowed in queue
//                   </p>
//                 </div>
//
//                 <div className="space-y-2">
//                   <Label htmlFor="sessionDuration">Session Duration (minutes)</Label>
//                   <Input
//                     id="sessionDuration"
//                     type="number"
//                     value={localSettings.sessionDuration}
//                     onChange={(e) => setLocalSettings({
//                       ...localSettings,
//                       sessionDuration: parseInt(e.target.value) || 0
//                     })}
//                     min={1}
//                     max={60}
//                   />
//                   <p className="text-xs text-muted-foreground">
//                     Default duration for each photobooth session
//                   </p>
//                 </div>
//
//                 <div className="flex items-center justify-between">
//                   <div className="space-y-0.5">
//                     <Label htmlFor="autoNotifications">Auto Notifications</Label>
//                     <p className="text-xs text-muted-foreground">
//                       Send notifications when user's turn is approaching
//                     </p>
//                   </div>
//                   <Switch
//                     id="autoNotifications"
//                     checked={localSettings.autoNotifications}
//                     onCheckedChange={(checked: any) => setLocalSettings({
//                       ...localSettings,
//                       autoNotifications: checked
//                     })}
//                   />
//                 </div>
//               </div>
//               <DialogFooter>
//                 <Button variant="outline" onClick={() => {
//                   setLocalSettings(settings);
//                   setIsSettingsOpen(false);
//                 }}>
//                   Cancel
//                 </Button>
//                 <Button onClick={handleSaveSettings}>
//                   Save Changes
//                 </Button>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>
//         </div>
//
//         <div className="pt-4 border-t space-y-2">
//           <div className="flex items-center justify-between text-sm">
//             <span className="text-muted-foreground">Queue Capacity</span>
//             <span>{settings.maxCapacity} users</span>
//           </div>
//           <div className="flex items-center justify-between text-sm">
//             <span className="text-muted-foreground">Session Duration</span>
//             <span>{settings.sessionDuration} minutes</span>
//           </div>
//           <div className="flex items-center justify-between text-sm">
//             <span className="text-muted-foreground">Notifications</span>
//             <span className="flex items-center gap-1">
//               {settings.autoNotifications ? (
//                 <>
//                   <Bell className="size-3 text-green-600" />
//                   Enabled
//                 </>
//               ) : (
//                 <>
//                   <BellOff className="size-3 text-muted-foreground" />
//                   Disabled
//                 </>
//               )}
//             </span>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
