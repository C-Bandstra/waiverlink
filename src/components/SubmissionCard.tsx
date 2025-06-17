import React, { useState, useEffect } from "react";
import type { SubmissionCardProps } from "../types/admin";
import { parseFieldId } from "../utils/parsers";
import logo from "../assets/sample-document.png";
import { Timestamp } from "firebase/firestore";
import { renderValue } from "../utils/helpers";

const SubmissionCard: React.FC<SubmissionCardProps> = ({
  submission,
  highlightKeys = [],
}) => {
  const { signers, timestamp } = submission;

  const [expandedSignerIds, setExpandedSignerIds] = useState<Record<string, boolean>>({});
  const [showImage, setShowImage] = useState(false);

  const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);

  useEffect(() => {
    const checkWidth = () => {
      setShowImage(window.innerWidth >= 390);
    };
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  // Function to get sorted entries per signer
  const getOrderedEntries = (signer: typeof signers[number]) => {
    const entries = Object.entries(signer.fieldValues);
    const prioritized = highlightKeys
      .map((key) => entries.find(([entryKey]) => entryKey === key))
      .filter(Boolean) as [string, any][];
    const remaining = entries.filter(([key]) => !highlightKeys.includes(key));
    return [...prioritized, ...remaining];
  };

  return (
    <div className="rounded-xl shadow p-4 bg-white border flex flex-col gap-6 max-w-[550px]">
      {signers.map((signer, index) => {
        const orderedEntries = getOrderedEntries(signer);
        const isExpanded = expandedSignerIds[signer.id] ?? false;
        const visibleEntries = isExpanded ? orderedEntries : orderedEntries.slice(0, 3);

        const toggleExpand = () => {
          setExpandedSignerIds((prev) => ({
            ...prev,
            [signer.id]: !prev[signer.id],
          }));
        };

        return (
          <div key={signer.id} className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <div className="mb-2 text-lg font-semibold text-gray-800">{signer.name}</div>
              <div className="text-sm text-gray-500 mb-3">{date.toLocaleString()}</div>
              <div className="space-y-1">
                {visibleEntries.map(([fieldId, value]) => {
                  const { subtype, type, id } = parseFieldId(fieldId);
                  const baseLabel = subtype?.fieldName ?? `${type}-${id}`;
                  const readableLabel = baseLabel.replace(/([A-Z])/g, " $1").toLowerCase();

                  return (
                    <div key={fieldId} className="text-sm text-gray-700">
                      <span className="font-medium">{readableLabel}:</span>{" "}
                      {renderValue(value, type)}
                    </div>
                  );
                })}

                {orderedEntries.length > 3 && (
                  <button
                    onClick={toggleExpand}
                    className="text-blue-600 hover:underline text-sm mt-2"
                  >
                    {isExpanded ? "View Less" : "View More"}
                  </button>
                )}
              </div>
            </div>

            {/* Only show image for the first signer or conditionally via ID */}
            {showImage && index === 0 && (
              <img
                src={logo}
                alt="Related submission image"
                className="border max-w-[150px] ml-4"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SubmissionCard;
