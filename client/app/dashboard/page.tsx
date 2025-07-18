import LeftSide from "./components/left";

const Dashboard = () => {
  return (
    <div className="flex">
      <LeftSide />
      <div className="flex-1">
        {/* Dashboard content will go here */}
      </div>
    </div>
  );
};

export default Dashboard;