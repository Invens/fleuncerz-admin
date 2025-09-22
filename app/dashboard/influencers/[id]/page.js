"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/utils/api";

// ✅ Safe JSON parser
const parseField = (val) => {
  if (!val) return "—";
  try {
    if (typeof val === "string") val = JSON.parse(val);

    if (Array.isArray(val)) {
      return val.length > 0 ? (
        <ul className="list-disc list-inside text-sm text-gray-700">
          {val.map((v, i) => (
            <li key={i}>{JSON.stringify(v)}</li>
          ))}
        </ul>
      ) : (
        "—"
      );
    }
    if (typeof val === "object" && val !== null) {
      return (
        <ul className="list-disc list-inside text-sm text-gray-700">
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

export default function InfluencerProfilePage() {
  const { id } = useParams();
  const [influencer, setInfluencer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState("");

  const loadInfluencer = async () => {
    try {
      const res = await api.get(`/admin/influencers/${id}`);
      setInfluencer(res.data.data);
    } catch (err) {
      console.error("❌ Error fetching influencer profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setMessage("");
    try {
      const res = await api.post(`/admin/influencers/${id}/refresh-instagram`);
      setMessage("✅ Instagram data refreshed successfully!");
      await loadInfluencer();
    } catch (err) {
      console.error("❌ Refresh error:", err);
      setMessage("❌ Failed to refresh Instagram data.");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadInfluencer();
  }, [id]);

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (!influencer) return <p className="text-center mt-8">Influencer not found.</p>;

  // Parse insights safely
  const insightsDay = influencer.account_insights_day
    ? JSON.parse(influencer.account_insights_day)
    : {};
  const insights30 = influencer.account_insights_30days
    ? JSON.parse(influencer.account_insights_30days)
    : {};

  const posts =
    influencer.instagramAccount?.media_with_insights &&
    JSON.parse(influencer.instagramAccount.media_with_insights);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-6 bg-white rounded-xl shadow p-6 border">
        {influencer.profile_image && (
          <img
            src={`https://api.fluencerz.com${influencer.profile_image}`}
            alt={influencer.full_name}
            className="w-24 h-24 rounded-full border object-cover"
          />
        )}
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{influencer.full_name}</h2>
          <p className="text-gray-600">Niche: {influencer.niche}</p>
          <p className="text-sm text-gray-500 mt-1">
            Followers: {influencer.followers_count} | Engagement:{" "}
            {influencer.engagement_rate}%
          </p>
          {influencer.website && (
            <a
              href={influencer.website}
              target="_blank"
              className="text-blue-600 underline text-sm"
            >
              {influencer.website}
            </a>
          )}
          {influencer.biography && (
            <p className="text-sm text-gray-700 mt-2">{influencer.biography}</p>
          )}
        </div>

        {/* 🔄 Refresh Button */}
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className={`px-4 py-2 rounded-lg text-white ${
            refreshing ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {refreshing ? "Refreshing..." : "🔄 Refresh Instagram Data"}
        </button>
      </div>

      {/* Success/Error Message */}
      {message && (
        <p className="text-center text-sm mt-2 font-medium">
          {message.startsWith("✅") ? (
            <span className="text-green-600">{message}</span>
          ) : (
            <span className="text-red-600">{message}</span>
          )}
        </p>
      )}

      {/* Audience Demographics */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-xl border p-4">
          <h3 className="font-semibold mb-2">📊 Audience Gender</h3>
          {parseField(influencer.audience_gender)}
        </div>
        <div className="bg-white shadow rounded-xl border p-4">
          <h3 className="font-semibold mb-2">📊 Audience Age</h3>
          {parseField(
            influencer.audience_age_group || influencer.audience_age_distribution
          )}
        </div>
        <div className="bg-white shadow rounded-xl border p-4">
          <h3 className="font-semibold mb-2">🌍 Followers by Country</h3>
          {parseField(influencer.followers_by_country)}
        </div>
        <div className="bg-white shadow rounded-xl border p-4">
          <h3 className="font-semibold mb-2">🏙 Audience City</h3>
          {parseField(influencer.audience_city)}
        </div>
      </div>

      {/* Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-xl border p-4">
          <h3 className="font-semibold mb-2">📊 Last Day Insights</h3>
          {parseField(insightsDay)}
        </div>
        <div className="bg-white shadow rounded-xl border p-4">
          <h3 className="font-semibold mb-2">📊 Last 30 Days Insights</h3>
          {parseField(insights30)}
        </div>
      </div>

      {/* Instagram Account Stats */}
      {influencer.instagramAccount && (
        <div className="bg-white shadow rounded-xl border p-4">
          <h3 className="font-semibold mb-3">📱 Instagram Account Stats</h3>
          <p>Posts: {influencer.instagramAccount.media_count}</p>
          <p>Avg Likes: {influencer.instagramAccount.avg_likes}</p>
          <p>Avg Comments: {influencer.instagramAccount.avg_comments}</p>
          <p>Avg Reach: {influencer.instagramAccount.avg_reach}</p>
          <p>Avg Views: {influencer.instagramAccount.avg_views}</p>
          <p>Total Engagements: {influencer.instagramAccount.total_engagements}</p>
        </div>
      )}

      {/* Campaign Applications */}
      <div className="bg-white shadow rounded-xl border p-4">
        <h3 className="font-semibold mb-3">📋 Campaign Applications</h3>
        {influencer.CampaignApplications?.length === 0 ? (
          <p className="text-gray-500 text-sm">No applications yet.</p>
        ) : (
          <ul className="space-y-2">
            {influencer.CampaignApplications.map((app) => (
              <li
                key={app.id}
                className="p-3 bg-gray-50 rounded flex flex-col"
              >
                <Link
                  href={`/dashboard/campaigns/${app.Campaign?.id}`}
                  className="font-medium text-sm text-blue-600 hover:underline"
                >
                  {app.Campaign?.title}
                </Link>
                <p className="text-xs text-gray-500">
                  Brand: {app.Campaign?.Brand?.company_name} • Status:{" "}
                  {app.status} • Applied on:{" "}
                  {new Date(app.applied_at).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Social Platforms */}
      {influencer.social_platforms && (
        <div className="bg-white shadow rounded-xl border p-4">
          <h3 className="font-semibold mb-3">🔗 Social Platforms</h3>
          {parseField(influencer.social_platforms)}
        </div>
      )}

      {/* Posts with Insights */}
     {/* 📸 Recent Posts */}
     {posts && posts.length > 0 && (
  <div className="bg-white shadow rounded-xl border p-4">
    <h3 className="font-semibold mb-3">📸 Recent Posts</h3>
    <div className="grid md:grid-cols-3 gap-4">
      {posts.map((p) => {
        const insightsObj = {};
        if (p.insights?.data) {
          p.insights.data.forEach((i) => {
            insightsObj[i.name] = i.values?.[0]?.value ?? 0;
          });
        }

        return (
          <div
            key={p.id}
            className="relative border rounded-lg overflow-hidden hover:shadow-lg transition bg-white"
          >
            {/* 🔖 Media Type Badge */}
            <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-10">
              {p.media_type}
            </span>

            {/* ✅ Fixed-size container */}
            <div className="relative w-full aspect-video bg-gray-100 flex items-center justify-center">
              {p.media_type === "IMAGE" && p.media_url && (
                <img
                  src={p.media_url}
                  alt={p.caption || "Post"}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}

              {(p.media_type === "VIDEO" || p.media_type === "REEL") && (
                <video
                  src={p.media_url}
                  controls
                  poster={p.thumbnail_url}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}

              {p.media_type === "CAROUSEL_ALBUM" && (
                <div className="relative w-full h-full">
                  <img
                    src={p.media_url}
                    alt="Carousel cover"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    📷 {p.children?.length || 1} items
                  </span>
                </div>
              )}

              {p.media_type === "STORY" && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pink-500 to-yellow-400 text-white font-bold text-lg">
                  Story
                </div>
              )}
            </div>

            {/* Caption + Metrics */}
            <div className="p-3 text-sm">
              <p className="font-medium mb-1 line-clamp-2">
                {p.caption || "No caption"}
              </p>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600">
                {Object.entries(insightsObj).map(([metric, value]) => (
                  <p key={metric}>
                    {metric.charAt(0).toUpperCase() + metric.slice(1)}: {value}
                  </p>
                ))}
              </div>

              <p className="mt-1 text-xs text-gray-400">
                {new Date(p.timestamp).toLocaleDateString()}
              </p>

              {/* 🔗 View on Instagram */}
              {p.permalink && (
                <a
                  href={p.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-xs mt-2 block"
                >
                  View on Instagram
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}

    </div>
  );
}
