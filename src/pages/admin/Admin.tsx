import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { listenToSubmissions } from "../../firebase/admin/listenToSubmissions";
import { useSeed } from "../../context/SeedContext";
import type { WaiverSubmission } from "../../types/admin";
import { toSlug } from "../../utils/helpers";

const Admin: React.FC = () => {
  const [waiverSubmissions, setWaiverSubmissions] = useState(
    [] as WaiverSubmission[],
  );
  const [selectedTemplateTitle, setSelectedTemplateTitle] = useState(
    null as string | null,
  );

  const seed = useSeed();

  useEffect(() => {
    if (!selectedTemplateTitle) return;
    const selectedTemplateSlug = toSlug(selectedTemplateTitle);

    const unsub = listenToSubmissions(
      seed.id,
      "waivers",
      selectedTemplateSlug,
      setWaiverSubmissions,
    );
    return () => unsub?.();
  }, [seed.id, selectedTemplateTitle]);

  return (
    <>
      <p>Admin</p>
      <Outlet
        context={{
          waiverSubmissions,
          setSelectedTemplateTitle,
          selectedTemplateTitle,
        }}
      />
    </>
  );
};

export default Admin;
