export function QueuePreview({ queue, currentUser, onLeave }) {
  return (
    <div className="p-6">
      {/* Header */}
      <h3 className="text-white text-xl font-bold mb-2">Current Queue</h3>
      <p className="text-gray-400 mb-4">
        {queue.length} {queue.length === 1 ? 'person' : 'people'} waiting
      </p>

      {/* Queue List */}
      {queue.length === 0 ? (
        <div className="bg-[#1e2936] rounded-lg p-8 text-center">
          <p className="text-gray-400">Queue is empty</p>
          <p className="text-gray-500 text-sm mt-2">Be the first to join!</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {queue.slice(0, 5).map((person, index) => (
              <div 
                key={person.id} 
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  currentUser?.id === person.id 
                    ? 'bg-blue-600/20 border-2 border-blue-500' 
                    : 'bg-[#1e2936] hover:bg-[#2a3644]'
                }`}
              >
                {/* Position Number */}
                <div className={`flex items-center justify-center font-bold ${
                  currentUser?.id === person.id
                    ? 'bg-blue-600 text-white'
                    : 'text-white'
                }`}>
                  {index + 1}. {person.name}
                </div>
                
                
                {/* YOU Badge */}
                {currentUser?.id === person.id && (
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                    YOU
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Show more indicator */}
          {queue.length > 5 && (
            <p className="text-gray-400 text-center text-sm mt-3">
              and {queue.length - 5} more in queue...
            </p>
          )}
        </>
      )}

      {/* Leave Button - Only when logged in */}
      {currentUser && (
        <button 
          onClick={onLeave}
          className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white 
                     p-4 rounded-lg font-semibold text-lg transition-colors
                     shadow-lg hover:shadow-xl"
        >
          Leave Queue
        </button>
      )}
    </div>
  );
}
