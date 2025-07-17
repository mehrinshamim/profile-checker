import LeftSide from "./components/left";
import RightSide from "./components/right";

const PfpCreate = () => {
  return (
    <div className="flex w-full h-screen">
      {/* Sidebar */}
      <LeftSide />

      {/* Right section */}
      <RightSide />
    </div>
  );
};

export default PfpCreate;   