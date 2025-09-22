"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/utils/api";

// ✅ Universal parser
const parseField = (val) => {
  if (!val) return "—";
  try {
    if (typeof val === "string" && (val.startsWith('"') || val.startsWith("'"))) {
      val = JSON.parse(val); // unwrap
    }
    if (typeof val === "string" && (val.trim().startsWith("{") || val.trim().startsWith("["))) {
      val = JSON.parse(val);
    }
    if (typeof val === "object" && val !== null) {
      return (
        <ul className="list-disc list-inside text-xs text-gray-700">
          {Object.entries(val).map(([k, v]) => (
            <li key={k}>
              <strong>{k}:</strong> {String(v)}
            </li>
          ))}
        </ul>
      );
    }
    return String(val);
  } catch {
    return String(val);
  }
};

export default function BrandDetailsPage() {
  const { id } = useParams();
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBrand = async () => {
      try {
        const res = await api.get(`/admin/brands/${id}`);
        setBrand(res.data.data);
      } catch (err) {
        console.error("❌ Error fetching brand details:", err);
        setError("Could not fetch brand details.");
      } finally {
        setLoading(false);
      }
    };
    loadBrand();
  }, [id]);

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (error) return <p className="text-red-600 text-center mt-8">{error}</p>;
  if (!brand) return <p className="text-center mt-8">Brand not found.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Brand Header */}
      <div className="flex items-center gap-4 mb-6">
        {brand.profile_picture && (
          <img
            src={`https://api.fluencerz.com${brand.profile_picture}`}
            alt={brand.company_name}
            className="w-20 h-20 rounded-full object-cover border"
          />
        )}
        <div>
          <h2 className="text-2xl font-bold">{brand.company_name}</h2>
          <p className="text-gray-600">{brand.email}</p>
          <p className="text-sm text-gray-500 mt-1">
            Campaigns: {brand.campaign_count} | Applications:{" "}
            {brand.applications_count}
          </p>
        </div>
      </div>

      {/* Campaigns */}
      <h3 className="text-xl font-semibold mb-4">Campaigns</h3>
      {brand.Campaigns?.length === 0 ? (
        <p className="text-gray-500">No campaigns created yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {brand.Campaigns.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-xl shadow-lg border p-4 flex flex-col"
            >
              {/* Feature Image */}
              {c.feature_image && (
                <img
                  src={`https://api.fluencerz.com${c.feature_image}`}
                  alt={c.title}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
              )}

              <h4 className="text-lg font-semibold text-gray-900 mb-1">
                {c.title}
              </h4>
              <p className="text-gray-600 text-sm mb-2">{c.description}</p>
              <p className="text-xs text-gray-500 mb-3">
                Platform: {c.platform} | Type: {c.content_type} | Status:{" "}
                <span
                  className={`font-semibold ${
                    c.status === "published" ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {c.status}
                </span>
              </p>

              {/* Links */}
              <div className="flex gap-3 mb-3">
                {c.brief_link && (
                  <a
                    href={c.brief_link}
                    target="_blank"
                    className="text-blue-600 underline text-sm"
                  >
                    Brief
                  </a>
                )}
                {c.media_kit_link && (
                  <a
                    href={c.media_kit_link}
                    target="_blank"
                    className="text-blue-600 underline text-sm"
                  >
                    Media Kit
                  </a>
                )}
              </div>

              {/* Parsed Fields */}
              <div className="text-sm text-gray-700 space-y-2">
                <div>
                  <strong>Requirements:</strong> {parseField(c.campaign_requirements)}
                </div>
                <div>
                  <strong>Eligibility:</strong> {parseField(c.eligibility_criteria)}
                </div>
                <div>
                  <strong>Do:</strong> {parseField(c.guidelines_do)}
                </div>
                <div>
                  <strong>Don’t:</strong> {parseField(c.guidelines_donot)}
                </div>
              </div>

              {/* Applications */}
              <div className="mt-4">
                <h5 className="font-semibold mb-2">Applications</h5>
                {c.CampaignApplications?.length === 0 ? (
                  <p className="text-gray-500 text-sm">No applications yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {c.CampaignApplications.map((a) => (
                      <li
                        key={a.id}
                        className="p-2 bg-gray-50 rounded flex items-center gap-2"
                      >
                        {a.Influencer?.profile_image && (
                          <img
                            src={`https://api.fluencerz.com${a.Influencer.profile_image}`}
                            alt={a.Influencer.full_name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <Link
                            href={`/dashboard/influencers/${a.Influencer?.id}`}
                            className="font-medium text-sm text-blue-600 hover:underline"
                          >
                            {a.Influencer?.full_name}
                          </Link>
                          <p className="text-xs text-gray-500">
                            Status: {a.status} | Applied:{" "}
                            {new Date(a.applied_at).toLocaleDateString()}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
