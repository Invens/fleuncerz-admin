"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/store/auth";

export default function ProtectedRoute({ children }) {
  const { token, loadAuth } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuth(); // pull token & userType from cookies
    setLoading(false);
  }, [loadAuth]);

  useEffect(() => {
    if (!loading && !token) {
      router.replace("/login");
    }
  }, [loading, token, router]);

  if (loading) return <p>Loading...</p>;

  if (!token) return null; // prevent flash before redirect

  return children;
}
