"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z",
  },
  {
    name: "Sessions",
    href: "/sessions",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
  {
    name: "Users",
    href: "/users",
    icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z",
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const handleLinkClick = () => {
    // Close sidebar on mobile when clicking a link
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 w-64 border-r border-gray-200 h-screen transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0`}
        style={{
          background: "#ffffff",
        }}
      >
        <div className="relative flex flex-col h-full">
          {/* Logo */}
          <div className="h-32 flex items-center justify-center px-4 py-4">
            <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-md hover:bg-gray-100 transition-colors lg:hidden"
            style={{ color: "#333333" }}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <div className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={handleLinkClick}
                    className={`sidebar-item group flex items-center px-4 py-3 rounded-lg transition-all h-[48px]
                                    ${
                                      isActive
                                        ? "bg-gray-100"
                                        : "bg-transparent hover:bg-gray-100 hover:text-[#e74c3c]"
                                    }`}
                    style={{
                      color: "#333333",
                    }}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <svg
                      className="mr-3 h-5 w-5 transition-colors"
                      style={{ color: isActive ? "#e74c3c" : "#333333" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Bottom Section */}
          {/* <div className="border-t border-[#E3C5FF55] p-4">
          <Link
            href="/settings"
            onClick={handleLinkClick}
            className={`sidebar-item group flex items-center px-4 py-3 rounded-lg transition-all hover:bg-[#E3C5FF55]
                        ${
                          pathname === "/settings" ? "bg-gradient-to-r from-[#F1E6FF] to-[#E3C5FF]" : ""
                        }`}
            style={{
              color: pathname === "/settings" ? "#751AE5" : "#2A2A2A",
            }}
            aria-current={pathname === "/settings" ? "page" : undefined}
          >
            <svg
              className="mr-3 h-5 w-5 transition-colors"
              style={{ color: pathname === "/settings" ? "#751AE5" : "#666666" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Settings
          </Link>
        </div> */}
        </div>
      </div>
    </>
  );
}
