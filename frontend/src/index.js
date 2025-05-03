import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import VentingLounge from './components/VentingLounge';
import GenerationsConnect from './components/GenerationsConnect';
import GratitudeChain from './components/GratitudeChain';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 space-y-8">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">Welcome to Empathia</h1>
      <VentingLounge />
      <GenerationsConnect />
      <GratitudeChain />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
