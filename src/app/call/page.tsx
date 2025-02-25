"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UltravoxSession, UltravoxSessionStatus } from "ultravox-client";

function CallContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callId = searchParams ? searchParams.get("callId") : null;
  const [sessionStatus, setSessionStatus] = useState("idle");

  useEffect(() => {
    if (!callId) return;

    let session: UltravoxSession;
    let mediaStream: MediaStream;

    async function initCall() {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (error) {
        console.error("Error accessing microphone:", error);
        return;
      }

      session = new UltravoxSession();
      session.joinCall(`wss://prod-voice-pgaenaxiea-uc.a.run.app/calls/${callId}`, JSON.stringify({
        stream: mediaStream,
      }));

      session.addEventListener("status", () => {
        setSessionStatus(session.status);
      });
    }

    initCall();

    return () => {
      if (session) {
        session.leaveCall();
      }
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [callId]);

  const handleEndCall = () => {
    router.push("/transcript");
  };

  let statusLabel = "Idle";
  if (sessionStatus === UltravoxSessionStatus.SPEAKING) {
    statusLabel = "Speaking";
  } else if (sessionStatus === UltravoxSessionStatus.LISTENING) {
    statusLabel = "Listening";
  } else if (sessionStatus === UltravoxSessionStatus.IDLE) {
    statusLabel = "Idle";
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Call in Progress</h1>
        <p className="mb-4 text-xl">Status: {statusLabel}</p>
        <button
          onClick={handleEndCall}
          className="bg-gradient-to-r from-custom-pink to-custom-purple text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
        >
          End Call
        </button>
      </div>
    </div>
  );
}

export default function CallPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallContent />
    </Suspense>
  );
}