"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DataTable } from "@/components/common/DataTable";
import { Input } from "@/components/ui/input";

// Mock data for sessions
const mockSessions = [
  {
    id: "sess_001",
    userId: "user_123",
    timestamp: "2024-11-18T10:30:00Z",
    deckUsed: "Rider-Waite",
    totalCost: 2.5,
    question: "What does my career path look like?",
    status: "completed",
  },
  {
    id: "sess_002",
    userId: "user_456",
    timestamp: "2024-11-18T09:15:00Z",
    deckUsed: "Thoth",
    totalCost: 1.75,
    question: "Should I move to a new city?",
    status: "completed",
  },
  // Add more mock data as needed
];

const columns = [
  {
    accessorKey: "id",
    header: "Session ID",
    cell: ({ row }: { row: { original: (typeof mockSessions)[0] } }) => (
      <Link
        href={`/sessions/${row.original.id}`}
        className="text-[#2a2a2a] hover:text-[#787878] hover:underline"
      >
        {row.original.id}
      </Link>
    ),
  },
  {
    accessorKey: "userId",
    header: "User ID",
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }: { row: { original: (typeof mockSessions)[0] } }) =>
      new Date(row.original.timestamp).toLocaleString(),
  },
  {
    accessorKey: "deckUsed",
    header: "Deck Used",
  },
  {
    accessorKey: "totalCost",
    header: "Total Cost ($)",
    cell: ({ row }: { row: { original: (typeof mockSessions)[0] } }) =>
      `$${row.original.totalCost.toFixed(2)}`,
  },
  {
    accessorKey: "question",
    header: "Question",
    cell: ({ row }: { row: { original: (typeof mockSessions)[0] } }) => (
      <div className="max-w-xs truncate" title={row.original.question}>
        {row.original.question}
      </div>
    ),
  },
];

export default function SessionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");

  const filteredSessions = mockSessions.filter((session) => {
    const matchesSearch =
      session.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.question.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !dateFilter || session.timestamp.startsWith(dateFilter);
    const matchesUser = !userFilter || session.userId === userFilter;

    return matchesSearch && matchesDate && matchesUser;
  });

  const handleExport = () => {
    const csvContent = [
      ["Session ID", "User ID", "Timestamp", "Deck Used", "Total Cost", "Question"],
      ...filteredSessions.map((session) => [
        session.id,
        session.userId,
        session.timestamp,
        session.deckUsed,
        session.totalCost.toString(),
        session.question,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sessions.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#2a2a2a]">Sessions</h1>
      </div>

      <div className="bg-[#f0eaff] border border-[#d4ccff] rounded-lg p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-[#2a2a2a]">Session Filters</h2>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#2a2a2a] mb-1">Search</label>
              <Input
                placeholder="Search by ID, user, or question..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#faf9ff] text-[#2a2a2a] border-[#d4ccff]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2a2a2a] mb-1">Date Range</label>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-[#faf9ff] text-[#2a2a2a] border-[#d4ccff]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2a2a2a] mb-1">User ID</label>
              <Input
                placeholder="Filter by user ID"
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                className="bg-[#faf9ff] text-[#2a2a2a] border-[#d4ccff]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#f0eaff] border border-[#d4ccff] rounded-lg p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-[#2a2a2a]">All Sessions</h2>
        </div>
        <div>
          <DataTable columns={columns} data={filteredSessions} searchKey="id" />
        </div>
      </div>
    </div>
  );
}
