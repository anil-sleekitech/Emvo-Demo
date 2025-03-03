"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { 
  FaMicrophone, 
  FaUserTie, 
  FaHospital, 
  FaPlane, 
  FaFileInvoiceDollar, 
  FaHeartbeat, 
  FaCalendarCheck, 
  FaFileMedical, 
  FaAmbulance, 
  FaClipboardList,
  FaHeadset,
  FaMedal,
  FaPlus
} from "react-icons/fa"; 
import { MdOutlineTranslate, MdRecordVoiceOver } from "react-icons/md";
import { BsPersonVcard } from "react-icons/bs";
import { prompts } from "../prompts";
import { voices } from "../config/voices";
import EmvoLogo from './Emvo_Logo.png';

// Define services and their corresponding options
const serviceOptions: Record<string, { name: string; icon: React.ReactNode; promptKey?: string }[]> = {
  Insurance: [
    { 
      name: "Policy Information Retrieval", 
      icon: <FaFileInvoiceDollar size={30} color="#9351E2" />,
      promptKey: "getPolicyInformationPrompt"
    },
    { 
      name: "Health Claim Initiation", 
      icon: <FaHeartbeat size={30} color="#BC45FF" />,
      promptKey: "getHealthClaimPrompt"
    },
    { 
      name: "Policy Renewal Reminders", 
      icon: <BsPersonVcard size={30} color="#EE7794" />,
      promptKey: "getPolicyRenewalPrompt"
    },
  ],
  Healthcare: [
    { 
      name: "Appointment Booking", 
      icon: <FaCalendarCheck size={30} color="#9351E2" />,
      promptKey: "getAppointmentBookingPrompt"
    },
    { 
      name: "Diagnostic Centre Report Advisor", 
      icon: <FaFileMedical size={30} color="#BC45FF" />,
      promptKey: "getDiagnosticReportPrompt"
    },
    { 
      name: "Emergency", 
      icon: <FaAmbulance size={30} color="#EE7794" />,
      promptKey: "getEmergencyPrompt"
    },
    { 
      name: "Survey & Feedback", 
      icon: <FaClipboardList size={30} color="#1B0D2D" />,
      promptKey: "getSurveyFeedbackPrompt"
    }
  ],
  Aviation: [
    { 
      name: "Customer Support", 
      icon: <FaHeadset size={30} color="#9351E2" />,
      promptKey: "getCustomerSupportPrompt"
    },
    { 
      name: "Loyalty Program & Frequent Flyer Membership Renewal", 
      icon: <FaMedal size={30} color="#BC45FF" />,
      promptKey: "getLoyaltyProgramPrompt"
    }
  ],
  Custom: [
    {
      name: "Custom Agent",
      icon: <MdRecordVoiceOver size={30} color="#9351E2" />,
      promptKey: "customPrompt"
    }
  ]
};

// const handleUpload = () => {
//   if (kbFile) {
//     console.log("Uploading file:", kbFile.name);
//   } else if (kbUrl.trim() !== "") {
//     console.log("Uploading URL:", kbUrl);
//   } else {
//     toast.error("No file or URL provided");
//   }
// };

interface ServiceSelectionProps {
  service: string;
  setService: (service: string) => void;
  setPlace: (place: string) => void;
}

// Move this component outside of Home
function CustomerNameInput({ customerName, setCustomerName }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-[#1B0D2D] mb-3">Customer Name</h2>
      <input
        type="text"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        placeholder="Enter customer name"
        className="w-full p-3 border border-[#9351E2]/30 rounded-lg text-[#1B0D2D] focus:outline-none focus:ring-2 focus:ring-[#9351E2]"
      />
    </div>
  );
}

