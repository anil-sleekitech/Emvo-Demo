import React from "react";
import { IoIosArrowForward } from "react-icons/io";
import Image from "next/image";
import emvoImage from "../assets/em.gif";

interface HomeContentProps {
  onTryEmvo: () => void;
}

const features = [
  {
    title: "Multi agentic system",
    description: "Multiple agents work together to streamline workflows & boost efficiency.",
    tag: "Smarter AI Collaboration",
  },
  {
    title: "Precision & accuracy",
    description: "Industry-leading AI delivers reliable and high-quality outputs.",
    tag: "High Resolution Rate",
  },
  {
    title: "Real Time Performance",
    description: "Lightning-fast processing ensures seamless user interactions.",
    tag: "Ultra Low Latency",
  },
  {
    title: "Smarter Operations",
    description: "Multiple agents work together to streamline workflows & boost efficiency.",
    tag: "Smarter AI Collaboration",
  },
  {
    title: "Multilingual support",
    description: "AI-powered translation enables effortless & nuanced communication.",
    tag: "Global reach local feel",
  },
  {
    title: "Custom AI Personalization",
    description: "Tailor AI agents to match your brand, workflows, and user needs.",
    tag: "Custom AI Personalization",
  }
];

const HomeContent: React.FC<HomeContentProps> = ({ onTryEmvo }) => {
  return (
    <>
      <section className="mt-4 p-4 bg-[#150C29] rounded-xl text-center relative flex flex-col items-center transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
        <h2 className="text-2xl font-semibold text-purple-300">Why Emvo?</h2>
        <div className="relative mt-2">
          <Image
            src={emvoImage}
            alt="Emvo Icon"
            width={300}
            height={300}
            className="opacity-80 mx-auto transition-all duration-300 hover:opacity-100"
          />
        </div>
        <button
          onClick={onTryEmvo}
          className="absolute right-6 top-6 px-4 py-2 border border-purple-400 rounded-full flex items-center space-x-2 cursor-pointer hover:bg-purple-700 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
        >
          <span>Try Emvo Now</span>
          <IoIosArrowForward />
        </button>
      </section>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-4 bg-gradient-to-br from-[#44217B] to-[#030115] rounded-xl border border-gray-600 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20 hover:border-purple-500/50"
          >
            <span className="bg-purple-700 text-xs px-3 py-1 rounded-full inline-block mb-2 transition-all duration-300 hover:bg-purple-600">
              {feature.tag}
            </span>
            <h3 className="text-lg font-semibold transition-colors duration-300 hover:text-purple-300">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-300 mt-1 transition-colors duration-300 hover:text-gray-200">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default HomeContent; 