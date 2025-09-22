"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import Link from "next/link";

const tabs = ["pending", "forwarded", "brand_approved", "approved", "rejected"];

export default function ApplicationsPage() {
  const [activeTab, setActiveTab] = useState("pending");
  const [apps, setApps] = useState([]);

  const load = async () => {
    try {
      const res = await api.get(`/admin/applications/${activeTab}`);
      setApps(res.data.data);
    } catch (err) {
      console.error("❌ Error fetching applications:", err);
    }
  };

  useEffect(() => {
    load();
  }, [activeTab]);

  const decide = async (id, decision) => {
    try {
      await api.post(`/admin/application/${id}/decision`, { decision });
      load();
    } catch (err) {
      console.error("❌ Decision error:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">📋 Applications</h2>

      {/* Tabs */}
      <div className="flex space-x-3 mb-8 border-b pb-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-t-lg font-medium transition ${
              activeTab === t
                ? "bg-indigo-600 text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {t.replace("_", " ").toUpperCase()}
          </button>
        ))}
      </div>

      {/* Applications */}
      {apps.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          No {activeTab.replace("_", " ")} applications found.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {apps.map((a) => (
            <div
              key={a.id}
              className="bg-white p-6 rounded-xl shadow border hover:shadow-lg transition"
            >
              {/* Influencer Info */}
              <div className="flex items-center gap-4 mb-4">
                {a.Influencer?.profile_image && (
                  <img
                    src={`https://api.fluencerz.com${a.Influencer.profile_image}`}
                    alt={a.Influencer.full_name}
                    className="w-14 h-14 rounded-full border object-cover"
                  />
                )}
                <div>
                  <h3 className="text-lg font-semibold">
                    {a.Influencer?.full_name || "Unknown"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Campaign:{" "}
                    <span className="font-medium">{a.Campaign?.title}</span>
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-4">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    a.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : a.status === "forwarded"
                      ? "bg-blue-100 text-blue-700"
                      : a.status === "brand_approved"
                      ? "bg-purple-100 text-purple-700"
                      : a.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {a.status.replace("_", " ").toUpperCase()}
                </span>
              </div>

              {/* Actions */}
              {activeTab === "pending" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => decide(a.id, "forwarded")}
                    className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                  >
                    Forward
                  </button>
                  <button
                    onClick={() => decide(a.id, "approved")}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => decide(a.id, "rejected")}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Reject
                  </button>
                </div>
              )}

              {/* Brand Approved → Admin Final Decision */}
              {activeTab === "brand_approved" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => decide(a.id, "approved")}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Final Approve
                  </button>
                  <button
                    onClick={() => decide(a.id, "rejected")}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Reject
                  </button>
                </div>
              )}

              {activeTab === "approved" && (
                <div className="mt-3">
                  <Link
                    href={`/dashboard/campaigns/${a.Campaign?.id}/chat`}
                    className="block text-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    💬 Open Chat
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
