"use client";
import React, { useState } from "react";
import { StaticImageData } from "next/image";

// Import all assets
import healthcareIcon from "../../assets/healthcare.png";
import aviationIcon from "../../assets/aviation.png";
import ecommIcon from "../../assets/ecomm.png";
import customIcon from "../../assets/custom.png";
import healthIcon from "../../assets/health.png";
import ramanImage from "../../assets/Ramanbhai.png";
import krishnaImage from "../../assets/krishna.png";
import riyaImage from "../../assets/riya.png";
import anjaliImage from "../../assets/anjali.png";

// Import agent icons
import heartIcon from '../../assets/heart.png';
import lifeInsuIcon from '../../assets/lifeinsu.png';
import hospitalIcon from '../../assets/hospital.png';
import headphoneIcon from '../../assets/headp.png';
import customAgentIcon from '../../assets/customagentb.png';

import Layout from "@/components/Layout";
import HomeContent from "@/components/HomeContent";
import PlaygroundContent from "@/components/PlaygroundContent";
import { toast } from "react-toastify";
import CallInterface from "@/components/CallInterface";
import CallSummary from "@/components/CallSummary";
import { CallState } from "@/types";
import UserInfoDialog from "@/components/UserInfoDialog";
import FeedbackDialog from "@/components/FeedbackDialog";
import { prompts } from "@/prompts";
import { UltravoxSession, UltravoxSessionStatus } from "ultravox-client";

// Extend Window interface
declare global {
  interface Window {
    stream?: MediaStream;
  }
}

// Define types
type Step = "home" | "playground";
type IndustryType = "Insurance" | "Healthcare" | "Aviation" | "E-commerce" | "Custom";

type PromptFunction = (voiceId: string) => string;

interface Agent {
  title: string;
  description: string;
  icon: StaticImageData;
}

interface Industry {
  icon: StaticImageData;
  agents: Agent[];
}

type Industries = Record<IndustryType, Industry>;

// Helper function to get agent icon
const getAgentIcon = (title: string): StaticImageData => {
  switch (title.toLowerCase()) {
    case "health insurance advisor":
      return heartIcon;
    case "life insurance advisor":
      return lifeInsuIcon;
    case "hospital receptionist":
      return hospitalIcon;
    case "diagnostic report advisor":
    case "customer relations executive":
    case "customer support executive":
      return headphoneIcon;
    default:
      return customAgentIcon;
  }
};

const industries: Industries = {
  Insurance: {
    icon: healthIcon,
    agents: [
      {
        title: "Health insurance advisor",
        description: "Get policy details, coverage info, and answers instantly",
        icon: getAgentIcon("Health insurance advisor"),
      },
      {
        title: "Life insurance advisor",
        description: "A seamless multi-agent system for choosing life insurance",
        icon: getAgentIcon("Life insurance advisor"),
      },
    ],
  },
  Healthcare: {
    icon: healthcareIcon,
    agents: [
      {
        title: "Hospital receptionist",
        description: "Includes booking, cancellation & rescheduling",
        icon: getAgentIcon("Hospital receptionist"),
      },
      {
        title: "Diagnostic report advisor",
        description: "Simplifies blood work & health reports & provides preventive tips",
        icon: getAgentIcon("Diagnostic report advisor"),
      },
    ],
  },
  Aviation: {
    icon: aviationIcon,
    agents: [
      {
        title: "Customer relations executive",
        description: "Flights, bookings, cancellations, baggage, delays, refunds, and more",
        icon: getAgentIcon("Customer relations executive"),
      },
    ],
  },
  "E-commerce": {
    icon: ecommIcon,
    agents: [
      {
        title: "Customer support executive",
        description: "Order, returns, refunds, exchanges, payments, account, or product issues",
        icon: getAgentIcon("Customer support executive"),
      },
    ],
  },
  Custom: {
    icon: customIcon,
    agents: [
      {
        title: "Customise your agent",
        description: "Personalise your agent—tailor responses, tone & style your way!",
        icon: getAgentIcon("Customise your agent"),
      },
    ],
  },
};

