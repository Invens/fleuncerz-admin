"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api";

export default function DashboardHome() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error("❌ Error fetching stats:", err);
      }
    };
    loadStats();
  }, []);

  if (!stats) return <p>Loading stats...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Dashboard Overview</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Brands" value={stats.brands} />
        <StatCard title="Influencers" value={stats.influencers} />
        <StatCard title="Collab Requests" value={stats.collab_requests.total} />
        <StatCard title="Pending Requests" value={stats.collab_requests.pending} />
        <StatCard title="Approved Requests" value={stats.collab_requests.approved} />
        <StatCard title="Rejected Requests" value={stats.collab_requests.rejected} />
        <StatCard title="Total Campaigns" value={stats.campaigns.total} />
        <StatCard title="Total Quotation" value={`₹${stats.campaigns.total_quotation}`} />
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white shadow rounded p-4">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
