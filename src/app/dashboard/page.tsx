"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Dashboard() {
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUserAndSync = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/");
        return;
      }

      setEmail(user.email || null);

      try {
        await fetch("http://localhost:8080/api/auth/sync", {
          method: "POST",
          headers: {
            "X-User-Email": user.email!,
            "X-User-Id": user.id,
          },
        });
      } catch (err) {
        console.error("Failed to sync user:", err);
      }
    };

    getUserAndSync();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Logged in as {email}</p>
        </div>

        <button
          onClick={handleLogout}
          className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div
          onClick={() => router.push("/report")}
          className="cursor-pointer bg-blue-600 text-white p-6 rounded-xl shadow hover:bg-blue-700"
        >
          <h2 className="text-xl font-bold mb-2">➕ Report an Issue</h2>
          <p>Upload photos and describe the problem</p>
        </div>

        <div 
           onClick={() => router.push("/my-reports")}
          className="cursor-pointer bg-blue-600 text-white p-6 rounded-xl shadow hover:bg-blue-700">
          <h2 className="text-xl font-bold mb-2">📄 My Reports</h2>
          <p className="text-gray-600">
            View status of issues you reported
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-2">📊 City Impact</h2>
          <p className="text-gray-600">
            See resolved & pending issues
          </p>
        </div>

      </div>
    </div>
  );
}
