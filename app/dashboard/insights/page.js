"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api";

export default function InsightsPage() {
  const [stats, setStats] = useState(null);
  const [brands, setBrands] = useState([]);
  const [influencers, setInfluencers] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, brandRes, infRes] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/insights/brands"),
          api.get("/admin/insights/influencers"),
        ]);
        setStats(statsRes.data);
        setBrands(brandRes.data.data);
        setInfluencers(infRes.data.data);
      } catch (err) {
        console.error("❌ Error fetching insights:", err);
      }
    };
    load();
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Admin Insights & Stats</h2>

      {/* High-level stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Brands</h3>
          <p className="text-2xl">{stats.brands}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Influencers</h3>
          <p className="text-2xl">{stats.influencers}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Campaigns</h3>
          <p className="text-2xl">{stats.campaigns.total}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Total Quotation</h3>
          <p className="text-2xl">₹{stats.campaigns.total_quotation}</p>
        </div>
      </div>

      {/* Brands Insights */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-2">Top Brands</h3>
        <ul className="space-y-2">
          {brands.map((b) => (
            <li key={b.id} className="bg-white p-3 rounded shadow flex justify-between">
              <span>{b.company_name} ({b.email})</span>
              <span>Campaigns: {b.campaign_count}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Influencers Insights */}
      <div>
        <h3 className="text-lg font-bold mb-2">Top Influencers</h3>
        <ul className="space-y-2">
          {influencers.map((i) => (
            <li key={i.id} className="bg-white p-3 rounded shadow flex justify-between">
              <span>{i.full_name}</span>
              <span>Campaigns: {i.campaign_count} | Rating: {i.average_rating || "N/A"}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
