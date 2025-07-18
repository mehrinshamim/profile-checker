import React, { useEffect, useState } from "react";
import { supabase } from "@/app/utils/supabase";

interface Profile {
  full_name: string;
  age: number;
  tagline: string;
  interests: string[];
  work_as: string;
  looking_for: string;
  family_plan: string;
  relationship_status: string;
  texting_calling: string;
  photo_url?: string | null;
}

interface RightSideProps {
  activeSection: "profile" | "users" | "settings";
  onEditProfile: () => void;
}

const RightSide: React.FC<RightSideProps> = ({ activeSection, onEditProfile }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (activeSection !== "profile" || !supabase) return;

      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select(
          "full_name, age, tagline, interests, work_as, looking_for, family_plan, relationship_status, texting_calling"
        )
        .eq("id", user.id)
        .single();

      let photo_url: string | null | undefined = null;

      const { data: urlData } = await supabase
        .from("profileurl")
        .select("photo_url")
        .eq("user_id", user.id)
        .single();

      if (urlData?.photo_url) {
        photo_url = urlData.photo_url;
      }

      if (profileData) {
        setProfile({ ...profileData, photo_url });
      }

      setLoading(false);
    };

    fetchProfile();
  }, [activeSection]);

  if (activeSection === "settings") {
    return (
      <div className="flex-1 p-12 text-white font-fjalla-one">
        <h2 className="text-3xl mb-8">Settings</h2>

        <div className="flex flex-col gap-6 max-w-sm">
          <button
            onClick={onEditProfile}
            className="w-full px-6 py-4 bg-[#D79DFC] text-black rounded-xl shadow-md hover:bg-[#c26dfc] transition-colors"
          >
            Edit Profile
          </button>

          <button
            className="w-full px-6 py-4 bg-[#FFE9FF] text-[#D79DFC] rounded-xl shadow-md hover:bg-[#FFDBFF] transition-colors"
          >
            Notification Settings
          </button>

          <button
            className="w-full px-6 py-4 bg-[#FFE9FF] text-[#D79DFC] rounded-xl shadow-md hover:bg-[#FFDBFF] transition-colors"
          >
            Account Preferences
          </button>
        </div>
      </div>
    );
  }

  if (activeSection === "profile") {
    if (loading) {
      return <div className="flex-1 flex items-center justify-center text-white">Loading...</div>;
    }

    if (!profile) {
      return <div className="flex-1 flex items-center justify-center text-white">No profile data found.</div>;
    }

    return (
      <div className="flex-1 flex justify-center p-8 overflow-y-auto">
        <div className="flex flex-col gap-8 max-w-4xl w-full ">
          {/* Header */}
          <div className="bg-white rounded-3xl overflow-hidden flex text-black min-h-[300px]">
            {/* photo */}
            {profile.photo_url && (
              <img
                src={profile.photo_url}
                alt="Profile"
                className="w-64 object-cover rounded-2xl"
              />
            )}

            {/* Name and tagline */}
            <div className="flex-1 p-8">
              <h2 className="text-4xl font-bold mb-4 font-league-spartan">
                {profile.full_name.toUpperCase()}
              </h2>
              {profile.tagline && (
                <p className="text-lg text-black font-semibold mb-6 font-league-spartan">"{profile.tagline}"</p>
              )}

              {/* Interests */}
              <div className="flex flex-wrap gap-3">
                {profile.interests?.map((item) => (
                  <span
                    key={item}
                    className="px-4 py-2 bg-[#FFE9FF] text-[#D79DFC] rounded-lg text-sm font-semibold font-league-spartan"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* About section */}
          <div className="bg-white rounded-3xl p-6 text-black font-bold font-league-spartan">
            <h3 className="text-2xl mb-4">About</h3>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-lg font-semibold font-league-spartan">
              <div>
                <span className="text-[#D79DFC]">Work As:</span> {profile.work_as || "-"}
              </div>
              <div>
                <span className="text-[#D79DFC]">Age:</span> {profile.age || "-"}
              </div>
              <div>
                <span className="text-[#D79DFC]">Relationship:</span> {profile.relationship_status || "-"}
              </div>
              <div>
                <span className="text-[#D79DFC]">Looking For:</span> {profile.looking_for || "-"}
              </div>
              <div>
                <span className="text-[#D79DFC]">Family Plans:</span> {profile.family_plan || "-"}
              </div>
              <div>
                <span className="text-[#D79DFC]">Texting/Calling:</span> {profile.texting_calling || "-"}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeSection === "users") {
    return (
      <div className="flex-1 p-8">
        <h2 className="text-3xl mb-8 text-white font-fjalla-one">Users</h2>
        
        <div className="space-y-4 h-[calc(100vh-200px)] overflow-y-auto">
          {/* Sample user cards - replace with actual data */}
          {[
            { id: 1, name: "Sarah Johnson", age: 28, photo: "/assets/cats/1.png", work: "Designer" },
            { id: 2, name: "Mike Chen", age: 32, photo: "/assets/cats/2.png", work: "Engineer" },
            { id: 3, name: "Emma Davis", age: 25, photo: "/assets/cats/3.png", work: "Teacher" },
            { id: 4, name: "Alex Rodriguez", age: 30, photo: "/assets/cats/4.png", work: "Doctor" },
            { id: 5, name: "Lisa Wang", age: 27, photo: "/assets/cats/5.png", work: "Artist" },
            { id: 6, name: "David Kim", age: 29, photo: "/assets/cats/6.png", work: "Chef" },
            { id: 7, name: "Jessica Brown", age: 26, photo: "/assets/cats/1.png", work: "Marketing" },
            { id: 8, name: "Ryan Wilson", age: 31, photo: "/assets/cats/2.png", work: "Lawyer" },
            { id: 9, name: "Amanda Lee", age: 24, photo: "/assets/cats/3.png", work: "Nurse" },
            { id: 10, name: "Chris Martinez", age: 33, photo: "/assets/cats/4.png", work: "Architect" },
            { id: 11, name: "Sophie Taylor", age: 29, photo: "/assets/cats/5.png", work: "Photographer" },
            { id: 12, name: "Kevin Anderson", age: 35, photo: "/assets/cats/6.png", work: "Consultant" },
            { id: 13, name: "Rachel Green", age: 27, photo: "/assets/cats/1.png", work: "Writer" },
            { id: 14, name: "Tom Harris", age: 30, photo: "/assets/cats/2.png", work: "Musician" },
            { id: 15, name: "Nina Patel", age: 28, photo: "/assets/cats/3.png", work: "Scientist" },
            { id: 16, name: "Marcus Johnson", age: 32, photo: "/assets/cats/4.png", work: "Chef" },
            { id: 17, name: "Isabella Garcia", age: 25, photo: "/assets/cats/5.png", work: "Dentist" },
            { id: 18, name: "Daniel White", age: 34, photo: "/assets/cats/6.png", work: "Pilot" },
            { id: 19, name: "Olivia Clark", age: 26, photo: "/assets/cats/1.png", work: "Veterinarian" },
            { id: 20, name: "James Thompson", age: 29, photo: "/assets/cats/2.png", work: "Firefighter" },
          ].map((user) => (
            <div key={user.id} className="bg-white rounded-2xl p-4 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={user.photo}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-base font-bold text-black font-league-spartan">
                    {user.name}, {user.age}
                  </h3>
                  <p className="text-gray-600 text-xs font-league-spartan">
                    {user.work}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-[#D79DFC] text-white rounded-lg font-semibold hover:bg-[#c26dfc] transition-colors font-league-spartan text-sm">
                  View Profile
                </button>
                <button className="px-3 py-2 bg-[#FFE9FF] text-[#D79DFC] rounded-lg hover:bg-[#FFDBFF] transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Placeholder for other sections
  return <div className="flex-1" />;
};

export default RightSide; 