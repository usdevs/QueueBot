import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { 
  UserPlus, 
  UserMinus, 
  Camera, 
  CheckCircle, 
  Play, 
  Pause,
  StopCircle,
  Settings 
} from "lucide-react";

export interface ActivityLogEntry {
  id: string;
  type: "user_joined" | "user_left" | "session_started" | "session_completed" | 
        "queue_started" | "queue_paused" | "queue_stopped" | "settings_changed";
  message: string;
  timestamp: Date;
  userId?: string;
  userName?: string;
}

interface ActivityLogProps {
  entries: ActivityLogEntry[];
}

export function ActivityLog({ entries }: ActivityLogProps) {
  const getActivityIcon = (type: ActivityLogEntry["type"]) => {
    switch (type) {
      case "user_joined":
        return <UserPlus className="size-4 text-blue-600" />;
      case "user_left":
        return <UserMinus className="size-4 text-red-600" />;
      case "session_started":
        return <Camera className="size-4 text-green-600" />;
      case "session_completed":
        return <CheckCircle className="size-4 text-purple-600" />;
      case "queue_started":
        return <Play className="size-4 text-green-600" />;
      case "queue_paused":
        return <Pause className="size-4 text-orange-600" />;
      case "queue_stopped":
        return <StopCircle className="size-4 text-red-600" />;
      case "settings_changed":
        return <Settings className="size-4 text-gray-600" />;
    }
  };

  const getActivityBadge = (type: ActivityLogEntry["type"]) => {
    switch (type) {
      case "user_joined":
        return <Badge variant="secondary" className="text-xs">Join</Badge>;
      case "user_left":
        return <Badge variant="destructive" className="text-xs">Left</Badge>;
      case "session_started":
        return <Badge variant="default" className="text-xs bg-green-600">Started</Badge>;
      case "session_completed":
        return <Badge variant="outline" className="text-xs">Completed</Badge>;
      case "queue_started":
        return <Badge variant="default" className="text-xs bg-green-600">System</Badge>;
      case "queue_paused":
        return <Badge variant="outline" className="text-xs">System</Badge>;
      case "queue_stopped":
        return <Badge variant="destructive" className="text-xs">System</Badge>;
      case "settings_changed":
        return <Badge variant="secondary" className="text-xs">Settings</Badge>;
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {entries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No activity yet
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="mt-0.5">
                    {getActivityIcon(entry.type)}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      {getActivityBadge(entry.type)}
                      <span className="text-xs text-muted-foreground">
                        {formatTime(entry.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm">{entry.message}</p>
                    {entry.userName && (
                      <p className="text-xs text-muted-foreground">
                        User: {entry.userName}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
