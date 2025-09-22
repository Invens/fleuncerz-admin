"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/utils/api";

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/admin/brands");
        setBrands(res.data.data);
      } catch (err) {
        console.error("❌ Error fetching brands:", err);
      }
    };
    load();
  }, []);

  return (
    <div>
      {/* Header */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800">🏢 Brands</h2>

      {/* Table */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 text-sm font-semibold text-gray-600">
            <tr>
              <th className="p-4 text-left">Company</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Campaigns</th>
              <th className="p-4 text-left">Applications</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {brands.map((b) => (
              <tr
                key={b.id}
                className="hover:bg-gray-50 transition"
              >
                {/* Company */}
                <td className="p-4 font-medium text-gray-900">
                  <div className="flex items-center gap-3">
                    {b.profile_picture && (
                      <img
                        src={
                          b.profile_picture.startsWith("http")
                            ? b.profile_picture
                            : `https://api.fluencerz.com${b.profile_picture}`
                        }
                        alt={b.company_name}
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                    )}
                    <span>{b.company_name}</span>
                  </div>
                </td>

                {/* Email */}
                <td className="p-4 text-gray-600">{b.email}</td>

                {/* Campaign Count */}
                <td className="p-4">
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                    {b.campaign_count || 0} Campaigns
                  </span>
                </td>

                {/* Applications Count */}
                <td className="p-4">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                    {b.applications_count || 0} Applications
                  </span>
                </td>

                {/* Actions */}
                <td className="p-4 text-center">
                  <Link
                    href={`/dashboard/brands/${b.id}`}
                    className="px-3 py-1 bg-indigo-600 text-white rounded-md text-xs font-medium hover:bg-indigo-700 transition"
                  >
                    View Campaigns
                  </Link>
                </td>
              </tr>
            ))}

            {brands.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500 text-sm">
                  No brands found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
