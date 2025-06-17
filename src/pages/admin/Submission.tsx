import { useParams, useOutletContext } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import type { WaiverSubmission } from "../../types/admin";
import { useSeed } from "../../context/SeedContext";
import { parseFieldId } from "../../utils/parsers";
import DataGrid from "../../components/grid/DataGrid";
import SubmissionCard from "../../components/SubmissionCard";

const MIN_DESKTOP_WIDTH = 821;

const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= MIN_DESKTOP_WIDTH : false
  );

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= MIN_DESKTOP_WIDTH);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isDesktop;
};

const getMatchingKeys = (submission: WaiverSubmission, query: string): string[] => {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return [];

  const matchingKeys: string[] = [];

  submission.signers.forEach((signer) => {
    Object.entries(signer.fieldValues).forEach(([fieldId, value]) => {
      const { type, id, subtype } = parseFieldId(fieldId);
      const label = (subtype?.fieldName ?? `${type}-${id}`)
        .replace(/([A-Z])/g, " $1")
        .toLowerCase();

      if (label.includes(lowerQuery) || String(value).toLowerCase().includes(lowerQuery)) {
        matchingKeys.push(fieldId);
      }
    });
  });

  return matchingKeys;
};

const Submission = () => {
  const { templateId } = useParams();
  const { waiverSubmissions } = useOutletContext<{ waiverSubmissions: WaiverSubmission[] }>();
  const seed = useSeed();
  const [search, setSearch] = useState("");
  const isDesktop = useIsDesktop();

  const filtered = useMemo(() => {
    return waiverSubmissions
      .filter((w) => w.templateId === templateId)
      .map((submission) => ({
        submission,
        matchedKeys: getMatchingKeys(submission, search),
      }))
      .filter(({ matchedKeys }) => matchedKeys.length > 0 || !search.trim());
  }, [search, waiverSubmissions, templateId]);

  const dataGridRows = filtered.map(({ submission }) => {
  return submission.signers.reduce((acc, signer) => {
      return { ...acc, ...signer.fieldValues };
    }, {});
  });
  
  const title = seed.waiverTemplates?.[templateId!]?.title || "Unknown Template";

  return (
    <div>
      <div className="w-fit">
        <h1 className="text-xl font-semibold mb-4">
          {title} Submissions
          <p className="text-red-500 text-sm">
            {title === "Unknown Template" ? "Verify a title exists for this template" : ""}
          </p>
        </h1>

        <input
          type="text"
          placeholder="Search by field or value..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4 min-w-[255px]"
        />
      </div>

      {isDesktop ? (
        <DataGrid data={dataGridRows} />
      ) : (
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center text-sm text-gray-500">
              No matching submissions.
            </div>
          ) : (
            filtered.map(({ submission, matchedKeys }, idx) => (
              <SubmissionCard key={idx} submission={submission} highlightKeys={matchedKeys} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Submission;