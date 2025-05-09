"use client";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoSpeedometerOutline, IoLogOutOutline } from "react-icons/io5";
import { TbVectorBezier } from "react-icons/tb";

interface LayoutProps {
  children: React.ReactNode;
  onNavigate?: (step: "home" | "playground") => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onNavigate }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleIconClick = (index: number) => {
    setActiveIndex(index);
    if (onNavigate) {
      onNavigate(index === 0 ? "home" : "playground");
    }
  };

  return (
    // <div className="flex flex-col w-full min-h-screen bg-[#0A021D] text-white"></div>
    <div className="flex flex-col md:flex-row w-full min-h-screen  bg-[#0A021D] text-white">
      {/* Sidebar */}
      <aside className="w-full md:w-16 bg-[#1C0F36] flex flex-row md:flex-col items-center p-4 md:py-6">
        {/* Navigation Icons */}
        <div className="flex-1 flex md:block items-center md:space-y-4">
          <div
            className={`w-12 h-12 flex items-center justify-center rounded-lg cursor-pointer transition ${
              activeIndex === 0 ? "bg-purple-500" : "bg-transparent"
            }`}
            onClick={() => handleIconClick(0)}
          >
            <IoSpeedometerOutline className="text-white text-2xl" />
          </div>
          <div
            className={`w-12 h-12 flex items-center justify-center rounded-lg cursor-pointer transition ${
              activeIndex === 1 ? "bg-purple-500" : "bg-transparent"
            }`}
            onClick={() => handleIconClick(1)}
          >
            <TbVectorBezier className="text-white text-2xl" />
          </div>
        </div>
        {/* Logout Icon */}
        <div className="w-12 h-12 flex items-center justify-center cursor-pointer mb-2">
          <IoLogOutOutline className="text-white text-xl" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:w-[calc(100%-4rem)] p-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between md:items-center items-start mb-6 gap-4 md:gap-0">
            <div className="flex flex-col text-left md:text-left">
              <h1 className="text-lg sm:text-xl font-bold text-indigo-400">
                👋 Welcome to the Emvo Playground!
              </h1>
              <div className="text-white text-sm font-normal leading-snug">
                Experience our agent workforce that changes the game.
              </div>
            </div>
            
            <div className="relative w-full hidden md:block sm:w-72">
              <input
                type="text"
                placeholder="What are you looking for?"
                className="w-full px-4 py-2 bg-[#150C29] rounded-full text-sm outline-none"
              />
              <FaSearch className="absolute right-3 top-2.5 text-gray-400" />
            </div>
         </header>


        {/* Page Content */}
        {children}
      </main>
    </div>
  );
};

export default Layout; 