function ServiceSelection({ service, setService, setPlace }: ServiceSelectionProps) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-[#1B0D2D] mb-3">Select Industry</h2>
      <div className="grid grid-cols-4 gap-4">
        {Object.keys(serviceOptions).map((serviceName) => (
          <div
            key={serviceName}
            onClick={() => {
              setService(serviceName);
              setPlace(""); // reset place on change
            }}
            className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition transform hover:scale-105 ${
              service === serviceName ? "border-[#9351E2] bg-[#9351E2]/10" : "border-[#9351E2]/30"
            }`}
          >
            {serviceName === "Insurance" ? <FaUserTie size={24} color="#9351E2" /> : 
             serviceName === "Healthcare" ? <FaHospital size={24} color="#BC45FF" /> :
             serviceName === "Aviation" ? <FaPlane size={24} color="#1B0D2D" /> :
             <MdRecordVoiceOver size={24} color="#EE7794" />}
            <span className="mt-2 text-[#1B0D2D]">{serviceName}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface PlaceSelectionProps {
  service: string;
  place: string;
  setPlace: (place: string) => void;
}

function PlaceSelection({ service, place, setPlace }: PlaceSelectionProps) {
  if (!service) return null;
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-[#1B0D2D] mb-3">Select Agent</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {serviceOptions[service].map((option) => (
          <div
            key={option.name}
            onClick={() => setPlace(option.name)}
            className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition transform hover:scale-105 ${
              place === option.name ? "border-[#9351E2] bg-[#9351E2]/10" : "border-[#9351E2]/30"
            }`}
          >
            {option.icon}
            <span className="mt-2 text-[#1B0D2D] text-center">{option.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface VoiceSelectionProps {
  voice: string;
  setVoice: (voice: string) => void;
}

function VoiceSelection({ voice, setVoice }: VoiceSelectionProps) {
  const voices = [
    { id: "e6fce4ac-da54-43e9-8fb2-66de86f72a5b", label: "Richard-English", icon: <MdRecordVoiceOver size={30} color="#9351E2" /> },
    { id: "9f6262e3-1b03-4a0b-9921-50b9cff66a43", label: "Krishna-Hindi-IndianEnglish", icon: <MdOutlineTranslate size={30} color="#BC45FF" /> },
    { id: "c2c5cce4-72ec-4d8b-8cdb-f8a0f6610bd1", label: "Riya-Hindi-IndianEnglish", icon: <MdOutlineTranslate size={30} color="#EE7794" /> },
    { id: "ebae2397-0ba1-4222-9d5b-5313ddeb04b5", label: "Anjali-Hindi-IndianEnglish", icon: <MdOutlineTranslate size={30} color="#1B0D2D" /> },
  ];
  
  // Set a default voice if none is selected
  useEffect(() => {
    if (!voice && voices.length > 0) {
      setVoice(voices[0].id);
    }
  }, [voice, setVoice, voices]);
  
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-[#1B0D2D] mb-3">Select Voice</h2>
      <div className="grid grid-cols-4 gap-4">
        {voices.map((v) => (
          <div
            key={v.id}
            onClick={() => setVoice(v.id)}
            className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition transform hover:scale-105 ${
              voice === v.id ? "border-[#9351E2] bg-[#9351E2]/10" : "border-[#9351E2]/30"
            }`}
          >
            {v.icon}
            <span className="mt-2 text-[#1B0D2D]">{v.label.split('-')[0]}</span>
          </div>
        ))}
      </div>
      {voice && (
        <p className="text-sm text-[#1B0D2D]/70 mt-2">
          Selected voice: {voices.find(v => v.id === voice)?.label.split('-')[0] || "Unknown"}
        </p>
      )}
    </div>
  );
}

interface TaskInputProps {
  tasks: string[];
  newTask: string;
  setNewTask: (task: string) => void;
  handleAddTask: () => void;
}

function TaskInput({ tasks, newTask, setNewTask, handleAddTask }: TaskInputProps) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-[#1B0D2D] mb-3">Special Instructions</h2>
      <div className="flex mb-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter special instructions for the AI agent"
          className="flex-grow p-3 border border-[#9351E2]/30 rounded-l-lg text-[#1B0D2D] focus:outline-none focus:ring-2 focus:ring-[#9351E2]"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleAddTask();
            }
          }}
        />
        <button
          onClick={handleAddTask}
          className="bg-[#BC45FF] text-white px-4 rounded-r-lg hover:bg-[#9351E2] transition"
        >
          <FaPlus />
        </button>
      </div>
      {tasks.length > 0 && (
        <ul className="space-y-2">
          {tasks.map((task, index) => (
            <li key={index} className="p-2 bg-[#9351E2]/10 rounded-lg text-[#1B0D2D]">
              {task}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Custom prompt input component
function CustomPromptInput({ service, customSystemPrompt, setCustomSystemPrompt }) {
  if (service !== "Custom") return null;
  
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-[#1B0D2D] mb-3">Custom System Prompt</h2>
      <textarea
        value={customSystemPrompt}
        onChange={(e) => setCustomSystemPrompt(e.target.value)}
        placeholder="Enter your custom system prompt here..."
        className="w-full h-64 p-4 border border-[#9351E2]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9351E2] text-[#1B0D2D]"
      />
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [service, setService] = useState("");
  const [voice, setVoice] = useState("e6fce4ac-da54-43e9-8fb2-66de86f72a5b"); // Set default voice
  const [place, setPlace] = useState("");
  const [tasks, setTasks] = useState<string[]>([]); // Explicitly type as string array
  const [newTask, setNewTask] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [customSystemPrompt, setCustomSystemPrompt] = useState("");
  const [customerName, setCustomerName] = useState("Vaibhav Anand"); // Set default name

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks((prev) => [...prev, newTask.trim()]);
      setNewTask("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Set loading state
    setIsLoading(true);
    
    // Get current time
    const now = new Date();
    const currentTime = now.toLocaleTimeString();
    
    // Determine which prompt to use based on service and option
    let systemPrompt = "";
    
    if (service === "Custom") {
      // Use the custom prompt with voice introduction
      const customPromptFunction = prompts.custom.customPrompt;
      if (typeof customPromptFunction === 'function') {
        systemPrompt = customPromptFunction(voice, customSystemPrompt);
      } else {
        systemPrompt = customSystemPrompt;
      }
    } else if (place && serviceOptions[service].find(option => option.name === place)) {
      // Get the appropriate service prompts
      const selectedOption = serviceOptions[service].find(option => option.name === place);
      if (selectedOption && selectedOption.promptKey) {
        const servicePrompts = prompts[service.toLowerCase()];
        
        if (selectedOption.promptKey in servicePrompts) {
          // Call the function with the voice ID to get the voice-specific prompt
          const promptFunction = servicePrompts[selectedOption.promptKey as keyof typeof servicePrompts];
          if (typeof promptFunction === 'function') {
            systemPrompt = promptFunction(voice);
          }
        }
      }
    }
    
    // Add customer name to the beginning of the prompt if provided
    if (customerName.trim()) {
      systemPrompt = `Customer Name: ${customerName}\n\n${systemPrompt}`;
    }

    // Add tasks to the prompt if any
    if (tasks.length > 0) {
      systemPrompt += `\n\nSpecial Instructions:\n${tasks.map(task => `- ${task}`).join('\n')}`;
    }

    // Log the data being sent for debugging
    console.log("Sending data:", {
      service,
      voice,
      place,
      time: currentTime,
      tasks,
      customerName,
      systemPrompt
    });

    try {
      const response = await fetch(
        "https://bucbk5tdbzwzu5frgxybgnmprm0ibfcr.lambda-url.ap-south-1.on.aws/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            service, 
            voice,
            place, 
            time: currentTime, 
            tasks,
            customerName,
            systemPrompt 
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        throw new Error(`Failed to send data to the server: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.callId) {
        throw new Error("No call ID returned from server");
      }
      
      console.log("Call initiated with ID:", data.callId);
      router.push(`/call?callId=${data.callId}`);
    } catch (error) {
      console.error("Error initiating call:", error);
      toast.error("An error occurred while trying to initiate the call. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#9351E2] via-[#BC45FF] to-[#1B0D2D] p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl relative">
        {/* Logo positioned at top left */}
        <div className="absolute top-4 left-4">
          <Image 
            src={EmvoLogo} 
            alt="Emvo Logo" 
            width={80} 
            height={80} 
            priority
          />
        </div>
        
        {/* Title centered but with space for logo */}
        <div className="text-center pt-16 pb-6">
          <h1 className="text-4xl font-bold text-[#1B0D2D]">Emvo DemoBox</h1>
        </div>
        
        <ServiceSelection service={service} setService={setService} setPlace={setPlace} />
        <PlaceSelection service={service} place={place} setPlace={setPlace} />
        <VoiceSelection voice={voice} setVoice={setVoice} />
        <CustomerNameInput 
          customerName={customerName} 
          setCustomerName={setCustomerName} 
        />
        <CustomPromptInput 
          service={service} 
          customSystemPrompt={customSystemPrompt} 
          setCustomSystemPrompt={setCustomSystemPrompt} 
        />
        <TaskInput tasks={tasks} newTask={newTask} setNewTask={setNewTask} handleAddTask={handleAddTask} />
        <div className="flex justify-center mt-8">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center bg-gradient-to-r from-[#9351E2] to-[#EE7794] text-white font-medium py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <FaMicrophone className="mr-2" />
            {isLoading ? "Initiating Call..." : "Try Call"}
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
