"use client";
import React, { useState } from "react";
import { IoSpeedometerOutline, IoLogOutOutline } from "react-icons/io5";
import { BiGitBranch } from "react-icons/bi";
import { TbVectorBezier } from "react-icons/tb";

const DemoPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-16 bg-indigo-950 flex flex-col items-center py-6 space-y-6">
        {/* Sidebar Items */}
        {[{ icon: IoSpeedometerOutline, index: 0 }, { icon: BiGitBranch, index: 1 }].map(
          ({ icon: Icon, index }) => (
            <div
              key={index}
              className={`w-12 h-12 flex items-center justify-center rounded-lg cursor-pointer transition ${
                activeIndex === index ? "bg-purple-500" : "bg-transparent"
              }`}
              onClick={() => setActiveIndex(index)}
            >
              <Icon className="text-white text-2xl" />
            </div>
          )
        )}
        {/* Bottom Icons */}
        <div className="mt-auto">
          <TbVectorBezier className="text-white text-2xl mb-6" />
          <IoLogOutOutline className="text-white text-2xl cursor-pointer" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#12072F] p-6 text-white">
        <div className="max-w-5xl mx-auto bg-indigo-950 rounded-2xl shadow-lg p-6 space-y-8">
          {/* Header */}
          <h2 className="text-lg font-semibold text-white">👋 Welcome to the Emvo Playground!</h2>
          <p className="text-gray-300">Lets set up your AI workforce in just a few clicks.</p>

          {/* Step 1: Select Industry */}
          <h3 className="text-purple-400 font-semibold">STEP 1: Select your industry</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {["Insurance", "Healthcare", "Aviation", "E-commerce", "Custom"].map((industry, i) => (
              <div
                key={i}
                className="bg-[radial-gradient(circle,#44217B_0%,#030115_100%)] p-4 rounded-xl border border-neutral-600 flex flex-col items-center cursor-pointer hover:shadow-md"
              >
                <img src="https://placehold.co/32x32" alt={industry} className="w-8 h-8 mb-2" />
                <span className="text-white text-sm font-medium">{industry}</span>
              </div>
            ))}
          </div>

          {/* Step 2: Customize AI Agent */}
          <h3 className="text-purple-400 font-semibold">STEP 2: Customize your AI agent</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Hospital receptionist", desc: "Includes booking, cancellation & rescheduling" },
              { title: "Diagnostic report advisor", desc: "Simplifies blood work & health reports & provides preventive tips" }
            ].map(({ title, desc }, i) => (
              <div
                key={i}
                className="bg-[radial-gradient(circle,#44217B_0%,#030115_100%)] p-4 rounded-xl border border-neutral-600 flex items-start cursor-pointer hover:shadow-md space-x-3"
              >
                <input type="radio" name="agent" className="mt-1" />
                <div>
                  <h4 className="text-white font-medium">{title}</h4>
                  <p className="text-gray-400 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Step 3: Pick Voice */}
          <h3 className="text-purple-400 font-semibold">STEP 3: Pick your voice</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Raman", "Krishna", "Riya", "Anjali"].map((voice, i) => (
              <div
                key={i}
                className="bg-[radial-gradient(circle,#44217B_0%,#030115_100%)] p-4 rounded-xl border border-neutral-600 flex flex-col items-center cursor-pointer hover:shadow-md"
              >
                <img src="https://placehold.co/32x32" alt={voice} className="w-8 h-8 mb-2 rounded-full" />
                <span className="text-white text-sm font-medium">{voice}</span>
              </div>
            ))}
          </div>

          {/* Try Now Button */}
          <button className="px-4 py-2 border border-purple-400 rounded-full flex items-center space-x-2 cursor-pointer hover:bg-purple-700 transition">
            Try Emvo Now →
          </button>
        </div>
      </main>
    </div>
  );
};

export default DemoPage;