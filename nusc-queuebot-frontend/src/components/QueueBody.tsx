// src/components/QueueBody.jsx

import { QueueJoinForm } from './QueueJoinForm';
import { QueuePosition } from './QueuePosition';
import { QueuePreview } from './QueuePreview';

export function QueueBody({ 
  currentUser, 
  position, 
  peopleAhead, 
  queue, 
  onJoin, 
  onLeave 
}) {
  return (
    <div className="flex-1 overflow-y-auto bg-[#0e1621]">
      
      {/* Conditional: Join Form OR Position Info */}
      {!currentUser ? (
        <QueueJoinForm onJoin={onJoin} />
      ) : (
        <QueuePosition 
          currentUser={currentUser}
          position={position}
          peopleAhead={peopleAhead}
          onLeave={onLeave}
        />
      )}

      {/* Always Show: Queue Preview */}
      <QueuePreview queue={queue} currentUser={currentUser} onLeave={onLeave} />

    </div>
  );
}
