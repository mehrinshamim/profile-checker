"use client";
import LeftSide from "./components/left";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/utils/supabase";

const Dashboard = () => {
  const router = useRouter();

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
      <LeftSide />
      <div className="flex-1 flex items-center justify-center">
        <button
          onClick={handleEditProfile}
          className="mt-10 px-8 py-4 bg-[#D79DFC] text-white font-fjalla-one text-xl rounded-xl shadow-md hover:bg-[#c26dfc] transition-colors"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Dashboard;