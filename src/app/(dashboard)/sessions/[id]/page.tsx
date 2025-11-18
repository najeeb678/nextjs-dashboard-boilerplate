"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Mock data for session detail
const mockSessionDetail = {
  id: "sess_001",
  userId: "user_123",
  timestamp: "2024-11-18T10:30:00Z",
  category: "General Inquiry",
  totalCost: 2.5,
  question: "How do I reset my account password?",
  details: [
    {
      label: "Priority",
      value: "Medium",
    },
    {
      label: "Status",
      value: "Resolved",
    },
    {
      label: "Agent",
      value: "Support Bot",
    },
  ],
  conversation: [
    {
      type: "user",
      message: "How do I reset my account password?",
      timestamp: "2024-11-18T10:30:00Z",
    },
    {
      type: "ai",
      message:
        "I'd be happy to help you reset your password. You can do this by clicking on the 'Forgot Password' link on the login page, or by going to your account settings. Would you like me to guide you through the specific steps?",
      timestamp: "2024-11-18T10:30:05Z",
      prompt: "User is asking about password reset process",
      response:
        "To reset your password: 1) Go to the login page, 2) Click 'Forgot Password', 3) Enter your email address, 4) Check your email for reset instructions, 5) Follow the link to create a new password.",
    },
    {
      type: "user",
      message: "I didn't receive the email. Can you help?",
      timestamp: "2024-11-18T10:31:00Z",
    },
    {
      type: "ai",
      message:
        "No problem! Sometimes emails can take a few minutes to arrive, or they might end up in your spam folder. Let me check if there's an issue with your email address on file. Could you confirm the email address associated with your account?",
      timestamp: "2024-11-18T10:31:05Z",
    },
  ],
};

export default function SessionDetailPage() {
  const params = useParams();
  const sessionId = params.id as string;

  // In a real app, fetch session data based on sessionId
  const session = mockSessionDetail;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/sessions">
          <Button
            variant="outline"
            size="sm"
            className="border-[#d4ccff] text-[#2a2a2a] hover:bg-[#d4ccff] hover:text-[#2a2a2a]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sessions
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-[#2a2a2a]">Session {sessionId}</h1>
      </div>

      {/* Session Overview */}
      <div className="bg-[#f0eaff] border border-[#d4ccff] rounded-lg p-6">
        <h2 className="text-xl font-semibold text-[#2a2a2a] mb-4">Session Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#2a2a2a]">User ID</label>
            <p className="text-[#2a2a2a] font-semibold">{session.userId}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2a2a2a]">Timestamp</label>
            <p className="text-[#787878]">{new Date(session.timestamp).toLocaleString()}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2a2a2a]">Category</label>
            <p className="text-[#787878]">{session.category}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2a2a2a]">Total Cost</label>
            <p className="text-[#2a2a2a] font-semibold">${session.totalCost.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Original Question */}
      <div className="bg-[#f0eaff] border border-[#d4ccff] rounded-lg p-6">
        <h2 className="text-xl font-semibold text-[#2a2a2a] mb-4">Original Question</h2>
        <p className="text-[#2a2a2a] text-lg italic">&ldquo;{session.question}&rdquo;</p>
      </div>

      {/* Session Details */}
      <div className="bg-[#f0eaff] border border-[#d4ccff] rounded-lg p-6">
        <h2 className="text-xl font-semibold text-[#2a2a2a] mb-4">Session Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {session.details.map((detail, index) => (
            <div key={index} className="bg-[#e6e0ff] border border-[#d4ccff] rounded-lg p-4">
              <div className="text-center">
                <h3 className="text-[#2a2a2a] font-semibold">{detail.label}</h3>
                <p className="text-[#787878] text-sm mt-1">{detail.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conversation Thread */}
      <div className="bg-[#f0eaff] border border-[#d4ccff] rounded-lg p-6">
        <h2 className="text-xl font-semibold text-[#2a2a2a] mb-4">Conversation Thread</h2>
        <div className="space-y-4">
          {session.conversation.map((message, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                message.type === "user"
                  ? "bg-[#e6e0ff] text-[#2a2a2a] ml-8"
                  : "bg-[#faf9ff] text-[#2a2a2a] mr-8 border border-[#d4ccff]"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold">
                  {message.type === "user" ? "User" : "AI Assistant"}
                </span>
                <span className="text-sm text-[#787878]">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="mb-2">{message.message}</p>
              {message.type === "ai" && (
                <div className="mt-3 pt-3 border-t border-[#d4ccff] text-sm">
                  <div className="mb-2">
                    <strong className="text-[#2a2a2a]">Prompt:</strong>
                    <p className="text-[#787878] mt-1">{message.prompt}</p>
                  </div>
                  <div>
                    <strong className="text-[#2a2a2a]">Raw Response:</strong>
                    <p className="text-[#787878] mt-1">{message.response}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Session Summary */}
      <div className="bg-[#f0eaff] border border-[#d4ccff] rounded-lg p-6">
        <h2 className="text-xl font-semibold text-[#2a2a2a] mb-4">Session Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-[#2a2a2a] font-semibold mb-2">Session Info</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Duration:</span>
                <span>15 minutes</span>
              </div>
              <div className="flex justify-between">
                <span>Messages:</span>
                <span>{session.conversation.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Resolution:</span>
                <span>Completed</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-[#2a2a2a] font-semibold mb-2">Cost</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Service Cost:</span>
                <span>${session.totalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span>Paid</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
