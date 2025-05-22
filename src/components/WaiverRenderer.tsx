import React, { useState } from 'react';

interface WaiverRendererProps {
  content: string;
  name: string;
  signatureElement: React.JSX.Element;
  onFieldInteract: (fieldName: string, i: number) => void;
}

export default function WaiverRenderer({ content, name, signatureElement, onFieldInteract }: WaiverRendererProps) {
  const [signedIndexes, setSignedIndexes] = useState<number[]>([]);

  const parts = content.split(/({{name}}|{{signature}}|{{date}})/g);
  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  console.log(signedIndexes)

  return (
    <div className="space-y-2 text-left">
      {parts.map((part, i) => {
        if (part === '{{name}}') {
          return <strong key={i}>{name}</strong>;
        }

        if (part === '{{signature}}') {
          const isSigned = signedIndexes.includes(i);
          return (
            <span
              key={i}
              onClick={() => {
                if (!isSigned) {
                  setSignedIndexes([...signedIndexes, i]);
                  onFieldInteract('signature', i);
                }
              }}
              className="inline-block min-w-[150px] border-b border-gray-500 text-gray-400 italic cursor-pointer"
            >
              {isSigned ? signatureElement : 'Click to sign'}
            </span>
          );
        }

        if (part === '{{date}}') {
          const isDated = signedIndexes.includes(i);
          return (
            <span
              key={i}
              onClick={() => {
                if (!isDated) {
                  setSignedIndexes([...signedIndexes, i]);
                  onFieldInteract('date', i);
                }
              }}
              className="inline-block min-w-[150px] border-b border-gray-500 text-gray-400 italic cursor-pointer"
            >
              {isDated ? currentDate : 'Click to date'}
            </span>
          );
        }

        return <span key={i}>{part}</span>;
      })}
    </div>
  );
}