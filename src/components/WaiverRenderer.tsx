import React, { useState, useCallback } from 'react';

import type { WaiverToken, FieldDefinition } from '../types/waiver';
import { parseSubtype } from '../utils/parsers';

interface SeedData {
  fieldDefinitions: Record<string, FieldDefinition>;
}

interface WaiverRendererProps {
  content: (string | WaiverToken)[];
  name: string;
  signatureElement: React.ReactNode;
  onFieldInteract: (fieldName: string, fieldId: string) => void;
  onFieldValueChange: (fieldId: string, value: string | React.ReactNode) => void;
  seed: SeedData;
}

const WaiverRenderer = ({
  content,
  name,
  signatureElement,
  onFieldInteract,
  onFieldValueChange,
  seed,
}: WaiverRendererProps): React.JSX.Element => {
  const [interactions, setInteractions] = useState<Record<string, boolean>>({});
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [dateValues, setDateValues] = useState<Record<string, string>>({}); // State for custom date values
  const currentDate = new Date().toISOString().split('T')[0];

  const handleFieldClick = useCallback(
    (type: string, fieldId: string, subtype?: string | null) => {
      if (!interactions[fieldId]) {
        setInteractions((prev) => ({ ...prev, [fieldId]: true }));
        onFieldInteract(type, fieldId);
        if (type === 'name') {
          onFieldValueChange(fieldId, name);
        } else if (type === 'date' && subtype === 'current') {
          onFieldValueChange(fieldId, currentDate);
        } else if (type === 'signature') {
          onFieldValueChange(fieldId, signatureElement);
        }
        // Custom date values are handled via setDateValue
      }
    },
    [interactions, onFieldInteract, onFieldValueChange, name, currentDate, signatureElement]
  );

  const setDateValue = useCallback(
    (fieldId: string, val: string) => {
      setDateValues((prev) => ({ ...prev, [fieldId]: val }));
      onFieldValueChange(fieldId, val);
    },
    [onFieldValueChange]
  );

  return (
    <div className="text-left">
      {content.map((chunk, index) => {
        if (typeof chunk === 'string') {
          return <span key={index}>{chunk}</span>;
        }

        if (chunk.type === 'br') {
          return <span key={index} className="block my-3" />;
        } 

        const { type, id, subtype, meta } = chunk;
        const { fieldName } = parseSubtype(subtype);
        const fieldId = `${type}-${fieldName ?? id}`;

        const interacted = interactions[fieldId];
        const onClick = () => handleFieldClick(type, fieldId, subtype);
        const fieldDef = seed.fieldDefinitions[type];

        if (!fieldDef) {
          return (
            <span key={index} className="text-red-500 italic">
              [Unknown field: {type}]
            </span>
          );
        }

        let value: string | React.ReactNode | undefined;
        let setValue: ((val: string) => void) | undefined;

        switch (type) {
          case 'name':
            value = name;
            break;
          case 'date':
            value = subtype === 'current' ? currentDate : dateValues[fieldId] || '';
            if (subtype !== 'current') {
              setValue = (val: string) => setDateValue(fieldId, val);
            }
            break;
          case 'signature':
            value = signatureElement;
            break;
          case 'input':
          case 'checkbox':
          case 'radio':
          case 'dropdown':
          case 'textarea':
            value = inputValues[fieldId] || '';
            setValue = (val: string) => {
              setInputValues((prev) => ({ ...prev, [fieldId]: val }));
              onFieldValueChange(fieldId, val);
            };
            break;
        }

        return (
          <span key={fieldId} className="inline-block align-baseline">
            {fieldDef.render(interacted, fieldId, onClick, value, setValue, subtype, meta)}
          </span>
        );
      })}
    </div>
  );
};

export default WaiverRenderer;