import LeftSide from "./components/left";

const PfpCreate = () => {
  return (
    <div className="flex w-full h-screen">
      {/* Sidebar */}
      <LeftSide />

      {/* Right section placeholder - will be implemented later */}
      <div className="flex-1 bg-black" />
    </div>
  );
};

export default PfpCreate;   