const voices = [
  { id: "raman", name: "Raman", avatar: ramanImage },
  { id: "krishna", name: "Krishna", avatar: krishnaImage },
  { id: "riya", name: "Riya", avatar: riyaImage },
  { id: "anjali", name: "Anjali", avatar: anjaliImage },
];

// Helper function to get voice ID from name
const getVoiceId = (voiceName: string | null): string | null => {
  if (!voiceName) return null;
  const voiceConfig = voices.find(v => v.name.toLowerCase() === voiceName.toLowerCase());
  if (!voiceConfig) return null;
  
  // Map the voice name to its corresponding ID from config/voices.ts
  switch (voiceConfig.name.toLowerCase()) {
    case "raman":
      return "e6fce4ac-da54-43e9-8fb2-66de86f72a5b"; // Richard-English
    case "krishna":
      return "9f6262e3-1b03-4a0b-9921-50b9cff66a43"; // Krishna-Hindi-IndianEnglish
    case "riya":
      return "c2c5cce4-72ec-4d8b-8cdb-f8a0f6610bd1"; // Riya-Hindi-IndianEnglish
    case "anjali":
      return "ebae2397-0ba1-4222-9d5b-5313ddeb04b5"; // Anjali-Hindi-IndianEnglish
    default:
      return null;
  }
};

