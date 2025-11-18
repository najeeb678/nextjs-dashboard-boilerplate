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
  deckUsed: "Rider-Waite",
  totalCost: 2.5,
  question: "What does my career path look like?",
  cards: [
    {
      name: "The Fool",
      orientation: "upright",
      meaning: "New beginnings, innocence, spontaneity",
      image: "/assets/cards/fool.jpg",
    },
    {
      name: "The Magician",
      orientation: "reversed",
      meaning: "Manipulation, poor planning, untapped talents",
      image: "/assets/cards/magician.jpg",
    },
    {
      name: "The High Priestess",
      orientation: "upright",
      meaning: "Intuition, spiritual insight, divine feminine",
      image: "/assets/cards/high-priestess.jpg",
    },
  ],
  conversation: [
    {
      type: "user",
      message: "What does my career path look like?",
      timestamp: "2024-11-18T10:30:00Z",
    },
    {
      type: "ai",
      message:
        "The cards drawn are The Fool (upright), The Magician (reversed), and The High Priestess (upright). This suggests a journey of new beginnings in your career, but with some challenges in execution. The High Priestess indicates you should trust your intuition.",
      timestamp: "2024-11-18T10:30:05Z",
      prompt:
        "Analyze the following tarot cards for career guidance: The Fool (upright), The Magician (reversed), The High Priestess (upright)",
      response:
        "Based on the cards, your career path involves embracing new opportunities (The Fool) while being cautious of overconfidence (The Magician reversed). Listen to your inner wisdom (The High Priestess).",
    },
    {
      type: "user",
      message: "Can you clarify what the Magician reversed means for my job search?",
      timestamp: "2024-11-18T10:31:00Z",
    },
    {
      type: "ai",
      message:
        "The Magician reversed suggests that while you have the skills and tools needed, there might be some hesitation or lack of confidence in presenting yourself. Focus on building self-assurance and clearly communicating your abilities to potential employers.",
      timestamp: "2024-11-18T10:31:05Z",
      prompt: "Clarify the meaning of The Magician reversed in the context of job searching",
      response:
        "The reversed Magician indicates potential issues with self-presentation, communication of skills, or confidence in using available resources for career advancement.",
    },
  ],
  costBreakdown: {
    initialReading: 1.5,
    followUp1: 0.5,
    followUp2: 0.5,
    totalTokens: 1250,
    apiCost: 2.5,
  },
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
            <label className="block text-sm font-medium text-[#2a2a2a]">Deck Used</label>
            <p className="text-[#787878]">{session.deckUsed}</p>
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

      {/* Cards Drawn */}
      <div className="bg-[#f0eaff] border border-[#d4ccff] rounded-lg p-6">
        <h2 className="text-xl font-semibold text-[#2a2a2a] mb-4">Cards Drawn</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {session.cards.map((card, index) => (
            <div key={index} className="bg-[#e6e0ff] border border-[#d4ccff] rounded-lg p-4">
              <div className="text-center">
                <div className="w-24 h-36 bg-[#faf9ff] rounded mx-auto mb-3 flex items-center justify-center border border-[#d4ccff]">
                  <span className="text-[#2a2a2a] font-semibold">Card</span>
                </div>
                <h3 className="text-[#2a2a2a] font-semibold">{card.name}</h3>
                <p className="text-[#787878] text-sm capitalize">{card.orientation}</p>
                <p className="text-[#2a2a2a] text-sm mt-2">{card.meaning}</p>
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
                  {message.type === "user" ? "User" : "AI Tarot Reader"}
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

      {/* Cost Breakdown */}
      <div className="bg-[#f0eaff] border border-[#d4ccff] rounded-lg p-6">
        <h2 className="text-xl font-semibold text-[#2a2a2a] mb-4">Cost Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-[#2a2a2a] font-semibold mb-2">Charges</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Initial Reading:</span>
                <span>${session.costBreakdown.initialReading.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Follow-up 1:</span>
                <span>${session.costBreakdown.followUp1.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Follow-up 2:</span>
                <span>${session.costBreakdown.followUp2.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold border-t border-[#d4ccff] pt-1">
                <span>Total:</span>
                <span>
                  $
                  {session.costBreakdown.totalTokens ? session.costBreakdown.apiCost.toFixed(2) : "0.00"}
                </span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-[#2a2a2a] font-semibold mb-2">API Usage</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Tokens Used:</span>
                <span>{session.costBreakdown.totalTokens}</span>
              </div>
              <div className="flex justify-between">
                <span>API Cost:</span>
                <span>${session.costBreakdown.apiCost.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
