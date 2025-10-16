"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useAuth from "@/store/auth";
import api from "@/utils/api";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { register, handleSubmit } = useForm();
  const { login, token } = useAuth();
  const router = useRouter();

  // If already logged in, redirect
  useEffect(() => {
    if (token) {
      router.replace("/dashboard");
    }
  }, [token, router]);

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/login-admin", data);
      login(res.data.user, res.data.token, res.data.userType);
      router.replace("/dashboard"); // ✅ redirect properly
    } catch {
      alert("❌ Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-lg p-6 w-96"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
        <input
          {...register("email")}
          placeholder="Email"
          className="w-full p-2 border rounded mb-3"
        />
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-3"
        />
        <select
          {...register("userType")}
          className="w-full p-2 border rounded mb-3"
          defaultValue="admin"
        >
          <option value="admin">Admin</option>
          <option value="brand">Brand</option>
          <option value="influencer">Influencer</option>
        </select>
        <button className="w-full py-2 bg-indigo-600 text-white rounded">
          Login
        </button>
      </form>
    </div>
  );
}
