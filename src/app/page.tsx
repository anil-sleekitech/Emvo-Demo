"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  FaMedal
} from "react-icons/fa"; 
import { MdOutlineTranslate, MdRecordVoiceOver } from "react-icons/md";
import { BsPersonVcard } from "react-icons/bs";
import { prompts } from "../prompts";
import { voices } from "../config/voices";
import * as pdfjsLib from 'pdfjs-dist';

// Replace the worker initialization with this
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.js';
}

// Define services and their corresponding options
const serviceOptions: Record<string, { name: string; icon: React.ReactNode; promptKey?: string }[]> = {
  Insurance: [
    { 
      name: "Policy Information Retrieval", 
      icon: <FaFileInvoiceDollar size={30} color="#4f46e5" />,
      promptKey: "getPolicyInformationPrompt"
    },
    { 
      name: "Health Claim Initiation", 
      icon: <FaHeartbeat size={30} color="#ef4444" />,
      promptKey: "getHealthClaimPrompt"
    },
    { 
      name: "Policy Renewal Reminders", 
      icon: <BsPersonVcard size={30} color="#0891b2" />,
      promptKey: "getPolicyRenewalPrompt"
    },
  ],
  "Healthcare": [
    { 
      name: "Appointment Booking", 
      icon: <FaCalendarCheck size={30} color="#059669" />,
      promptKey: "getAppointmentBookingPrompt"
    },
    { 
      name: "Diagnostic Centre Report Advisor", 
      icon: <FaFileMedical size={30} color="#8b5cf6" />,
      promptKey: "getDiagnosticReportPrompt"
    },
    { 
      name: "Emergency", 
      icon: <FaAmbulance size={30} color="#dc2626" />,
      promptKey: "getEmergencyPrompt"
    },
    { 
      name: "Survey & Feedback", 
      icon: <FaClipboardList size={30} color="#0284c7" />,
      promptKey: "getSurveyFeedbackPrompt"
    }
  ],
  "Aviation": [
    { 
      name: "Customer Support", 
      icon: <FaHeadset size={30} color="#4338ca" />,
      promptKey: "getCustomerSupportPrompt"
    },
    { 
      name: "Loyalty Program & Frequent Flyer Membership Renewal", 
      icon: <FaMedal size={30} color="#f59e0b" />,
      promptKey: "getLoyaltyProgramPrompt"
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

function ServiceSelection({ service, setService, setPlace }: ServiceSelectionProps) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Select Industry</h2>
      <div className="grid grid-cols-3 gap-4">
        {Object.keys(serviceOptions).map((serviceName) => (
          <div
            key={serviceName}
            onClick={() => {
              setService(serviceName);
              setPlace(""); // reset place on change
            }}
            className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition transform hover:scale-105 ${
              service === serviceName ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
          >
            {serviceName === "Insurance" ? <FaUserTie size={24} color="#4f46e5" /> : 
             serviceName === "Healthcare" ? <FaHospital size={24} color="#059669" /> :
             <FaPlane size={24} color="#0284c7" />}
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {serviceOptions[service].map((option) => (
          <div
            key={option.name}
            onClick={() => setPlace(option.name)}
            className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition transform hover:scale-105 ${
              place === option.name ? "border-blue-500 bg-blue-50" : "border-gray-300"
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
    { id: "e6fce4ac-da54-43e9-8fb2-66de86f72a5b", label: "Richard-English", icon: <MdRecordVoiceOver size={30} color="#4f46e5" /> },
    { id: "9f6262e3-1b03-4a0b-9921-50b9cff66a43", label: "Krishna-Hindi-IndianEnglish", icon: <MdOutlineTranslate size={30} color="#0891b2" /> },
    { id: "c2c5cce4-72ec-4d8b-8cdb-f8a0f6610bd1", label: "Riya-Hindi-IndianEnglish", icon: <MdOutlineTranslate size={30} color="#db2777" /> },
    { id: "ebae2397-0ba1-4222-9d5b-5313ddeb04b5", label: "Anjali-Hindi-IndianEnglish", icon: <MdOutlineTranslate size={30} color="#7c3aed" /> },
  ];
  
  // Set a default voice if none is selected
  useEffect(() => {
    if (!voice && voices.length > 0) {
      setVoice(voices[0].id);
    }
  }, [voice, setVoice, voices]);
  
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Select Voice</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
        <div className="mt-4 mb-4 border rounded-lg bg-gray-50 p-3 max-h-40 overflow-y-auto">
          <ul className="space-y-2">
            {tasks.map((task, index) => (
              <li key={index} className="bg-white p-3 rounded-lg shadow-sm text-gray-700 border border-gray-100">
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
          placeholder="Enter special instructions for the AI agent"
          className="flex-1 p-3 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
        />
        <button
          onClick={handleAddTask}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium py-3 px-5 rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105"
        >
          Add
        </button>
      </div>
    </div>
  );
}

interface FileUploadProps {
  onFileContent: (content: string) => void;
}

function FileUpload({ onFileContent }: FileUploadProps) {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [contentPreview, setContentPreview] = useState<string>("");

  const readPdfFile = async (file: File) => {
    try {
      setLoading(true);
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: { str: string }) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }
      
      onFileContent(fullText);
      setContentPreview(fullText.slice(0, 200) + '...');
      setUrl(''); // Clear URL when PDF is uploaded
      toast.success('PDF successfully processed!');
    } catch (error) {
      console.error('Error reading PDF:', error);
      toast.error('Error processing PDF file');
    } finally {
      setLoading(false);
    }
  };

  const fetchUrlContent = async () => {
    if (!url.trim()) {
      toast.error('Please enter a valid URL');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch URL content');
      
      const text = await response.text();
      // Basic HTML to text conversion
      const textContent = text.replace(/<[^>]*>/g, ' ')
                             .replace(/\s+/g, ' ')
                             .trim();
      
      onFileContent(textContent);
      setContentPreview(textContent.slice(0, 200) + '...');
      setFileName(''); // Clear filename when URL is processed
      toast.success('URL content successfully processed!');
    } catch (error) {
      console.error('Error fetching URL:', error);
      toast.error('Error processing URL');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    setFileName(file.name);
    await readPdfFile(file);
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Upload Document or Enter URL</h2>
      
      {/* PDF Upload Section */}
      <div className="flex items-center justify-center w-full mb-4">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {loading ? (
              <div className="text-gray-500">Processing...</div>
            ) : (
              <>
                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload PDF</span> or drag and drop
                </p>
                {fileName && (
                  <p className="text-sm text-gray-500">{fileName}</p>
                )}
              </>
            )}
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept=".pdf"
            onChange={handleFileChange}
            disabled={loading}
          />
        </label>
      </div>

      {/* OR Divider */}
      <div className="relative flex py-5 items-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-gray-600">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      {/* URL Input Section */}
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL to fetch content"
          className="flex-1 p-3 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchUrlContent}
          disabled={loading}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium py-3 px-5 rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105 disabled:opacity-50"
        >
          Fetch
        </button>
      </div>

      {/* Content Preview */}
      {contentPreview && (
        <div className="mt-4">
          <h3 className="text-md font-semibold text-gray-700 mb-2">Content Preview:</h3>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-600">
            {contentPreview}
          </div>
        </div>
      )}
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
  const [pdfContent, setPdfContent] = useState<string>("");

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks((prev) => [...prev, newTask.trim()]);
      setNewTask("");
    }
  };

  const handleTryCall = async () => {
    if (!service || !place) {
      toast.error("Please select both a service and a place");
      return;
    }

    const currentTime = new Date().toISOString();
    
    // Find the selected option
    const selectedOption = serviceOptions[service].find(option => option.name === place);
    
    // Get the system prompt from the prompts object
    let systemPrompt = "";
    if (selectedOption?.promptKey && service.toLowerCase() in prompts) {
      const servicePrompts = prompts[service.toLowerCase() as keyof typeof prompts];
      if (selectedOption.promptKey in servicePrompts) {
        // Call the function with the voice ID to get the voice-specific prompt
        const promptFunction = servicePrompts[selectedOption.promptKey as keyof typeof servicePrompts];
        if (typeof promptFunction === 'function') {
          systemPrompt = promptFunction(voice);
        }
      }
    }

    // Log the data being sent for debugging
    console.log("Sending data:", {
      service,
      voice,
      place,
      time: currentTime,
      tasks,
      systemPrompt,
      pdfContent
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
            systemPrompt,
            pdfContent
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-50 to-blue-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Emvo DemoBox!</h1>
        <ServiceSelection service={service} setService={setService} setPlace={setPlace} />
        <PlaceSelection service={service} place={place} setPlace={setPlace} />
        <VoiceSelection voice={voice} setVoice={setVoice} />
        <TaskInput tasks={tasks} newTask={newTask} setNewTask={setNewTask} handleAddTask={handleAddTask} />
        <FileUpload onFileContent={setPdfContent} />
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
