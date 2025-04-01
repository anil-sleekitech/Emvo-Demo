import React from 'react';
import Image from 'next/image';
import upcallGif from '../assets/upcall.gif';
import { UltravoxSessionStatus } from 'ultravox-client';

interface CallInterfaceProps {
  agentName: string;
  onEndCall: () => void;
  suggestions: string[];
  sessionStatus: UltravoxSessionStatus;
  isLoading?: boolean;
}

const CallInterface: React.FC<CallInterfaceProps> = ({ agentName, onEndCall, suggestions, sessionStatus }) => {
  let statusLabel = "Idle";
  let statusColor = "#9ca3af"; // gray-400
  
  if (sessionStatus === UltravoxSessionStatus.SPEAKING) {
    statusLabel = "Speaking";
    statusColor = "#EE7794"; // spiral-pink
  } else if (sessionStatus === UltravoxSessionStatus.LISTENING) {
    statusLabel = "Listening";
    statusColor = "#9351E2"; // spiral-purple
  } else if (sessionStatus === UltravoxSessionStatus.IDLE) {
    statusLabel = "Idle";
    statusColor = "#9ca3af"; // gray-400
  }

  return (
    <div className="space-y-6 p-6 bg-[#150C29] rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <button className="text-purple-400">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-xl text-white">Call in progress, you have a minute🚀</h2>
        </div>
        <button
          onClick={onEndCall}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full text-white"
        >
          End the call
        </button>
      </div>

      <p className="text-gray-300">
        Talk to {agentName} in English, Hindi & 18+ launguages. Do share your name!
      </p>

      <div className="flex gap-3">
        {/* Main Content */}
        <div className="flex-1 bg-black rounded-xl p-4">
          {/* Animation */}
          <div className="relative w-full h-[250px] bg-[#010003] rounded-xl overflow-hidden mb-6">
            <div className="absolute inset-0 flex items-center justify-start pl-8">
              <div className="relative w-48 h-48">
                <Image
                  src={upcallGif}
                  alt="Voice animation"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div className="absolute bottom-0 inset-x-0 bg-black/50 p-4 backdrop-blur-sm">
              <p className="text-white text-left pl-8">
                {agentName} is {statusLabel.toLowerCase()} 💬
              </p>
            </div>
          </div>

          {/* Suggestions */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold">Need something specific?</h3>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full text-left p-4 bg-[#1C0F36] rounded-lg text-white hover:bg-purple-700 transition flex items-center space-x-3"
                >
                  <span className="text-purple-400">+</span>
                  <span>{suggestion}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Transcription */}
        <div className="w-80 bg-[#0A021D] rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Live Transcription</h3>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="text-red-500 text-sm">Live</span>
            </div>
          </div>
          
          <div className="h-[calc(100vh-300px)] overflow-y-auto space-y-4 custom-scrollbar">
            <div className="text-center text-gray-400 py-8">
              No live transcription available yet
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallInterface; 