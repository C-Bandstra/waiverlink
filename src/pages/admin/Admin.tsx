import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { listenToSubmissions } from "../../firebase/admin/listenToSubmissions";
import { useSeed } from "../../context/SeedContext";
import type { WaiverSubmission } from "../../types/admin";

const Admin: React.FC = () => {
  const [waiverSubmissions, setWaiverSubmissions] = useState<WaiverSubmission[]>([]);
  const seed = useSeed();

  useEffect(() => {
    const unsub = listenToSubmissions(seed.id, "waivers", setWaiverSubmissions);
    return () => unsub?.();
  }, [seed.id]);

  return (
    <>
      <p>Admin</p>
      <Outlet context={{ waiverSubmissions }} />
    </>
);
};

export default Admin;