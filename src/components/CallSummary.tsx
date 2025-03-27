import React, { useState } from 'react';
import { Transcript } from '../types';

interface CallSummaryProps {
  agentName: string;
  audioUrl: string;
  transcripts: Transcript[];
  onStartNewCall: () => void;
}

const CallSummary: React.FC<CallSummaryProps> = ({
  agentName,
  audioUrl,
  transcripts,
  onStartNewCall,
}) => {
  const [activeTab, setActiveTab] = useState<'audio' | 'text'>('audio');

  return (
    <div className="space-y-6 p-6 bg-[#150C29] rounded-xl">
      <div className="flex items-center space-x-2">
        <button className="text-purple-400">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl text-white">Your call with {agentName} has ended</h2>
      </div>

      <p className="text-gray-300">Need more help?, here&apos;s the transcript of your conversation</p>

      <div className="bg-[#1C0F36] rounded-xl overflow-hidden">
        <div className="flex border-b border-gray-700">
          <button
            className={`flex-1 px-4 py-2 ${
              activeTab === 'audio' ? 'bg-purple-600 text-white' : 'text-gray-400'
            }`}
            onClick={() => setActiveTab('audio')}
          >
            Audio transcript
          </button>
          <button
            className={`flex-1 px-4 py-2 ${
              activeTab === 'text' ? 'bg-purple-600 text-white' : 'text-gray-400'
            }`}
            onClick={() => setActiveTab('text')}
          >
            Text transcript
          </button>
        </div>

        <div className="p-4">
          {activeTab === 'audio' ? (
            <div className="space-y-4">
              <audio controls className="w-full" src={audioUrl}>
                Your browser does not support the audio element.
              </audio>
            </div>
          ) : (
            <div className="space-y-4">
              {transcripts.map((transcript, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    transcript.isUser
                      ? 'bg-purple-600 ml-12'
                      : 'bg-gray-700 mr-12'
                  }`}
                >
                  <p className="text-white">{transcript.text}</p>
                  <p className="text-xs text-gray-300 mt-1">{transcript.timestamp}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-700 flex items-center justify-between">
          <button
            onClick={onStartNewCall}
            className="flex items-center space-x-2 text-gray-300 hover:text-white"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>Start another conversation</span>
          </button>
          <button className="text-purple-400">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 5l8 7-8 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallSummary; 