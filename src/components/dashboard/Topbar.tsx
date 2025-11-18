"use client";
import Image from "next/image";
import React from "react";

interface TopbarProps {
  onMenuClick: () => void;
  isSidebarOpen?: boolean;
}

export default function Topbar({ onMenuClick, isSidebarOpen = false }: TopbarProps) {
  return (
    <header
      className="fixed top-0 w-full z-50 border-b border-[#d4ccff]"
      style={{
        background: "linear-gradient(to right, #faf9ff 0%, #f0eaff 60%, #e6e0ff 100%)",
      }}
    >
      <div className="h-20 flex items-center justify-between px-4 lg:px-10">
        <div className="flex items-center gap-4">
          {/* Hamburger menu button */}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md hover:bg-[#d4ccff33] transition-colors lg:hidden"
            style={{ color: "#2a2a2a" }}
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
          <h1 className="logo-text" style={{ color: "#2a2a2a" }}>
            AI Tarot Admin
          </h1>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button className="p-2 rounded-full hover:bg-[#d4ccff33] transition-colors">
            <svg
              className="h-5 w-5 sm:h-6 sm:w-6"
              style={{ color: "#787878" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>
          <div className="relative group">
            <button className="flex items-center space-x-2">
              <Image
                width={32}
                height={32}
                src="/assets/images/user.png"
                alt="User avatar"
                className="h-8 w-8 rounded-full"
              />
              <span className="hidden sm:block text-sm font-medium" style={{ color: "#2a2a2a" }}>
                Admin User
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
