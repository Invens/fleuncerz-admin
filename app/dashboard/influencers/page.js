"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/utils/api";

export default function InfluencersPage() {
  const [influencers, setInfluencers] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/admin/influencers");
        setInfluencers(res.data.data);
      } catch (err) {
        console.error("❌ Error fetching influencers:", err);
      }
    };
    load();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">📊 Influencers</h2>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="p-3 text-left">Influencer</th>
              <th className="p-3 text-left">Niche</th>
              <th className="p-3 text-left">Followers</th>
              <th className="p-3 text-left">Engagement</th>
              <th className="p-3 text-left">Applications</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {influencers.map((i, idx) => (
              <tr
                key={i.id}
                className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-indigo-50 transition`}
              >
                {/* Influencer */}
                {/* Influencer */}
                <td className="p-3 flex items-center space-x-3">
                  {i.profile_image ? (
                    <img
                      src={
                        i.profile_image.startsWith("http")
                          ? i.profile_image
                          : `https://api.fluencerz.com${i.profile_image}`
                      }
                      alt={i.full_name}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-500">
                      {i.full_name?.[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{i.full_name}</p>
                    <p className="text-xs text-gray-500">{i.email}</p>
                  </div>
                </td>


                {/* Niche */}
                <td className="p-3">
                  <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">
                    {i.niche || "—"}
                  </span>
                </td>

                {/* Followers */}
                <td className="p-3 font-medium text-gray-700">
                  {i.followers_count?.toLocaleString() || 0}
                </td>

                {/* Engagement */}
                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${i.engagement_rate > 5
                        ? "bg-green-100 text-green-700"
                        : i.engagement_rate > 2
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                  >
                    {i.engagement_rate ? `${i.engagement_rate}%` : "N/A"}
                  </span>
                </td>

                {/* Applications */}
                <td className="p-3">
                  <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700">
                    {i.applications_count || 0}
                  </span>
                </td>

                {/* Actions */}
                <td className="p-3 text-center">
                  <Link
                    href={`/dashboard/influencers/${i.id}`}
                    className="text-indigo-600 font-medium hover:underline"
                  >
                    View Profile →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
