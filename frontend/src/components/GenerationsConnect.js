import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000/generations-connect');

function GenerationsConnect() {
  const [ageGroup, setAgeGroup] = useState('');
  const [connected, setConnected] = useState(false);
  const [partner, setPartner] = useState(null);
  const [story, setStory] = useState('');
  const [receivedStories, setReceivedStories] = useState([]);

  useEffect(() => {
    socket.on('matched', (data) => {
      setPartner(data);
      setConnected(true);
    });

    socket.on('partner-left', () => {
      alert('Your partner has left the session.');
      setPartner(null);
      setConnected(false);
      setReceivedStories([]);
    });

    socket.on('story', (data) => {
      setReceivedStories((prev) => [...prev, data.message]);
    });

    return () => {
      socket.off('matched');
      socket.off('partner-left');
      socket.off('story');
    };
  }, []);

  const joinSession = () => {
    if (ageGroup) {
      socket.emit('join', { id: Date.now().toString(), ageGroup });
    }
  };

  const leaveSession = () => {
    socket.emit('leave');
    setPartner(null);
    setConnected(false);
    setReceivedStories([]);
  };

  const sendStory = () => {
    if (story.trim()) {
      socket.emit('story', { message: story });
      setReceivedStories((prev) => [...prev, `You: ${story}`]);
      setStory('');
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Generations Connect</h2>
      {!connected ? (
        <div>
          <label className="block mb-2">Select your age group:</label>
          <select
            value={ageGroup}
            onChange={(e) => setAgeGroup(e.target.value)}
            className="border p-2 rounded w-full mb-4"
          >
            <option value="">-- Select --</option>
            <option value="young">Young</option>
            <option value="senior">Senior</option>
          </select>
          <button
            onClick={joinSession}
            disabled={!ageGroup}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Join Session
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            Matched with a {partner.partnerAgeGroup} user (ID: {partner.partnerId})
          </div>
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Share your story..."
            className="w-full border p-2 rounded mb-2"
            rows={4}
          />
          <button
            onClick={sendStory}
            className="px-4 py-2 bg-green-600 text-white rounded mb-4"
          >
            Send Story
          </button>
          <button
            onClick={leaveSession}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Leave Session
          </button>
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Stories Received:</h3>
            <div className="border p-2 rounded h-40 overflow-y-auto bg-white">
              {receivedStories.map((msg, idx) => (
                <div key={idx} className="mb-1">
                  {msg}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GenerationsConnect;
