"use client";
import LeftSide from "./components/left";
import RightSide from "./components/right";
import { useState } from "react";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState<"profile" | "users" | "matches">("profile");

  return (
    <div className="flex">
      <LeftSide activeSection={activeSection} onSectionChange={setActiveSection} />
      <RightSide
        activeSection={activeSection}
      />
    </div>
  );
};

export default Dashboard;