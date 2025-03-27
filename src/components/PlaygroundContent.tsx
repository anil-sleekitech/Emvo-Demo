import React from "react";
import { Industry } from "../types";
import Image from 'next/image';
import { StaticImageData } from 'next/image';

// Import agent icons
import heartIcon from '../assets/heart.png';
import lifeInsuIcon from '../assets/lifeinsu.png';
import hospitalIcon from '../assets/hospital.png';
import headphoneIcon from '../assets/headp.png';
import customAgentIcon from '../assets/customagentb.png';

interface PlaygroundContentProps {
  selectedIndustry: Industry | null;
  setSelectedIndustry: (industry: Industry) => void;
  selectedAgent: string | null;
  setSelectedAgent: (agent: string) => void;
  selectedVoice: string | null;
  setSelectedVoice: (voice: string) => void;
  onTryEmvo: () => void;
  industries: Record<Industry, { 
    icon: StaticImageData; 
    agents: Array<{ 
      title: string;
      description: string;
      icon: StaticImageData;
    }> 
  }>;
  voices: Array<{ 
    id: string; 
    name: string; 
    avatar: StaticImageData;
  }>;
}

// Update the industries object to include agent icons
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

const PlaygroundContent: React.FC<PlaygroundContentProps> = ({
  selectedIndustry,
  setSelectedIndustry,
  selectedAgent,
  setSelectedAgent,
  selectedVoice,
  setSelectedVoice,
  onTryEmvo,
  industries,
  voices,
}) => {
  return (
    <div className="space-y-8">
      {/* Industry Selection */}
      <div>
        <h2 className="text-xl font-semibold mb-4">STEP 1: Select your industry</h2>
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(industries).map(([industry, data]) => (
            <button
              key={industry}
              onClick={() => setSelectedIndustry(industry as Industry)}
              className={`p-4 rounded-lg border transition ${
                selectedIndustry === industry
                  ? "border-purple-500 bg-purple-500/20"
                  : "border-gray-600"
              }`}
            >
              <div className="w-12 h-12 mx-auto mb-2">
                <Image
                  src={data.icon}
                  alt={`${industry} icon`}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <p className="mt-2">{industry}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Agent Selection */}
      {selectedIndustry && (
        <div>
          <h2 className="text-xl font-semibold mb-4">STEP 2: Customize your AI agent</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {industries[selectedIndustry].agents.map((agent) => (
              <button
                key={agent.title}
                onClick={() => setSelectedAgent(agent.title)}
                className={`p-4 rounded-lg border transition ${
                  selectedAgent === agent.title
                    ? "border-purple-500 bg-purple-500/20"
                    : "border-gray-600"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 relative flex-shrink-0">
                    <Image
                      src={getAgentIcon(agent.title)}
                      alt={`${agent.title} icon`}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold">{agent.title}</h3>
                    <p className="text-sm text-gray-300">{agent.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Voice Selection */}
      {selectedAgent && (
        <div>
          <h2 className="text-xl font-semibold mb-4">STEP 3: Pick your voice</h2>
          <div className="grid grid-cols-4 gap-4">
            {voices.map((voice) => (
              <button
                key={voice.id}
                onClick={() => setSelectedVoice(voice.id)}
                className={`p-4 rounded-lg border transition ${
                  selectedVoice === voice.id
                    ? "border-purple-500 bg-purple-500/20"
                    : "border-gray-600"
                }`}
              >
                <div className="w-16 h-16 mx-auto mb-2">
                  <Image
                    src={voice.avatar}
                    alt={`${voice.name} avatar`}
                    width={64}
                    height={64}
                    className="rounded-full object-cover"
                  />
                </div>
                <p className="mt-2">{voice.name}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onTryEmvo}
        disabled={!selectedIndustry || !selectedAgent || !selectedVoice}
        className="mt-8 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Try Emvo Now
      </button>
    </div>
  );
};

export default PlaygroundContent; 