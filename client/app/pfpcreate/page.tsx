"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/utils/supabase";
import LeftSide from "./components/left";
import RightSide from "./components/right";

export default function PfpCreate() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      if (!supabase) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // No logged-in user, send to auth page
        router.push("/auth");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      if (profile) {
        router.push("/dashboard");
      } else {
        setChecking(false); // stay on page to complete profile
      }
    };

    checkProfile();
  }, [router]);

  if (checking) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-white bg-black">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex w-full h-screen">
      {/* Sidebar */}
      <LeftSide />

      {/* Right section */}
      <RightSide />
    </div>
  );
}   