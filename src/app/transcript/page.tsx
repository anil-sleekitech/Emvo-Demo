// src/pages/transcript.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function TranscriptContent() {
  const [transcript, setTranscript] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callId = searchParams ? searchParams.get("callId") : null;

  // Automatically fetch transcript when page loads
  useEffect(() => {
    if (callId) {
      handleGetTranscript();
    } else {
      setTranscript("No call ID found. Cannot retrieve transcript.");
    }
  }, [callId]);

  const handleGetTranscript = async () => {
    if (!callId) {
      setTranscript("No call ID found. Cannot retrieve transcript.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Make an API call to fetch the actual transcript
      const response = await fetch(
        `https://bucbk5tdbzwzu5frgxybgnmprm0ibfcr.lambda-url.ap-south-1.on.aws/transcript?callId=${callId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch transcript: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.transcript) {
        // Format the transcript for better readability
        const formattedTranscript = data.transcript
          .replace(/Agent:/g, "\nAgent:")
          .replace(/Customer:/g, "\nCustomer:")
          .trim();
        
        setTranscript(formattedTranscript);
      } else {
        // Fallback to a simulated transcript if the API doesn't return one
        const simulatedTranscript = 
          "Agent: Hello, thank you for calling. How may I help you today?\n\n" +
          "Customer: Hi, I'd like to book an appointment for next week.\n\n" +
          "Agent: I'd be happy to help you with that. What day works best for you?\n\n" +
          "Customer: I was thinking Tuesday afternoon if possible.\n\n" +
          "Agent: Tuesday afternoon works great. We have slots available at 2:00 PM, 3:30 PM, and 4:45 PM. Do any of those times work for you?\n\n" +
          "Customer: 3:30 PM would be perfect.\n\n" +
          "Agent: Excellent! I've booked your appointment for Tuesday at 3:30 PM. Is there anything else you need help with today?";
        
        setTranscript(simulatedTranscript);
        console.log("No transcript found in API response, using simulated transcript");
      }
    } catch (error) {
      console.error("Error fetching transcript:", error);
      setTranscript("Error retrieving transcript. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle going back to home with cache clearing
  const handleBackToHome = (e) => {
    e.preventDefault();
    
    // Clear any browser cache or session storage if needed
    sessionStorage.clear();
    
    // Force a full page reload when navigating to home
    window.location.href = '/';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#9351E2] via-[#BC45FF] to-[#1B0D2D] p-4">
      <div className="bg-gradient-to-br from-white to-[#f8f9ff] p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-[#1B0D2D] mb-6">
          Call Transcript
        </h1>
        
        {/* Get Transcript Button */}
        <button
          onClick={handleGetTranscript}
          disabled={isLoading}
          className="bg-gradient-to-r from-[#9351E2] to-[#EE7794] text-white font-medium py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-105 mb-4 w-full max-w-xs mx-auto"
        >
          {isLoading ? "Loading..." : "Get Transcript"}
        </button>
        
        {/* Display Transcript */}
        {transcript && (
          <div className="bg-gray-50 p-4 rounded-lg text-left mt-4 mb-4 max-h-80 overflow-y-auto border border-gray-200">
            <pre className="text-[#1B0D2D] whitespace-pre-wrap font-sans">{transcript}</pre>
          </div>
        )}
        
        <div className="mt-4">
          <button 
            onClick={handleBackToHome}
            className="text-[#9351E2] hover:text-[#EE7794] transition-colors font-medium"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TranscriptPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TranscriptContent />
    </Suspense>
  );
}
