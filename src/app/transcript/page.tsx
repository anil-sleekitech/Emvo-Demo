// src/pages/transcript.tsx
"use client";

import { useState } from "react";

export default function TranscriptPage() {
  const [transcript, setTranscript] = useState<string | null>(null);

  const handleGetTranscript = async () => {
    // Simulate fetching the transcript
    const fetchedTranscript = "This is a simulated transcript of the call.";
    setTranscript(fetchedTranscript);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Call Transcript
        </h1>
        {/* Get Transcript Button */}
        <button
          onClick={handleGetTranscript}
          className="bg-gradient-to-r from-custom-pink to-custom-purple text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
        >
          Get Transcript
        </button >
        {/* Display Transcript */}
        {transcript && (
          <div className="bg-gray-100 p-4 rounded-lg text-left">
            <p className="text-gray-800">{transcript}</p>
          </div>
        )}
      </div>
    </div>
  );
}
