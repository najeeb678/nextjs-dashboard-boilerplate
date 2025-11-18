import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#2a2a2a]">AI Tarot Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#f0eaff] border border-[#d4ccff] rounded-lg p-6">
          <h2 className="text-xl font-semibold text-[#2a2a2a] mb-2">Total Sessions</h2>
          <p className="text-3xl font-bold text-[#2a2a2a]">1,234</p>
          <p className="text-[#787878] text-sm">+12% from last month</p>
        </div>

        <div className="bg-[#f0eaff] border border-[#d4ccff] rounded-lg p-6">
          <h2 className="text-xl font-semibold text-[#2a2a2a] mb-2">Total Revenue</h2>
          <p className="text-3xl font-bold text-[#2a2a2a]">$2,567</p>
          <p className="text-[#787878] text-sm">+8% from last month</p>
        </div>

        <div className="bg-[#f0eaff] border border-[#d4ccff] rounded-lg p-6">
          <h2 className="text-xl font-semibold text-[#2a2a2a] mb-2">Active Users</h2>
          <p className="text-3xl font-bold text-[#2a2a2a]">456</p>
          <p className="text-[#787878] text-sm">+5% from last month</p>
        </div>
      </div>

      <div className="bg-[#f0eaff] border border-[#d4ccff] rounded-lg p-6">
        <h2 className="text-xl font-semibold text-[#2a2a2a] mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <Link href="/sessions">
            <Button className="bg-[#ffd87d] text-[#2a2a2a] hover:bg-[#e6e0ff]">View All Sessions</Button>
          </Link>
          <Link href="/users">
            <Button
              variant="outline"
              className="border-[#d4ccff] text-[#2a2a2a] hover:bg-[#d4ccff] hover:text-[#2a2a2a]"
            >
              Manage Users
            </Button>
          </Link>
          <Link href="/analytics">
            <Button
              variant="outline"
              className="border-[#d4ccff] text-[#2a2a2a] hover:bg-[#d4ccff] hover:text-[#2a2a2a]"
            >
              View Analytics
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
