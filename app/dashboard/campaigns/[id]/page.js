"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/utils/api";

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/admin/campaigns/${id}`);
        setCampaign(res.data.data);
      } catch (err) {
        console.error("❌ Error fetching campaign details:", err);
      }
    };
    load();
  }, [id]);

  if (!campaign) return <p>Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow">
      {/* Header with Feature Image */}
      {campaign.feature_image && (
        <img
          src={`https://api.fluencerz.com${campaign.feature_image}`}
          alt={campaign.title}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      )}

      {/* Title & Description */}
      <h2 className="text-3xl font-bold mb-2">{campaign.title}</h2>
      <p className="text-gray-700 mb-6">{campaign.description}</p>

      {/* General Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2">📌 General Info</h3>
          <ul className="space-y-1 text-sm text-gray-700">
            <li><strong>Status:</strong> {campaign.status}</li>
            <li><strong>Platform:</strong> {campaign.platform}</li>
            <li><strong>Content Type:</strong> {campaign.content_type}</li>
            <li><strong>Created:</strong> {new Date(campaign.created_at).toLocaleString()}</li>
            <li><strong>Updated:</strong> {new Date(campaign.updated_at).toLocaleString()}</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">📑 Documents</h3>
          <ul className="space-y-1 text-sm text-blue-600 underline">
            {campaign.brief_link && (
              <li><a href={campaign.brief_link} target="_blank">📄 Brief</a></li>
            )}
            {campaign.media_kit_link && (
              <li><a href={campaign.media_kit_link} target="_blank">📂 Media Kit</a></li>
            )}
          </ul>
        </div>
      </div>

      {/* Brand Info */}
      <div className="mt-8">
        <h3 className="font-semibold mb-2">🏢 Brand</h3>
        <div className="flex items-center gap-3">
          {campaign.Brand?.profile_picture && (
            <img
              src={`https://api.fluencerz.com${campaign.Brand.profile_picture}`}
              alt={campaign.Brand.company_name}
              className="w-12 h-12 rounded-full object-cover border"
            />
          )}
          <div>
            <p className="font-medium">{campaign.Brand?.company_name}</p>
            <p className="text-sm text-gray-600">{campaign.Brand?.email}</p>
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div className="mt-8">
        <h3 className="font-semibold mb-2">📋 Requirements</h3>
        <p className="bg-gray-100 p-3 rounded text-sm">
          {campaign.campaign_requirements?.replace(/["\\]/g, "") || "N/A"}
        </p>
      </div>

      {/* Eligibility */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">✅ Eligibility</h3>
        <p className="bg-gray-100 p-3 rounded text-sm">
          {campaign.eligibility_criteria?.replace(/["\\]/g, "") || "N/A"}
        </p>
      </div>

      {/* Guidelines */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div>
          <h3 className="font-semibold mb-2">👍 Guidelines (Do)</h3>
          <p className="bg-green-50 p-3 rounded text-sm text-green-800">
            {campaign.guidelines_do?.replace(/["\\]/g, "") || "N/A"}
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">🚫 Guidelines (Don’t)</h3>
          <p className="bg-red-50 p-3 rounded text-sm text-red-800">
            {campaign.guidelines_donot?.replace(/["\\]/g, "") || "N/A"}
          </p>
        </div>
      </div>

      {/* Applications */}
      <div className="mt-8">
        <h3 className="font-semibold mb-2">👥 Applications</h3>
        {campaign.CampaignApplications?.length === 0 ? (
          <p className="text-gray-500">No applications yet</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {campaign.CampaignApplications.map((a) => (
              <li key={a.id} className="py-2">
                <p className="font-medium">{a.Influencer?.full_name}</p>
                <p className="text-sm text-gray-500">Status: {a.status}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
