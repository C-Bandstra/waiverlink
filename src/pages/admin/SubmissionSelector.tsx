import { useOutletContext, useNavigate } from "react-router-dom";
import type { DashboardContext } from "../../types/admin";
import { useSeed } from "../../context/SeedContext";

const SubmissionSelector = () => {
  const { setSelectedTemplateTitle } = useOutletContext<DashboardContext>();
  const seed = useSeed();
  const navigate = useNavigate();

  const templateEntries = Object.entries(seed.waiverTemplates);

  const goToTemplate = (templateId: string) => {
    const template = seed.waiverTemplates[templateId];
    if (!template?.title) return;
    setSelectedTemplateTitle(template.title);
    navigate(`${templateId}`);
  };

  return (
    <div className="space-y-4 border border-blue-500 p-4">
      <h2 className="text-lg font-bold">Select a Template</h2>
      <ul className="space-y-2">
        {templateEntries.map(([templateId, template]) => (
          <li key={templateId}>
            <button
              onClick={() => goToTemplate(templateId)}
              className="text-blue-600 hover:underline"
            >
              {template.title || templateId}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubmissionSelector;
