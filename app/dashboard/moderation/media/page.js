    "use client";
import { useEffect, useState } from "react";
import api from "@/utils/api";

export default function PendingMediaPage() {
  const [media, setMedia] = useState([]);

  const load = async () => {
    try {
      const res = await api.get("/admin/media/pending");
      setMedia(res.data.data);
    } catch (err) {
      console.error("❌ Error fetching media:", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (id) => {
    try {
      await api.put(`/admin/media/${id}/approve`);
      load();
    } catch (err) {
      console.error("❌ Error approving media:", err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Pending Media</h2>
      {media.length === 0 ? (
        <p className="text-gray-500">No pending media</p>
      ) : (
        <div className="space-y-4">
          {media.map((m) => (
            <div key={m.id} className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold">{m.Campaign?.title}</h3>
              <p className="text-gray-500 text-sm">Uploaded: {new Date(m.uploaded_at).toLocaleString()}</p>
              {m.file_path && (
                <a
                  href={m.file_path}
                  target="_blank"
                  rel="noreferrer"
                  className="block mt-2 text-blue-600 hover:underline"
                >
                  View File
                </a>
              )}
              <button
                onClick={() => approve(m.id)}
                className="mt-3 px-3 py-1 bg-green-600 text-white rounded"
              >
                Approve
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
