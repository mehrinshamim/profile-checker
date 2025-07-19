import React from "react";

interface SettingsProps {
  onEditProfile: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onEditProfile }) => {
  // Additional settings-related state can be added here
  return (
    <div className="flex-1 p-12 text-white font-fjalla-one overflow-y-auto">
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

        {/* Other settings options go here */}
      </div>

      {/* Other settings options go here */}
    </div>
  );
};

export default Settings; 