const Home: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>("home");
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<UltravoxSessionStatus>(UltravoxSessionStatus.IDLE);
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    designation: string;
    feedback?: {
      naturalness: string;
      emotionalIntelligence: string;
      businessInterest: string;
      preferredTime: string;
    };
  } | null>(null);
  const [callState, setCallState] = useState<CallState>({
    isActive: false,
    agentName: '',
    transcripts: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<UltravoxSession | null>(null);
  const [currentCallId, setCurrentCallId] = useState<string | null>(null);

  const handleTryEmvo = () => {
    if (currentStep === "home") {
      setCurrentStep("playground");
      setSelectedIndustry("Insurance");
    } else {
      if (!selectedIndustry || !selectedAgent || !selectedVoice) {
        toast.error("Please complete all selections before proceeding");
        return;
      }
      
      // Open the dialog instead of starting the call immediately
      setIsDialogOpen(true);
    }
  };

  const handleNavigation = (step: "home" | "playground") => {
    setCurrentStep(step);
    if (step === "playground" && !selectedIndustry) {
      setSelectedIndustry("Insurance");
    }
  };

  const handleUserInfoSubmit = async (userInfo: { name: string; email: string; designation: string }) => {
    setIsLoading(true);
    try {
      // Store user info
      setUserData(userInfo);
      
      // Get current time
      const now = new Date();
      const currentTime = now.toLocaleTimeString();
      
      // Get the voice ID from the selected voice name
      const voiceId = getVoiceId(selectedVoice);
      if (!voiceId) {
        toast.error("Invalid voice selection");
        return;
      }
      
      // Determine which prompt to use based on industry and agent
      let systemPrompt = "";
      
      if (selectedIndustry === "Custom") {
        // Use custom prompt
        const customPromptFunction = prompts.custom.customPrompt;
        if (typeof customPromptFunction === 'function') {
          systemPrompt = customPromptFunction(voiceId, "");
        }
      } else if (selectedIndustry && selectedAgent) {
        // Get the appropriate service prompts
        const industry = selectedIndustry.toLowerCase() as keyof typeof prompts;
        const servicePrompts = prompts[industry];
        const promptKey = getPromptKey(selectedAgent);
        
        if (promptKey && servicePrompts && promptKey in servicePrompts) {
          const promptFunction = servicePrompts[promptKey as keyof typeof servicePrompts] as PromptFunction;
          systemPrompt = promptFunction(voiceId);
        }
      }

      // Add customer name to the beginning of the prompt
      if (userInfo.name.trim()) {
        systemPrompt = `Customer Name: ${userInfo.name}\n\n${systemPrompt}`;
      }

      // Log the data being sent for debugging
      console.log("Sending data:", {
        service: selectedIndustry?.toLowerCase(),
        voice: voiceId,
        agent: selectedAgent,
        time: currentTime,
        customerName: userInfo.name,
        systemPrompt
      });
      const response = await fetch(
     
        "https://fc57nva4po6cjo22zd3o7u7mcy0jpzta.lambda-url.ap-south-1.on.aws/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            service: selectedIndustry?.toLowerCase(), 
            voice: voiceId,
            agent: selectedAgent, 
            time: currentTime,
            customerName: userInfo.name,
            systemPrompt
          }),
        }
      );
      // const response = await fetch(
      //   "https://2albu22pt7.execute-api.us-east-1.amazonaws.com/ultravox-lambda/",
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({ 
      //       service: selectedIndustry?.toLowerCase(), 
      //       voice: voiceId,
      //       agent: selectedAgent, 
      //       time: currentTime,
      //       customerName: userInfo.name,
      //       systemPrompt
      //     }),
      //   }
      // );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        throw new Error(`Failed to send data to the server: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.callId) {
        throw new Error("No call ID returned from server");
      }

      // Store the call ID
      setCurrentCallId(data.callId);

      // Close the dialog
      setIsDialogOpen(false);

      setCallState(prev => ({
        ...prev,
        isActive: true,
        agentName: selectedAgent || ''
      }));

      // Initialize call session
      const newSession = new UltravoxSession();
      setSession(newSession);
      
      try {
        // Get user media
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        window.stream = stream;

        newSession.joinCall(`wss://prod-voice-pgaenaxiea-uc.a.run.app/calls/${data.callId}`, JSON.stringify({
          stream: stream,
        }));

        newSession.addEventListener("status", () => {
          setSessionStatus(newSession.status);
        });

      } catch (error) {
        console.error("Error accessing microphone:", error);
        toast.error("Failed to access microphone. Please check your permissions and try again.");
        return;
      }

    } catch (error) {
      console.error("Error initiating call:", error);
      toast.error("An error occurred while trying to initiate the call. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get prompt key from agent title
  const getPromptKey = (agentTitle: string): string | null => {
    switch (agentTitle) {
      case "Health insurance advisor":
        return "getPolicyInformationPrompt";
      case "Life insurance advisor":
        return "getHealthClaimPrompt";
      case "Hospital receptionist":
        return "getAppointmentBookingPrompt";
      case "Diagnostic report advisor":
        return "getDiagnosticReportPrompt";
      case "Customer relations executive":
        return "getCustomerSupportPrompt";
      case "Customer support executive":
        return "getCustomerSupportPrompt";
      case "Customise your agent":
        return "customPrompt";
      default:
        return null;
    }
  };

  const fetchCallRecording = async (callId: string): Promise<string> => {
    try {
      const response = await fetch(
        `https://km3t19pim7.execute-api.us-east-1.amazonaws.com/default/playground-apis/callrecording?callId=${callId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch recording: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Convert base64 to audio URL
      const audioBlob = await fetch(`data:${data.contentType};base64,${data.audioData}`).then(res => res.blob());
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.error("Error fetching call recording:", error);
      throw error;
    }
  };

  const handleEndCall = async () => {
    setIsLoading(true);
    try {
      console.log("Ending call...");
      
      // Leave the call if session exists
      if (session) {
        try {
          await session.leaveCall();
          console.log("Call left successfully");
        } catch (error) {
          console.error("Error leaving call:", error);
        }
        setSession(null);
      }
      
      // Stop all media tracks
      if (window.stream) {
        console.log("Stopping media tracks...");
        window.stream.getTracks().forEach((track) => {
          track.stop();
          console.log(`Track ${track.kind} stopped`);
        });
        window.stream = undefined;
      }
      
      // Reset session status
      setSessionStatus(UltravoxSessionStatus.IDLE);

      // Fetch call recording if we have a call ID
      let audioUrl = "";
      if (currentCallId) {
        try {
          // Add a small delay to ensure the recording is ready
          await new Promise(resolve => setTimeout(resolve, 2000));
          audioUrl = await fetchCallRecording(currentCallId);
        } catch (error) {
          console.error("Error fetching call recording:", error);
          toast.error("Failed to fetch call recording. Using fallback audio.");
          audioUrl = "/sample-call.mp3";
        }
      }
      
      // Update call state with transcripts and audio URL
      setCallState(prev => ({
        ...prev,
        isActive: false,
        transcripts: [
          { text: "Hi, how can I help you today?", timestamp: "11:12", isUser: false },
          { text: "I need help with my insurance claim", timestamp: "11:12", isUser: true },
        ],
        audioUrl: audioUrl || "/sample-call.mp3"
      }));
      
      // Reset current call ID
      setCurrentCallId(null);
      
      // Open feedback dialog after call ends
      setIsFeedbackDialogOpen(true);
    } catch (error) {
      console.error("Error ending call:", error);
      // Open feedback dialog anyway
      setIsFeedbackDialogOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedbackSubmit = async (feedback: {
    naturalness: string;
    emotionalIntelligence: string;
    businessInterest: string;
    preferredTime: string;
  }) => {
    setIsLoading(true);
    try {
      // Validate required data
      if (!userData || !userData.name || !userData.email) {
        throw new Error("Missing required user information");
      }

      // Combine user data with feedback
      const completeData = {
        name: userData.name,
        email: userData.email,
        designation: userData.designation || "",
        naturalness: feedback.naturalness,
        emotionalIntelligence: feedback.emotionalIntelligence,
        businessInterest: feedback.businessInterest,
        preferredTime: feedback.preferredTime,
        timestamp: new Date().toISOString(),
        selectedIndustry: selectedIndustry || "",
        selectedAgent: selectedAgent || "",
        selectedVoice: selectedVoice || ""
      };

      console.log("Sending feedback data:", completeData);

      // Send data to API
      const response = await fetch(
        "https://flpfl2gmba.execute-api.us-east-1.amazonaws.com/Playground-Feedback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(completeData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error response:", errorText);
        throw new Error(`Failed to submit feedback: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Feedback submitted successfully:", result);
      toast.success("Thank you for your feedback!");

      // Store feedback with user data locally
      setUserData(prev => prev ? {
        ...prev,
        feedback
      } : null);

      // Close the feedback dialog
      setIsFeedbackDialogOpen(false);

    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit feedback. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (callState.isActive) {
      return (
        <CallInterface
          agentName={callState.agentName}
          onEndCall={handleEndCall}
          suggestions={[
            "Can you check my doctor's appointment?",
            "Can you explain my hospital bill?",
            "I need a cost estimate for my treatment",
            "Can you send my medical reports via email?",
            "Where can I collect my lab test reports?"
          ]}
          sessionStatus={sessionStatus}
          isLoading={isLoading}
        />
      );
    }
    
    if (callState.transcripts.length > 0) {
      return (
        <>
          <CallSummary
            agentName={callState.agentName}
            audioUrl={callState.audioUrl || ''}
            transcripts={callState.transcripts}
            onStartNewCall={() => setCallState({ isActive: false, agentName: '', transcripts: [] })}
          />
          <FeedbackDialog
            isOpen={isFeedbackDialogOpen}
            onClose={() => setIsFeedbackDialogOpen(false)}
            onSubmit={handleFeedbackSubmit}
          />
        </>
      );
    }

    if (currentStep === "home") {
      return <HomeContent onTryEmvo={handleTryEmvo} />;
    }
    
    return (
      <>
        <PlaygroundContent
          selectedIndustry={selectedIndustry}
          setSelectedIndustry={setSelectedIndustry}
          selectedAgent={selectedAgent}
          setSelectedAgent={setSelectedAgent}
          selectedVoice={selectedVoice}
          setSelectedVoice={setSelectedVoice}
          onTryEmvo={handleTryEmvo}
          industries={industries}
          voices={voices}
        />
        <UserInfoDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmit={handleUserInfoSubmit}
        />
      </>
    );
  };

  return <Layout onNavigate={handleNavigation}>{renderContent()}</Layout>;
};

export default Home;
