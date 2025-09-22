"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/utils/api";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/admin/campaigns");
        setCampaigns(res.data.data);
      } catch (err) {
        console.error("❌ Error fetching campaigns:", err);
      }
    };
    load();
  }, []);

  const statusColors = {
    published: "bg-green-100 text-green-700",
    draft: "bg-gray-100 text-gray-700",
    pending: "bg-yellow-100 text-yellow-700",
    closed: "bg-red-100 text-red-700",
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📢 Campaigns</h2>
        <Link
          href="/dashboard/campaigns/create"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          + Create Campaign
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 text-left text-sm font-semibold text-gray-600">
            <tr>
              <th className="p-4">Campaign</th>
              <th className="p-4">Brand</th>
              <th className="p-4">Status</th>
              <th className="p-4">Created</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {campaigns.map((c) => (
              <tr
                key={c.id}
                className="hover:bg-gray-50 transition text-sm text-gray-700"
              >
                {/* Title */}
                <td className="p-4 font-medium text-gray-900">
                  <div className="flex items-center gap-3">
                    {c.feature_image && (
                      <img
                        src={
                          c.feature_image.startsWith("http")
                            ? c.feature_image
                            : `https://api.fluencerz.com${c.feature_image}`
                        }
                        alt={c.title}
                        className="w-12 h-12 rounded-lg object-cover border"
                      />
                    )}
                    <span>{c.title}</span>
                  </div>
                </td>

                {/* Brand */}
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {c.Brand?.profile_picture && (
                      <img
                        src={
                          c.Brand.profile_picture.startsWith("http")
                            ? c.Brand.profile_picture
                            : `https://api.fluencerz.com${c.Brand.profile_picture}`
                        }
                        alt={c.Brand.company_name}
                        className="w-8 h-8 rounded-full object-cover border"
                      />
                    )}
                    <span>{c.Brand?.company_name}</span>
                  </div>
                </td>

                {/* Status */}
                <td className="p-4">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      statusColors[c.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>

                {/* Created */}
                <td className="p-4 text-gray-500">
                  {new Date(c.created_at).toLocaleDateString()}
                </td>

                {/* Actions */}
                <td className="p-4 text-center">
                  <Link
                    href={`/dashboard/campaigns/${c.id}`}
                    className="text-indigo-600 font-medium hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}

            {campaigns.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="p-6 text-center text-gray-500 text-sm"
                >
                  No campaigns found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
