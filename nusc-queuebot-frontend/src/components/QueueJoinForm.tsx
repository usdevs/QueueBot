// src/components/QueueJoinForm.jsx

import { useState } from 'react';

export function QueueJoinForm({ onJoin }) {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (name.trim()) {
      onJoin(name.trim());
      setName('');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-white text-2xl font-bold mb-4">Join the Queue</h2>
      
      <input 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        className="w-full bg-[#1e2936] text-white p-4 rounded-lg mb-4 
                   border border-gray-700 focus:border-blue-500 focus:outline-none"
      />
      
      <button 
        onClick={handleSubmit}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white 
                   p-4 rounded-lg font-semibold transition"
      >
        Join Queue
      </button>
    </div>
  );
}
