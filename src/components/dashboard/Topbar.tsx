"use client";
import Image from "next/image";
import React from "react";

interface TopbarProps {
  onMenuClick: () => void;
  isSidebarOpen?: boolean;
}

export default function Topbar({ onMenuClick, isSidebarOpen = false }: TopbarProps) {
  return (
    <header className="fixed top-0 left-0 w-full lg:left-64 lg:w-[calc(100%-16rem)] z-30 bg-white border-b border-gray-200">
      <div className="h-20 flex items-center justify-between px-4 lg:px-10">
        <div className="flex items-center gap-4">
          {/* Hamburger menu button */}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md hover:bg-gray-50 transition-colors text-gray-700 lg:hidden"
          >
            {isSidebarOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* User avatar */}
          <div className="relative group">
            <button className="flex items-center space-x-2">
              <Image
                width={32}
                height={32}
                src="/assets/images/user.png"
                alt="User avatar"
                className="h-8 w-8 rounded-full"
              />
              <span className="hidden sm:block text-sm font-medium" style={{ color: "#333333" }}>
                Admin User
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
