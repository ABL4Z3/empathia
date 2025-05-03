import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000/gratitude-chain');

function GratitudeChain() {
  const [message, setMessage] = useState('');
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    socket.emit('get-notes');

    socket.on('all-notes', (allNotes) => {
      setNotes(allNotes);
    });

    socket.on('new-note', (note) => {
      setNotes((prev) => [...prev, note]);
    });

    return () => {
      socket.off('all-notes');
      socket.off('new-note');
    };
  }, []);

  const sendNote = () => {
    if (message.trim()) {
      const note = {
        id: Date.now().toString(),
        userId: 'anonymous',
        message,
        timestamp: new Date().toISOString(),
        // location can be added later
      };
      socket.emit('new-note', note);
      setMessage('');
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Global Gratitude Chain</h2>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your gratitude note..."
        className="w-full border p-2 rounded mb-2"
        rows={3}
      />
      <button
        onClick={sendNote}
        className="px-4 py-2 bg-green-600 text-white rounded mb-4"
      >
        Send Gratitude
      </button>
      <div>
        <h3 className="font-semibold mb-2">Gratitude Notes:</h3>
        <div className="border p-2 rounded h-48 overflow-y-auto bg-white">
          {notes.map((note) => (
            <div key={note.id} className="mb-1">
              <div className="text-sm text-gray-700">{note.message}</div>
              <div className="text-xs text-gray-400">
                {new Date(note.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GratitudeChain;
