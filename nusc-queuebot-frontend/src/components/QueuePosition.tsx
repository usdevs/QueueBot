// src/components/QueuePosition.jsx

export function QueuePosition({ currentUser, position, peopleAhead, onLeave }) {
  return (
    <div className="p-6 space-y-4">
      {/* Position Card */}
      <div className="bg-blue-600 rounded-lg p-8 text-center text-white">
        <h2 className="text-xl font-semibold mb-4">Your Position</h2>
        <div className="text-6xl font-bold mb-4">#{position}</div>
        <p className="text-xl">
          {peopleAhead === 0 
            ? "You're next!" 
            : `${peopleAhead} ${peopleAhead === 1 ? 'person' : 'people'} ahead of you`
          }
        </p>
      </div>

      {/* User Info */}
      <div className="bg-[#1e2936] rounded-lg p-6">
        <p className="text-gray-400 text-sm">Checked in as</p>
        <p className="text-white text-2xl font-semibold">{currentUser.name}</p>
        
      </div>

      
    </div>
  );
}
