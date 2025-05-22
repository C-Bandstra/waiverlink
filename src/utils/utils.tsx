import type { JSX } from 'react';
import { useState } from 'react';

export function renderWaiver(content: string, name: string, signatureElement: JSX.Element) {

  const [signedIndexes, setSignedIndexes] = useState<number[]>([]);

  const parts = content.split(/({{name}}|{{signature}})/g);
  
  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

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
                if (!isSigned) setSignedIndexes([...signedIndexes, i]);
              }}
              className="inline-block min-w-[150px] border-b border-gray-500 text-gray-400 italic cursor-pointer"
            >
              {isSigned ? signatureElement : 'Click to sign'}
            </span>
          );
        }
        if (part === '{{date}}') {
          
        }

        return <span key={i}>{part}</span>;
      })}
    </div>
  );
}