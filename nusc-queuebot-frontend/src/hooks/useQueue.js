import { useState } from 'react';

export function useQueue() {

    const [queue, setQueue] = useState([
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
    { id: 4, name: "Dave" },
    { id: 5, name: "Ellie" },
    { id: 6, name: "Florence" },
    { id: 7, name: "Gavin" },
    { id: 8, name: "Hendrick" },


  ]);

  const [name, setName] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  const removeFromQueue = (idToRemove) => {
    setQueue(queue.filter(person => person.id !== idToRemove));
    setCurrentUser(null);
  };

  const addToQueue = (nameFromForm) => {
    const newPerson = {
      id: Date.now(),
      name: nameFromForm
    };
    setQueue([...queue, newPerson]);
    setCurrentUser(newPerson);
    setName('');
  };

  const getCurrentPosition = () => {
    if (!currentUser) return 0;
    return queue.findIndex(person => person.id === currentUser.id) + 1;
  };

  const position = getCurrentPosition();
  const peopleAhead = position > 0 ? position - 1 : 0;
  
  return {
    queue,
    currentUser,
    position,
    peopleAhead,
    addToQueue,
    removeFromQueue,

  };

}