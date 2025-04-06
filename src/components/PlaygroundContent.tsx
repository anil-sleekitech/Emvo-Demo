import React, { useState } from "react";
import { Industry } from "../types";
import Image from 'next/image';
import { StaticImageData } from 'next/image';

// Import agent icons
import heartIcon from '../assets/heart.png';
import lifeInsuIcon from '../assets/lifeinsu.png';
import hospitalIcon from '../assets/hospital.png';
import headphoneIcon from '../assets/headp.png';
import customAgentIcon from '../assets/customagentb.png';
import airlineSupportIcon from '../assets/airlineSupport.png';
import d2cIcon from '../assets/d2c.png';
import lifestyleExecutiveIcon from '../assets/lifestylexecutive.png';

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
  customPrompt?: string;
  setCustomPrompt?: (prompt: string) => void;
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
      return headphoneIcon;
    case "customer relations executive":
      return airlineSupportIcon;
    case "customer support executive":
      return headphoneIcon;
    case "d2c support agent":
      return d2cIcon;
    case "lifestyle solution executive":
      return lifestyleExecutiveIcon;
    default:
      return customAgentIcon;
  }
};

type PromptFunction = (voiceId: string, agentTitle?: string, customPrompt?: string) => string;

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
  customPrompt,
  setCustomPrompt,
}) => {
  const [isCustomPromptFocused, setIsCustomPromptFocused] = useState(false);

  return (
    <div className="space-y-6 md:space-y-8 px-4 md:px-6 lg:px-8">
      {/* Industry Selection */}
      <div>
        <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">STEP 1: Select your industry</h2>
        <div className="flex overflow-x-auto snap-x pb-4 pt-4 space-x-3 md:space-x-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {Object.entries(industries).map(([industry, data]) => (
            <button
              key={industry}
              onClick={() => setSelectedIndustry(industry as Industry)}
              className={`flex-shrink-0 p-3 md:p-4 rounded-lg border transition-all duration-300 min-w-[140px] md:min-w-[160px] hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 ${
                selectedIndustry === industry
                  ? "border-purple-500 bg-purple-500/20"
                  : "border-gray-600 hover:border-purple-500/50"
              }`}
            >
              <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2">
                <Image
                  src={data.icon}
                  alt={`${industry} icon`}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <p className="mt-2 text-center text-sm md:text-base">{industry}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Agent Selection */}
      {selectedIndustry && (
        <div>
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">STEP 2: Customize your AI agent</h2>
          {selectedIndustry === "Custom" ? (
            <div className="space-y-3 md:space-y-4">
              <div className="relative">
                <textarea
                  value={customPrompt || ""}
                  onChange={(e) => setCustomPrompt?.(e.target.value)}
                  onFocus={() => setIsCustomPromptFocused(true)}
                  onBlur={() => setIsCustomPromptFocused(false)}
                  placeholder="Enter your custom prompt here..."
                  className={`w-full p-3 md:p-4 rounded-lg border transition-all duration-300 min-h-[120px] md:min-h-[150px] resize-none bg-gradient-to-br from-[#44217B] to-[#030115] text-white placeholder-gray-400 text-sm md:text-base ${
                    isCustomPromptFocused
                      ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20"
                      : "border-gray-600 hover:border-purple-500/50"
                  }`}
                />
              </div>
              <div className="p-3 md:p-4 rounded-lg border border-gray-600 bg-gradient-to-br from-[#44217B]/50 to-[#030115]/50">
                <p className="text-sm md:text-base text-gray-300">
                  Customize your AI agent by providing specific instructions about its behavior, tone, and expertise.
                </p>
                <ul className="mt-2 text-sm md:text-base text-gray-400 space-y-1">
                  <li>• Define the agent&apos;s personality and communication style</li>
                  <li>• Specify the domain knowledge and expertise</li>
                  <li>• Set tone, formality, and language preferences</li>
                  <li>• Include any specific guidelines or constraints</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
              {industries[selectedIndustry].agents.map((agent) => (
                <button
                  key={agent.title}
                  onClick={() => setSelectedAgent(agent.title)}
                  className={`p-3 md:p-4 rounded-lg border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20 ${
                    selectedAgent === agent.title
                      ? "border-purple-500 bg-purple-500/20"
                      : "border-gray-600 hover:border-purple-500/50"
                  }`}
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 relative flex-shrink-0">
                      <Image
                        src={getAgentIcon(agent.title)}
                        alt={`${agent.title} icon`}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-sm md:text-base">{agent.title}</h3>
                      <p className="text-xs md:text-sm text-gray-300">{agent.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Voice Selection */}
      {selectedAgent && (
        <div>
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">STEP 3: Pick your voice</h2>
          <div className="relative">
            {/* Left Arrow */}
            <button 
              onClick={() => {
                const container = document.getElementById('voice-scroll-container');
                if (container) {
                  container.scrollBy({ left: -300, behavior: 'smooth' });
                }
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-1.5 md:p-2 rounded-full transition-all duration-300 hover:scale-110"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Scrollable Container */}
            <div 
              id="voice-scroll-container"
              className="flex overflow-x-auto snap-x space-x-3 md:space-x-4 scrollbar-hide scroll-smooth px-10 md:px-12"
            >
              {voices.map((voice) => (
                <button
                  key={voice.id}
                  onClick={() => setSelectedVoice(voice.id)}
                  className={`flex-shrink-0 p-3 md:p-4 rounded-lg border transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 min-w-[100px] md:min-w-[120px] ${
                    selectedVoice === voice.id
                      ? "border-purple-500 bg-purple-500/20"
                      : "border-gray-600 hover:border-purple-500/50"
                  }`}
                >
                  <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-2">
                    <Image
                      src={voice.avatar}
                      alt={`${voice.name} avatar`}
                      width={64}
                      height={64}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <p className="mt-2 text-center text-sm md:text-base">{voice.name}</p>
                </button>
              ))}
            </div>

            {/* Right Arrow */}
            <button 
              onClick={() => {
                const container = document.getElementById('voice-scroll-container');
                if (container) {
                  container.scrollBy({ left: 300, behavior: 'smooth' });
                }
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-1.5 md:p-2 rounded-full transition-all duration-300 hover:scale-110"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <button
        onClick={onTryEmvo}
        disabled={!selectedIndustry || (!selectedAgent && selectedIndustry !== "Custom") || !selectedVoice}
        className="w-full md:w-auto mt-6 md:mt-8 px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full font-semibold text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
      >
        Try Emvo Now
      </button>
    </div>
  );
};

export default PlaygroundContent; 