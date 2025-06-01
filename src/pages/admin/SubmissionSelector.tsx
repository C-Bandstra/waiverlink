import { useOutletContext, useNavigate } from "react-router-dom";
import type { WaiverSubmission } from "../../types/admin";
import { useSeed } from "../../context/SeedContext";

const SubmissionSelector = () => {
  const { waiverSubmissions } = useOutletContext<{ waiverSubmissions: WaiverSubmission[] }>();
  const seed = useSeed();
  const navigate = useNavigate();

  const uniqueTemplateIds = Array.from(
    new Set(waiverSubmissions.map((w) => w.templateId))
  );

  const goToTemplate = (templateId: string) => {
    navigate(`${templateId}`);
  };

  return (
    <div className="space-y-4 border border-blue-500 p-4">
      <h2 className="text-lg font-bold">Select a Template</h2>
      <ul className="space-y-2">
        {uniqueTemplateIds.map((templateId) => {
          const template = seed.waiverTemplates[templateId];
          return (
            <li key={templateId}>
              <button
                onClick={() => goToTemplate(templateId)}
                className="text-blue-600 hover:underline"
              >
                {template?.title || templateId}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SubmissionSelector;