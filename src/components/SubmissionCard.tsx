import React, { useState, useEffect } from "react";
import type { SubmissionCardProps } from "../types/admin";
import { parseFieldId } from "../utils/parsers";
import logo from "../assets/sample-document.png";
import { Timestamp } from 'firebase/firestore';

const SubmissionCard: React.FC<SubmissionCardProps> = ({
  submission,
  highlightKeys = [],
}) => {
  const { submittedBy, timestamp, values } = submission;
  const [isExpanded, setIsExpanded] = useState(false);
  const [showImage, setShowImage] = useState(false);


  const date = timestamp instanceof Timestamp
    ? timestamp.toDate()
    : new Date(timestamp);

  useEffect(() => {
    const checkWidth = () => {
      setShowImage(window.innerWidth >= 390); // show image if window width >= 600px
    };
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  const entries = Object.entries(values);

  // Reorder entries: prioritized keys first, then the rest (preserving original order)
  const prioritized = highlightKeys
    .map((key) => entries.find(([entryKey]) => entryKey === key))
    .filter(Boolean);

  const remaining = entries.filter(([key]) => !highlightKeys.includes(key));

  const orderedEntries: [string, any][] = [
    ...prioritized.filter((e): e is [string, any] => Array.isArray(e)),
    ...remaining,
  ];

  const visibleEntries = isExpanded ? orderedEntries : orderedEntries.slice(0, 3);

  return (
    <div className="rounded-xl shadow p-4 bg-white border flex justify-between items-start max-w-[550px]">
      <div className="flex-1 min-w-0">
        <div className="mb-2 text-lg font-semibold text-gray-800">
          {submittedBy.name}
        </div>
        <div className="text-sm text-gray-500 mb-3">
          {date.toLocaleString()}
        </div>
        <div className="space-y-1">
          {visibleEntries.map(([fieldId, value]) => {
            const { subtype, type, id } = parseFieldId(fieldId);
            const baseLabel = subtype ?? `${type}-${id}`;
            const readableLabel = baseLabel.replace(/([A-Z])/g, " $1").toLowerCase();
            return (
              <div key={fieldId} className="text-sm text-gray-700">
                <span className="font-medium">{readableLabel}:</span> {value}
              </div>
            );
          })}
          {entries.length > 3 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 hover:underline text-sm mt-2"
            >
              {isExpanded ? "View Less" : "View More"}
            </button>
          )}
        </div>
      </div>

      {showImage && (
        <img
          src={logo}
          alt="Related submission image"
          className="border max-w-[150px]"
        />
      )}
    </div>
  );
};

export default SubmissionCard;
