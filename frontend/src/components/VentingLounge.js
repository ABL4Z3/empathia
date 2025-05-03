import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000/venting-lounge');

function VentingLounge() {
  const [vents, setVents] = useState([]);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    socket.on('vent', (ventData) => {
      setVents((prev) => [...prev, ventData]);
    });

    return () => {
      socket.off('vent');
    };
  }, []);

  const startRecording = async () => {
    setRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.start();

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      audioChunksRef.current = [];
      const audioUrl = URL.createObjectURL(audioBlob);
      const ventData = { audioUrl, timestamp: new Date().toISOString() };
      socket.emit('vent', ventData);
      setVents((prev) => [...prev, ventData]);
    };
  };

  const stopRecording = () => {
    setRecording(false);
    mediaRecorderRef.current.stop();
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Venting Lounge</h2>
      <div className="mb-4">
        {!recording ? (
          <button
            onClick={startRecording}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Stop Recording
          </button>
        )}
      </div>
      <div>
        {vents.map((vent, index) => (
          <div key={index} className="mb-2">
            <audio controls src={vent.audioUrl} />
            <div className="text-xs text-gray-500">{new Date(vent.timestamp).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VentingLounge;
