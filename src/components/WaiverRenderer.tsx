import React, { useState } from 'react';

interface WaiverToken {
  type: string;
}

interface WaiverRendererProps {
  content: (string | WaiverToken)[];
  name: string;
  signatureElement: React.JSX.Element;
  onFieldInteract: (fieldName: string, fieldId: string) => void;
}

export default function WaiverRenderer({
  content,
  name,
  signatureElement,
  onFieldInteract,
}: WaiverRendererProps) {
  const [interactions, setInteractions] = useState<Record<string, boolean>>({});
  const fieldCounters: Record<string, number> = {};
  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const handleFieldClick = (type: string, fieldId: string) => {
    if (!interactions[fieldId]) {
      setInteractions((prev) => ({ ...prev, [fieldId]: true }));
      onFieldInteract(type, fieldId);
    }
  };

  return (
    <div className="space-y-2 text-left">
      {content.map((chunk, index) => {
        if (typeof chunk === 'string') return <span key={index}>{chunk}</span>;

        const count = (fieldCounters[chunk.type] = (fieldCounters[chunk.type] || 0) + 1);
        const fieldId = `${chunk.type}-${count}`;
        const interacted = interactions[fieldId];

        switch (chunk.type) {
          case 'signature':
            return (
              <span
                key={index}
                onClick={() => handleFieldClick('signature', fieldId)}
                className="inline-block min-w-[150px] border-b border-gray-500 text-gray-400 italic cursor-pointer"
              >
                {interacted ? signatureElement : 'Click to sign'}
              </span>
            );

          case 'name':
            return <strong key={index}>{name}</strong>;

          case 'date':
            return (
              <span
                key={index}
                onClick={() => handleFieldClick('date', fieldId)}
                className="inline-block min-w-[150px] border-b border-gray-500 text-gray-400 italic cursor-pointer"
              >
                {interacted ? currentDate : 'Click to date'}
              </span>
            );

          default:
            return (
              <span key={index} className="text-red-500 italic">
                [Unknown field: {chunk.type}]
              </span>
            );
        }
      })}
    </div>
  );
}
