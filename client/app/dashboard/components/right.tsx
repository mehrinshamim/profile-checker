import React from "react";
import Settings from "./settings";
import Users from "./users";
import MyProfile from "./myprofile";

interface RightSideProps {
  activeSection: "profile" | "users" | "settings";
  onEditProfile: () => void;
}

const RightSide: React.FC<RightSideProps> = ({ activeSection, onEditProfile }) => {
  if (activeSection === "settings") {
    return <Settings onEditProfile={onEditProfile} />;
  }

  if (activeSection === "profile") {
    return <MyProfile />;
  }

  if (activeSection === "users") {
    return <Users />;
  }

  // Placeholder for other sections
  return <div className="flex-1" />;
};

export default RightSide; 