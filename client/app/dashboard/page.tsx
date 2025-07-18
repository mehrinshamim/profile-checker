"use client";
import LeftSide from "./components/left";
import RightSide from "./components/right";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/utils/supabase";
import { useState } from "react";

const Dashboard = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<"profile" | "users" | "settings">("profile");

  const handleEditProfile = async () => {
    if (!supabase) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth");
      return;
    }

    router.push("/pfpcreate?edit=true");
  };

  return (
    <div className="flex">
      <LeftSide onSettingsClick={() => setActiveSection("settings")} />
      <RightSide
        activeSection={activeSection}
        onEditProfile={handleEditProfile}
      />
    </div>
  );
};

export default Dashboard;