import React from "react";
import Users from "./users";
import MyProfile from "./myprofile";
import Matches from "./matches";

interface RightSideProps {
  activeSection: "profile" | "users" | "matches";
}

const RightSide: React.FC<RightSideProps> = ({ activeSection }) => {
  // settings removed

  if (activeSection === "profile") {
    return <MyProfile />;
  }

  if (activeSection === "users") {
    return <Users />;
  }

  if (activeSection === "matches") {
    return <Matches />;
  }

  // Placeholder for other sections
  return <div className="flex-1" />;
};

export default RightSide; 