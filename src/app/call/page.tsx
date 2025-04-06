"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UltravoxSession, UltravoxSessionStatus } from "ultravox-client";
import Link from "next/link";

function CallContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callId = searchParams ? searchParams.get("callId") : null;
  const [sessionStatus, setSessionStatus] = useState("idle");
  const [audioLevel, setAudioLevel] = useState(0);
  
  // Use refs to avoid unnecessary re-renders and maintain references
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const sessionRef = useRef<UltravoxSession | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timeRef = useRef<number>(0);
  const callEndedRef = useRef<boolean>(false);

  // Function to clean up resources
  const cleanupResources = async () => {
    if (callEndedRef.current) return; // Prevent multiple cleanups
    
    callEndedRef.current = true;
    console.log("Cleaning up call resources");
    
    // Create a promise  that will resolve after a timeout to ensure we don't hang
    const timeoutPromise = new Promise(resolve => {
      setTimeout(() => {
        console.log("Cleanup timed out, forcing cleanup");
        resolve(null);
      }, 3000);
    });
    
    const cleanupPromise = async () => {
      try {
        if (sessionRef.current) {
          await sessionRef.current.leaveCall();
          console.log("Session left");
          sessionRef.current = null;
        }
        
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => {
            track.stop();
            console.log("Track stopped:", track.kind);
          });
          mediaStreamRef.current = null;
        }
        
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
          await audioContextRef.current.close();
          console.log("Audio context closed");
          audioContextRef.current = null;
        }
        
        if (animationFrameIdRef.current) {
          cancelAnimationFrame(animationFrameIdRef.current);
          console.log("Animation frame canceled");
          animationFrameIdRef.current = null;
        }
      } catch (error) {
        console.error("Error during cleanup:", error);
      }
    };
    
    // Race the timeout against the actual cleanup
    await Promise.race([cleanupPromise(), timeoutPromise]);
  };

  useEffect(() => {
    if (!callId) return;
    callEndedRef.current = false;

    async function initCall() {
      try {
        // Get user media
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        
        // Set up audio analysis with optimized settings
        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;
        
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        
        // Simplify analyzer settings for better performance
        analyser.fftSize = 64; // Even smaller FFT size for faster processing
        analyser.smoothingTimeConstant = 0.3; // Less smoothing for more responsive updates
        analyser.minDecibels = -90; // Increase sensitivity
        
        source.connect(analyser);
        analyserRef.current = analyser;
        
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        dataArrayRef.current = dataArray;
        
        // Function to update audio levels with optimized performance
        const updateAudioLevel = () => {
          if (callEndedRef.current) return;
          if (!analyserRef.current || !dataArrayRef.current) return;
          
          analyserRef.current.getByteFrequencyData(dataArrayRef.current);
          
          // Simplified audio level calculation - just average the whole spectrum
          let sum = 0;
          for (let i = 0; i < dataArrayRef.current.length; i++) {
            sum += dataArrayRef.current[i];
          }
          
          const average = sum / dataArrayRef.current.length;
          
          // Simple scaling
          const scaledLevel = average / 255;
          
          setAudioLevel(scaledLevel);
          timeRef.current += 0.1; // Increment time for sine wave animation
          animationFrameIdRef.current = requestAnimationFrame(updateAudioLevel);
        };
        
        updateAudioLevel();
      } catch (error) {
        console.error("Error accessing microphone:", error);
        return;
      }

      // Initialize session
      const session = new UltravoxSession();
      sessionRef.current = session;
      
      session.joinCall(`wss://prod-voice-pgaenaxiea-uc.a.run.app/calls/${callId}`, JSON.stringify({
        stream: mediaStreamRef.current,
      }));

      session.addEventListener("status", () => {
        setSessionStatus(session.status);
      });
    }

    initCall();

    // Add beforeunload event listener to clean up when page is closed
    const handleBeforeUnload = () => {
      cleanupResources();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      cleanupResources();
    };
  }, [callId, router]);

  const handleEndCall = async () => {
    try {
      console.log("Ending call...");
      
      // First stop the call
      if (sessionRef.current) {
        console.log("Leaving call session...");
        await sessionRef.current.leaveCall();
        sessionRef.current = null;
      }
      
      // Stop all media tracks
      if (mediaStreamRef.current) {
        console.log("Stopping media tracks...");
        mediaStreamRef.current.getTracks().forEach((track) => {
          track.stop();
          console.log(`Track ${track.kind} stopped`);
        });
        mediaStreamRef.current = null;
      }
      
      // Close audio context
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        console.log("Closing audio context...");
        await audioContextRef.current.close();
        audioContextRef.current = null;
      }
      
      // Cancel animation frame
      if (animationFrameIdRef.current) {
        console.log("Canceling animation frame...");
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
      
      // Mark call as ended
      callEndedRef.current = true;
      
      // Add a small delay to ensure everything is cleaned up
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log("Call successfully ended, navigating to transcript");
      
      // Clear any browser cache or session storage
      sessionStorage.clear();
      
      // Force a full page reload when navigating to transcript
      window.location.href = `/transcript?callId=${callId}`;
    } catch (error) {
      console.error("Error ending call:", error);
      // Navigate anyway in case of error
      callEndedRef.current = true;
      window.location.href = `/transcript?callId=${callId}`;
    }
  };

  const handleHomeClick = async (e) => {
    e.preventDefault();
    await cleanupResources();
    router.push('/');
  };

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#9351E2] via-[#BC45FF] to-[#1B0D2D] p-4">
      <div className="bg-gradient-to-br from-white to-[#f8f9ff] p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-[#1B0D2D] mb-6">Call in Progress</h1>
        
        {/* Simplified Audio Visualization - Pure Sine Wave */}
        <div className="mb-6">
          <div className="flex justify-center items-center h-16 mb-2">
            <svg width="300" height="60" viewBox="0 0 300 60">
              <path
                d={generateSinePath(
                  300, // width
                  60,  // height
                  sessionStatus === UltravoxSessionStatus.SPEAKING ? 
                    Math.max(0.2, audioLevel) * 20 : // amplitude when speaking
                    sessionStatus === UltravoxSessionStatus.LISTENING ? 
                      Math.max(0.1, audioLevel) * 10 : // amplitude when listening
                      2, // minimal amplitude when idle
                  timeRef.current // time offset for animation
                )}
                fill="none"
                stroke={statusColor}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
        
        <p className="flex items-center justify-center mb-6">
          <span className="inline-block w-3 h-3 rounded-full mr-2 animate-pulse" style={{ backgroundColor: statusColor }}></span>
          <span className="text-lg font-medium text-[#1B0D2D]">Status: {statusLabel}</span>
        </p>
        
        <button
          onClick={handleEndCall}
          className="bg-gradient-to-r from-[#9351E2] to-[#EE7794] text-white font-medium py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-105 mb-4 w-full max-w-xs mx-auto"
        >
          End Call
        </button>
        
        <div className="mt-4">
          <button 
            onClick={handleHomeClick}
            className="text-[#9351E2] hover:text-[#EE7794] transition-colors font-medium"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper function to generate a sine wave path for SVG
function generateSinePath(width, height, amplitude, timeOffset) {
  const centerY = height / 2;
  const points = [];
  
  for (let x = 0; x < width; x += 1) {
    // Create a sine wave with varying frequency
    const y = centerY + Math.sin(x * 0.05 + timeOffset) * amplitude;
    points.push(`${x},${y}`);
  }
  
  return `M0,${centerY} Q${points.join(' ')}`;
}

export default function CallPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallContent />
    </Suspense>
  );
}