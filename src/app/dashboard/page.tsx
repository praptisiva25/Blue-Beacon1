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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">
        Welcome {email}
      </h1>

      <button
        onClick={handleLogout}
        className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
