"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaMicrophone, FaUser, FaUserTie } from "react-icons/fa"; 



// Define services and their corresponding options
const serviceOptions: Record<string, { name: string; icon: React.ReactNode; systemPrompt?: string }[]> = {
  Insurance: [
    { 
      name: "Policy Information Retrieval", 
      icon: <FaUserTie size={30} />,
      systemPrompt: `**Role:** AI-powered insurance agent specializing in policy information retrieval, helping customers understand their coverage details, policy terms, premium information, and answering general insurance questions.

**Key Objectives:**
1. Provide clear, accurate information about customers' insurance policies
2. Help customers understand their coverage, benefits, and limitations
3. Assist with policy document requests and explanations
4. Respond with empathy and professionalism to all inquiries
5. Ensure customers have a complete understanding of their policy information

**Customer Interaction Flow:**

1. **Greeting & Authentication**
   - "Hello, thank you for calling [Insurance Company] customer support. My name is [AI Agent Name]. To better assist you with your policy information, may I please have your policy number and verify some information?"
   - "For security purposes, could you please confirm your date of birth and the last four digits of your SSN/ID?"

2. **Policy Overview & Basic Information**
   - "Thank you for verifying your identity. I can see you have a [Policy Type] policy that began on [Start Date] and is valid through [End Date]."
   - "Your current premium is [Amount] paid [Frequency], with your next payment due on [Date]."
   - "Would you like me to go over the key coverage details of your policy?"

3. **Coverage Details & Limits**
   - "Your policy provides coverage for [List of Covered Items/Situations] with a maximum limit of [Amount]."
   - "For [Specific Coverage Area], your deductible is [Amount], and your coverage limit is [Amount]."
   - "I notice you have additional riders/endorsements for [Specific Items], which provides extra coverage for [Specific Situations]."

4. **Policy Document Requests**
   - "Would you like me to email you a copy of your policy documents?"
   - "I can send your policy declaration page, coverage summary, or full policy document. Which would you prefer?"
   - "You should receive the documents at [Email Address] within the next 15 minutes."

5. **Premium & Payment Information**
   - "Your current premium is [Amount] per [Period], which includes all discounts you qualify for."
   - "Your payment history shows your last payment of [Amount] was received on [Date]."
   - "Would you like information about available payment methods or setting up automatic payments?"

6. **Policy Changes & Updates**
   - "Based on your policy history, there was a change to your coverage on [Date] regarding [Change Details]."
   - "Your policy is scheduled for renewal on [Date]. Would you like to know about any changes that will take effect?"

7. **Claim Status (if applicable)**
   - "I see you have an open claim filed on [Date] regarding [Claim Reason]. The current status is [Status]."
   - "Your claim representative is [Name], and they can be reached at [Contact Information]."

8. **Answering Specific Coverage Questions**
   - "Yes, your policy does cover [Specific Situation] under the [Coverage Section] with a limit of [Amount]."
   - "For [Specific Scenario], your policy provides [Coverage Details], but please note there is a [Limitation/Exclusion] you should be aware of."

**Closing the Call & Summary:**
- "To summarize, we've discussed your [Policy Type] policy details, including your coverage for [Key Areas], premium information, and [Other Topics Discussed]."
- "I've sent the requested policy documents to your email at [Email Address]."
- "Is there anything else I can help you understand about your policy today?"
- "Thank you for choosing [Insurance Company]. If you have any other questions about your policy, please don't hesitate to call us back."

**Key AI Voice Agent Features:**
- Provides accurate, detailed policy information retrieval
- Explains complex insurance terms in simple, understandable language
- Securely authenticates customers before sharing sensitive information
- Offers document delivery options for policy materials
- Answers specific coverage questions with precise details
- Maintains a professional, helpful demeanor throughout the interaction`
    },
    { name: "Health Claim Initiation", icon: <FaUserTie size={30} /> },
    { name: "Policy Renewal Reminders", icon: <FaUserTie size={30} /> },
  ],
  "Healthcare": [
    { name: "Appointment Booking", icon: <FaUser size={30} /> },
    { name: "Diagnostic Centre Report Advisor", icon: <FaUser size={30} /> },
    { name: "Emergency", icon: <FaUser size={30} /> },
    { name: "Survey & Feedback", icon: <FaUser size={30} /> },
  ],
  "Aviation": [
    { name: "Customer Support", icon: <FaUser size={30} /> },
    { name: "Loyalty Program & Frequent Flyer Membership Renewal", icon: <FaUser size={30} /> }
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


function ServiceSelection({ service, setService, setPlace }: ServiceSelectionProps) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Select Industry</h2>
      <div className="flex space-x-4">
        {Object.keys(serviceOptions).map((serviceName) => (
          <div
            key={serviceName}
            onClick={() => {
              setService(serviceName);
              setPlace(""); // reset place on change
            }}
            className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition transform hover:scale-105 ${
              service === serviceName ? "border-blue-500" : "border-gray-300"
            }`}
          >
            {serviceName === "Insurance" ? <FaUserTie /> : <FaUser />}
            <span className="mt-2 text-gray-800">{serviceName}</span>
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
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Select Agent</h2>
      <div className="flex space-x-4">
        {serviceOptions[service].map((option) => (
          <div
            key={option.name}
            onClick={() => setPlace(option.name)}
            className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition transform hover:scale-105 ${
              place === option.name ? "border-blue-500" : "border-gray-300"
            }`}
          >
            {option.icon}
            <span className="mt-2 text-gray-800">{option.name}</span>
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
    { id: "e6fce4ac-da54-43e9-8fb2-66de86f72a5b", label: "Richard-English", icon: <FaUser size={30} /> },
    { id: "9f6262e3-1b03-4a0b-9921-50b9cff66a43", label: "Krishna-Hindi-Urdu", icon: <FaUser size={30} /> },
    { id: "c2c5cce4-72ec-4d8b-8cdb-f8a0f6610bd1", label: "Riya-Hindi-Urdu", icon: <FaUser size={30} /> },
    { id: "ebae2397-0ba1-4222-9d5b-5313ddeb04b5", label: "Anjali-Hindi-Urdu", icon: <FaUser size={30} /> },
  ];
  
  // Set a default voice if none is selected
  useEffect(() => {
    if (!voice && voices.length > 0) {
      setVoice(voices[0].id);
    }
  }, [voice, setVoice]);
  
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Select Voice</h2>
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {voices.map((v) => (
          <div
            key={v.id}
            onClick={() => setVoice(v.id)}
            className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition transform hover:scale-105 ${
              voice === v.id ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
          >
            {v.icon}
            <span className="mt-2 text-gray-800">{v.label}</span>
          </div>
        ))}
      </div>
      {voice && (
        <p className="text-sm text-gray-500 mt-2">
          Selected voice: {voices.find(v => v.id === voice)?.label || "Unknown"}
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
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Special Instructions</h2>
      {tasks.length > 0 && (
        <div className="mt-4 mb-4 y-2  border rounded-lg bg-gray-100 max-h-32 overflow-y-auto">
          <ul className="space-y-2">
            {tasks.map((task, index) => (
              <li key={index} className="bg-white p-2 rounded-lg shadow-sm text-gray-700">
                {task}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a task"
          className="flex-1 p-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddTask}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105"
        >
          Add
        </button>
      </div>
      
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

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks((prev) => [...prev, newTask.trim()]);
      setNewTask("");
    }
  };

  const handleTryCall = async () => {
    if (!service || !place) {
      toast.error("Please select an industry and agent before proceeding.");
      return;
    }
    
    // Ensure a voice is selected
    if (!voice) {
      toast.error("Please select a voice for the AI agent.");
      return;
    }

    const currentTime = new Date().toISOString();
    
    // Find the selected service option to get its system prompt
    const selectedOption = serviceOptions[service].find(option => option.name === place);
    const systemPrompt = selectedOption?.systemPrompt || "";

    // Log the data being sent for debugging
    console.log("Sending data:", {
      service,
      voice,
      place,
      time: currentTime,
      tasks,
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
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Emvo AI Demo</h1>
        <ServiceSelection service={service} setService={setService} setPlace={setPlace} />
        <PlaceSelection service={service} place={place} setPlace={setPlace} />
        <VoiceSelection voice={voice} setVoice={setVoice} />
        <TaskInput tasks={tasks} newTask={newTask} setNewTask={setNewTask} handleAddTask={handleAddTask} />
        <div className="flex justify-center mt-8">
          <button
            onClick={handleTryCall}
            className="flex items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-105"
          >
            <FaMicrophone className="mr-2" />
            Try Call
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
