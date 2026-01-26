// src/components/QueueNotification.jsx

export function QueueNotification({ peopleAhead }) {
  return (
    <div className="bg-blue-600 text-white p-4">
      <p className="text-center">
        🔔 You're almost up! Only {peopleAhead} {peopleAhead === 1 ? 'person' : 'people'} ahead of you.
      </p>
    </div>
  );
}
