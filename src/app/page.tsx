"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaMicrophone, FaUser, FaUserTie } from "react-icons/fa";



// Define services and their corresponding options
const serviceOptions: Record<string, { name: string; icon: React.ReactNode  }[]> = {
  Insurance: [
    { name: "ICICI Lombard", icon: <FaUserTie size={30} /> },
    { name: "Bajaj Allianz", icon: <FaUserTie size={30} /> },
  ],
  "Book Appointment": [
    { name: "Apollo", icon: <FaUser size={30} /> },
    { name: "Fortis", icon: <FaUser size={30} /> },
  ],
};

interface ServiceSelectionProps {
  service: string;
  setService: (service: string) => void;
  setPlace: (place: string) => void;
}


function ServiceSelection({ service, setService, setPlace }: ServiceSelectionProps) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Select Service</h2>
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
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Select Place</h2>
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
    { id: "91fa9bcf-93c8-467c-8b29-973720e3f167", label: "Mark", icon: <FaUser size={30} /> },
    { id: "e396a010-bede-4c56-972a-e8cb56aadda8", label: "Haytham", icon: <FaUserTie size={30} /> },
  ];
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Select Voice</h2>
      <div className="flex space-x-4">
        {voices.map((v) => (
          <div
            key={v.id}
            onClick={() => setVoice(v.id)}
            className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition transform hover:scale-105 ${
              voice === v.id ? "border-blue-500" : "border-gray-300"
            }`}
          >
            {v.icon}
            <span className="mt-2 text-gray-800">{v.label}</span>
          </div>
        ))}
      </div>
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
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Add Task</h2>
      <div className="flex items-center">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a task"
          className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddTask}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium py-2 px-4 rounded-r-lg shadow-md hover:shadow-lg transition transform hover:scale-105"
        >
          Add
        </button>
      </div>
      {tasks.length > 0 && (
        <ul className="mt-4 space-y-2">
          {tasks.map((task, index) => (
            <li key={index} className="bg-gray-100 p-2 rounded-lg text-gray-700">
              {task}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [service, setService] = useState("");
  const [voice, setVoice] = useState("");
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
    if (!service || !voice || !place) {
      toast.error("Please select all options before proceeding.");
      return;
    }

    const currentTime = new Date().toISOString();

    try {
      const response = await fetch(
        "https://bucbk5tdbzwzu5frgxybgnmprm0ibfcr.lambda-url.ap-south-1.on.aws/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ service, voice, place, time: currentTime, tasks }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send data to the server");
      }

      const data = await response.json();
      router.push(`/call?callId=${data.callId}`);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while trying to send data.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
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
