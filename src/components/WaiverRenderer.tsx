import React, { useState, useCallback } from 'react';

interface WaiverToken {
  type: string;
  subtype?: string; // optional, for input types like 'boardModel'
}

interface FieldDefinition {
  render: (
    interacted: boolean,
    fieldId: string,
    onClick: () => void,
    value?: string | React.ReactNode,
    setValue?: (val: string) => void,
    subtype?: string
  ) => React.ReactNode;
}

interface SeedData {
  fieldDefinitions: Record<string, FieldDefinition>;
}

interface WaiverRendererProps {
  content: (string | WaiverToken)[];
  name: string;
  signatureElement: React.ReactNode;
  onFieldInteract: (fieldName: string, fieldId: string) => void;
  seed: SeedData;
}

const WaiverRenderer = ({
  content,
  name,
  signatureElement,
  onFieldInteract,
  seed,
}: WaiverRendererProps): React.JSX.Element => {
  const [interactions, setInteractions] = useState<Record<string, boolean>>({});
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const currentDate = new Date().toISOString().split('T')[0];

  const handleFieldClick = useCallback(
    (type: string, fieldId: string) => {
      if (!interactions[fieldId]) {
        setInteractions((prev) => ({ ...prev, [fieldId]: true }));
        onFieldInteract(type, fieldId);
      }
    },
    [interactions, onFieldInteract]
  );

  const setInputValue = useCallback((fieldId: string, val: string) => {
    setInputValues((prev) => ({ ...prev, [fieldId]: val }));
  }, []);

  const fieldCounters: Record<string, number> = {};

  return (
    <div className="space-y-2 text-left">
      {content.map((chunk, index) => {
        if (typeof chunk === 'string') return <span key={index}>{chunk}</span>;

        const { type, subtype } = chunk;
        const count = (fieldCounters[type] = (fieldCounters[type] || 0) + 1);
        const fieldId = `${type}-${count}`;
        const interacted = interactions[fieldId];
        const onClick = () => handleFieldClick(type, fieldId);

        const fieldDef = seed.fieldDefinitions[type];
        if (!fieldDef) {
          return (
            <span key={index} className="text-red-500 italic">
              [Unknown field: {type}]
            </span>
          );
        }

        let value: any;
        let setValue: ((val: any) => void) | undefined;

        switch (type) {
          case 'name':
            value = name;
            break;
          case 'date':
            value = currentDate;
            break;
          case 'signature':
            value = signatureElement;
            break;
          case 'input':
            value = inputValues[fieldId] || '';
            setValue = (val: string) => setInputValue(fieldId, val);
            break;
        }

        return fieldDef.render(interacted, fieldId, onClick, value, setValue, subtype);
      })}
    </div>
  );
}

export default WaiverRenderer;

