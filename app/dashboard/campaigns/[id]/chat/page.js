"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/utils/api";

export default function AdminCampaignChatPage() {
    const { id } = useParams();
    const router = useRouter();
    const [chat, setChat] = useState([]);
    const [campaign, setCampaign] = useState(null);
    const [newMsg, setNewMsg] = useState("");
    const [file, setFile] = useState(null);
    const messagesEndRef = useRef(null);

    const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const API_BASE = "https://api.fluencerz.com";

    const fetchChat = async () => {
        try {
            const res = await api.get(`/campaign/chat/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setChat(res.data.data || []);
            setCampaign(res.data.campaign || null);
        } catch (err) {
            console.error("❌ Chat error:", err);
        }
    };

    useEffect(() => {
        fetchChat();
        const interval = setInterval(fetchChat, 5000);
        return () => clearInterval(interval);
    }, [id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat]);

    const handleSend = async () => {
        if (!newMsg.trim()) return;
        try {
            await api.post(
                "/campaign/send-message",
                { campaign_id: id, message: newMsg, receiver_id: null },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNewMsg("");
            fetchChat();
        } catch (err) {
            console.error("❌ Send error:", err);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("campaign_id", id);
            formData.append("visibility", "both");
            await api.post("/campaign/upload-media", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            setFile(null);
            fetchChat();
        } catch (err) {
            console.error("❌ Upload error:", err);
        }
    };

    return (
        <div className="flex flex-col h-[90vh] max-w-5xl mx-auto bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border border-white/20 dark:border-gray-700/20">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="text-white hover:opacity-80 transition-opacity"
                >
                    ← Back
                </button>
                <h2 className="font-semibold text-white">
                    {campaign?.Brand?.company_name} 🤝{" "}
                    {campaign?.Influencer?.full_name} + Admin
                </h2>
            </div>

            {/* Chat feed */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chat.length === 0 && (
                    <p className="text-center text-gray-500 italic">
                        No messages yet. Start the conversation!
                    </p>
                )}
                {chat.map((item) => {
                    const isSender = item.sender_type === "admin"; // current user is admin
                    const senderName =
                        item.sender_type === "brand"
                            ? campaign?.Brand?.company_name
                            : item.sender_type === "influencer"
                                ? campaign?.Influencer?.full_name
                                : "Admin";

                    const fileUrl = item.file_path ? `${API_BASE}/${item.file_path}` : null;
                    const fileExt = fileUrl ? fileUrl.split(".").pop().toLowerCase() : null;

                    return (
                        <div
                            key={item.id}
                            className={`flex items-end gap-2 ${isSender ? "justify-end" : "justify-start"
                                }`}
                        >
                            <div
                                className={`px-4 py-2 rounded-2xl shadow text-sm max-w-xs sm:max-w-md ${isSender
                                        ? "bg-green-500 text-white rounded-br-none"
                                        : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none"
                                    }`}
                            >
                                {/* ✅ Text messages */}
                                {item.type === "message" && <p>{item.message}</p>}

                                {/* ✅ Media messages */}
                                {item.type === "media" && fileUrl && (
                                    <>
                                        {/* Show preview if image */}
                                        {["jpg", "jpeg", "png", "gif", "webp"].includes(fileExt) ? (
                                            <img
                                                src={fileUrl}
                                                alt="uploaded"
                                                className="max-w-[200px] rounded-lg border mt-1"
                                            />
                                        ) : ["mp4", "webm", "ogg"].includes(fileExt) ? (
                                            <video
                                                src={fileUrl}
                                                controls
                                                className="max-w-[200px] rounded-lg border mt-1"
                                            />
                                        ) : (
                                            <a
                                                href={fileUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className={`underline ${isSender ? "text-white" : "text-blue-600 dark:text-blue-400"
                                                    }`}
                                            >
                                                📎 {item.file_path.split("/").pop()}
                                            </a>
                                        )}
                                    </>
                                )}

                                {/* ✅ Timestamp */}
                                <p
                                    className={`text-[10px] mt-1 ${isSender ? "text-white/80 text-right" : "text-gray-500"
                                        }`}
                                >
                                    {senderName} •{" "}
                                    {new Date(item.created_at || item.uploaded_at).toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    );
                })}


                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/20 flex items-center gap-2 bg-white/20 backdrop-blur-sm">
                <input
                    type="text"
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 rounded-full border focus:outline-none"
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                    onClick={handleSend}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
                >
                    Send
                </button>
                <form onSubmit={handleUpload} className="flex items-center">
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="hidden"
                        id="chat-file"
                    />
                    <label
                        htmlFor="chat-file"
                        className="px-3 py-2 bg-gray-200 dark:bg-gray-600 rounded-full cursor-pointer hover:bg-gray-300"
                    >
                        📎
                    </label>
                    {file && (
                        <button
                            type="submit"
                            className="ml-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700"
                        >
                            Upload
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}
