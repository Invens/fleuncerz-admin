"use client";
import { useForm } from "react-hook-form";
import api from "@/utils/api";
import { useRouter } from "next/navigation";

export default function CreateCampaignPage() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
      if (data.feature_image[0]) {
        formData.append("feature_image", data.feature_image[0]);
      }

      await api.post("/admin/campaigns", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      router.push("/dashboard/campaigns");
    } catch (err) {
      console.error("❌ Error creating campaign:", err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Create Campaign</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
        <input {...register("title")} placeholder="Title" className="w-full p-2 border rounded" />
        <textarea {...register("description")} placeholder="Description" className="w-full p-2 border rounded" />
        <input {...register("brief_link")} placeholder="Brief Link" className="w-full p-2 border rounded" />
        <input {...register("media_kit_link")} placeholder="Media Kit Link" className="w-full p-2 border rounded" />
        <input {...register("platform")} placeholder="Platform" className="w-full p-2 border rounded" />
        <input {...register("content_type")} placeholder="Content Type" className="w-full p-2 border rounded" />
        <input type="file" {...register("feature_image")} />
        <button className="px-4 py-2 bg-indigo-600 text-white rounded">Create</button>
      </form>
    </div>
  );
}
