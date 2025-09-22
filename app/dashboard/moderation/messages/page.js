"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api";

export default function PendingMessagesPage() {
  const [messages, setMessages] = useState([]);

  const load = async () => {
    try {
      const res = await api.get("/admin/messages/pending");
      setMessages(res.data.data);
    } catch (err) {
      console.error("❌ Error fetching messages:", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (id) => {
    try {
      await api.put(`/admin/messages/${id}/approve`);
      load();
    } catch (err) {
      console.error("❌ Error approving message:", err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Pending Messages</h2>
      {messages.length === 0 ? (
        <p className="text-gray-500">No pending messages</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold">{msg.Campaign?.title}</h3>
              <p className="text-gray-700 mt-2">{msg.content}</p>
              <p className="text-gray-500 text-sm">Sent: {new Date(msg.created_at).toLocaleString()}</p>
              <button
                onClick={() => approve(msg.id)}
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
