// src/App.jsx

import './App.css';
import { useQueue } from './hooks/useQueue';
import { QueueHeader } from './components/QueueHeader';
import { QueueNotification } from './components/QueueNotification';
import { QueueBody } from './components/QueueBody';
import { QueueFooter } from './components/QueueFooter';

export default function App() {
  const {
    queue,
    currentUser,
    position,
    peopleAhead,
    addToQueue,
    removeFromQueue
  } = useQueue();

  return (
    <div className="min-h-screen bg-[#0e1621] flex items-center justify-center p-4">
      <div className="w-full max-w-[375px] h-[812px] bg-[#17212b] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Fixed Header */}
        <QueueHeader />

        {/* Conditional Notification */}
        {currentUser && position > 0 && position <= 3 && (
          <QueueNotification peopleAhead={peopleAhead} />
        )}

        {/* Scrollable Body */}
        <QueueBody 
          currentUser={currentUser}
          position={position}
          peopleAhead={peopleAhead}
          queue={queue}
          onJoin={addToQueue}
          onLeave={() => removeFromQueue(currentUser?.id)}
        />

        {/* Fixed Footer */}
        <QueueFooter />

      </div>
    </div>
  );
}
