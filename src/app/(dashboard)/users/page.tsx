import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users | Dashboard",
  description: "Manage users",
};

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#2a2a2a]">Users</h1>
        <button className="bg-[#ffd87d] text-[#2a2a2a] px-4 py-2 rounded hover:bg-[#e6e0ff] transition-all">
          Add User
        </button>
      </div>

      <div className="bg-[#f0eaff] border border-[#d4ccff] rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-[#d4ccff]">
          <thead className="bg-[#e6e0ff]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#2a2a2a] uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#2a2a2a] uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#2a2a2a] uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#2a2a2a] uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#2a2a2a] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-[#f0eaff] divide-y divide-[#d4ccff]">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2a2a2a]">No users found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
