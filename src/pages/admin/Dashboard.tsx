import { useState, useMemo, useEffect } from "react";
import DataGrid from "../../components/grid/DataGrid";
import SubmissionCard from "../../components/SubmissionCard";
import type { WaiverSubmission } from "../../types/admin";
import { parseFieldId } from "../../utils/parsers";

//Data will be supplied by waiver submissions; waiver context before DB writes
const waiverData = {
  title: "Assumption of Risk",
  submissions: [
    {
      seedId: "never_summer",
      templateId: "demo",
      timestamp: "2025-05-28T00:36:28.099Z",
      submittedBy: { 
        name: "Charlie Bandstra",
        signatureElement: "<p>Signature</p>",
        agreed: true, //waiverlink terms NOT business waiver terms
      },
      values: {
        "name-signeeName": "Charlie Bandstra",
        "input-boardModel": "Eclipse",
        "dropdown-riderLevel": "Advanced",
        "radio-shirtSize": "Large",
        "date-birthDate": "2010-07-14",
        "input-guardian": "Josh Bandstra",
        "textarea-concerns": "High Blood Pressure",
        "checkbox-agreeToTerms": "true"
      },
      touched: {
        test: true
      }
    },
    {
      seedId: "never_summer",
      templateId: "demo",
      timestamp: "2025-05-28T00:36:28.099Z",
      submittedBy: { 
        name: "Charlie Bandstra",
        signatureElement: "<p>Signature</p>",
        agreed: true, //waiverlink terms NOT business waiver terms 
      },
      values: {
        "name-signeeName": "Charlie Bandstra",
        "input-boardModel": "Eclipse",
        "dropdown-riderLevel": "Advanced",
        "radio-shirtSize": "Small",
        "date-birthDate": "2010-07-14",
        "input-guardian": "Josh Bandstra",
        "textarea-concerns": "High Blood Pressure testing a long concern just to see how the document responds to this Pressure testing a long concern just to see how the document responds to this",
        "checkbox-agreeToTerms": "true"
      },
      touched: {
        test: true
      }
    },
    {
      seedId: "never_summer",
      templateId: "demo",
      timestamp: "2025-05-27T18:45:11.229Z",
      submittedBy: { 
        name: "Alice Johnson",
        signatureElement: "<p>Signature</p>",
        agreed: true, //waiverlink terms NOT business waiver terms
      },
      values: {
        "name-signeeName": "Alice Johnson",
        "input-boardModel": "Proto Slinger",
        "dropdown-riderLevel": "Beginner",
        "radio-shirtSize": "Large",
        "date-birthDate": "2012-03-10",
        "input-guardian": "Lara Johnson",
        "textarea-concerns": "None",
        "checkbox-agreeToTerms": "true"
      },
      touched: {
        test: true
      }
    },
    {
      seedId: "never_summer",
      templateId: "demo",
      timestamp: "2025-05-27T12:22:03.515Z",
      submittedBy: { 
        name: "Bob Stone",
        signatureElement: "<p>Signature</p>",
        agreed: true, //waiverlink terms NOT business waiver terms
      },
      values: {
        "name-signeeName": "Bob Stone",
        "input-boardModel": "Swift",
        "dropdown-riderLevel": "Intermediate",
        "radio-shirtSize": "Medium",
        "date-birthDate": "2008-11-23",
        "input-guardian": "N/A",
        "textarea-concerns": "Asthma",
        "checkbox-agreeToTerms": "false"
      },
      touched: {
        test: true
      }
    }
  ]
}

const MIN_DESKTOP_WIDTH = 800;

// --- Responsive check ---
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

// --- Match search query ---
const getMatchingKeys = (submission: WaiverSubmission, query: string): string[] => {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return [];

  return Object.entries(submission.values)
    .filter(([fieldId, value]) => {
      const { type, id, subtype } = parseFieldId(fieldId);
      const label = (subtype ?? `${type}-${id}`)
        .replace(/([A-Z])/g, " $1")
        .toLowerCase();

      return label.includes(lowerQuery) || String(value).toLowerCase().includes(lowerQuery);
    })
    .map(([key]) => key);
};

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const isDesktop = useIsDesktop();

  // Filtered submissions with search matches
  const filteredSubmissions = useMemo(() => {
    return waiverData.submissions
      .map((submission) => ({
        submission,
        matchedKeys: getMatchingKeys(submission, search),
      }))
      .filter(({ matchedKeys }) => matchedKeys.length > 0 || !search.trim());
  }, [search, waiverData.submissions]);

  // Flattened for desktop grid
  const dataGridRows = useMemo(() => {
    return filteredSubmissions.map(({ submission }) => submission.values);
  }, [filteredSubmissions]);

  return (
    <div className="p-4">
      <div className="max-w-[fit-content]">
        <h1 className="text-xl font-semibold mb-4">
          {`${waiverData.title} Submissions`}
        </h1>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by field or value..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm min-w-[300px]"
          />
        </div>
      </div>

      {isDesktop ? (
        <DataGrid data={dataGridRows} />
      ) : (
        <div className="space-y-4">
          {filteredSubmissions.length === 0 ? (
            <div className="text-center text-sm text-gray-500">
              No matching submissions.
            </div>
          ) : (
            filteredSubmissions.map(({ submission, matchedKeys }, idx) => (
              <SubmissionCard
                key={idx}
                submission={submission}
                highlightKeys={matchedKeys}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;