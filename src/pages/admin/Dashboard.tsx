import { Outlet } from "react-router-dom";
import type { DashboardContext } from "../../types/admin";
import { useOutletContext } from "react-router-dom";

const Dashboard: React.FC = () => {
  const context = useOutletContext<DashboardContext>();

  return (
    <div className="p-4 border-2 border-black">
      Dashboard
      <Outlet context={context} />
    </div>
  );
};

export default Dashboard;
