import React, { useState, useEffect, useCallback, useMemo } from 'react';

import type { WaiverToken, FieldDefinition, SubType } from '../types/waiver';
import type { Signer } from '../hooks/useSignerManager';
import { useSigner } from '../context/SignerContext';

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

function extractChunks(content: (string | WaiverToken)[]): WaiverToken[] {
  return content.filter(
    (chunk): chunk is WaiverToken => typeof chunk !== 'string' && chunk.type !== 'br'
  );
}

/**
 * Resolves the value for a field, prioritizing:
 * 1) local (in-progress) value from current signer input state
 * 2) saved value from previous signers in signerList.fieldValues
 * 3) undefined if none found
 */
function resolveValue<T>(
  local: T | undefined,
  signerList: Signer[],
  currentSignerId: string,
  fieldId: string,
  fieldSignerId?: string // who owns the field
): T | undefined {
  if (!fieldSignerId) {
    fieldSignerId = currentSignerId;
  }

  // Find the owner index
  const ownerIndex = signerList.findIndex((s) => s.id === fieldSignerId);
  if (ownerIndex === -1) return undefined;

  // If the current signer owns this field:
  if (fieldSignerId === currentSignerId) {
    // Use local value only if present
    if (local !== undefined && local !== null) return local;

    // Else fallback backwards to prior signers
    for (let i = ownerIndex - 1; i >= 0; i--) {
      const prev = signerList[i];
      const value = prev.fieldValues?.[fieldId];
      if (value !== undefined && value !== null) {
        return value as T;
      }
    }

    return undefined;
  }

  // If this field belongs to a prior signer, always return their saved value,
  // **never** local current signer value!
  const owner = signerList[ownerIndex];
  return owner.fieldValues?.[fieldId];
}



const WaiverRenderer = ({
  content,
  name,
  signatureElement,
  onFieldInteract,
  onFieldValueChange,
  seed,
}: WaiverRendererProps): React.JSX.Element => {
  // Track which fields have been interacted with
  const [interactions, setInteractions] = useState<Record<string, boolean>>({});

  // Local state for current signer input values (in-progress)
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [dateValues, setDateValues] = useState<Record<string, string>>({}); // For date fields

  const currentDate = new Date().toISOString().split('T')[0];

  const { signer, update, signerList } = useSigner();

  // Extract field chunks from content on change
  const chunks = useMemo(() => {
    if (!content) return [];
    return extractChunks(content);
  }, [content]);

  const signerRequiredFields = useMemo(() => {
    return chunks
      .filter((chunk): chunk is WaiverToken => typeof chunk !== 'string')
      .filter(token => token.signerId === signer.id);
  }, [chunks, signer.id]);


  function areTokensEqual(a: WaiverToken[], b: WaiverToken[]): boolean {
    if (a.length !== b.length) return false;
    return a.every((tokenA, i) => {
      const tokenB = b[i];
      return (
        tokenA.type === tokenB.type &&
        tokenA.id === tokenB.id &&
        tokenA.signerId === tokenB.signerId &&
        JSON.stringify(tokenA.subtype) === JSON.stringify(tokenB.subtype)
      );
    });
  }

  useEffect(() => {
    if (!areTokensEqual(signer.requiredFields, signerRequiredFields)) {
      update({ requiredFields: signerRequiredFields });
    }
  }, [signerRequiredFields, signer.requiredFields, update]);

  // Handle field click (first interaction triggers prefill for some types)
  const handleFieldClick = useCallback(
    (type: string, fieldId: string, subtype?: SubType) => {
      if (!interactions[fieldId]) {
        setInteractions((prev) => ({ ...prev, [fieldId]: true }));
        onFieldInteract(type, fieldId);

        // Prefill logic on first interaction (for name, date:current, signature)
        if (type === 'name') {
          onFieldValueChange(fieldId, name);
        } else if (type === 'date' && subtype?.fieldName) {
          onFieldValueChange(fieldId, currentDate);
        } else if (type === 'signature') {
          onFieldValueChange(fieldId, name);
        }
        // Other types handled by user input events
      }
    },
    [interactions, onFieldInteract, onFieldValueChange, name, currentDate, signatureElement]
  );

  // Handle date field changes
  const setDateValue = useCallback(
    (fieldId: string, val: string) => {
      setDateValues((prev) => ({ ...prev, [fieldId]: val }));
      onFieldValueChange(fieldId, val);
    },
    [onFieldValueChange]
  );

  // Handle generic input-like fields change
  const setInputValue = useCallback(
    (fieldId: string, val: string) => {
      setInputValues((prev) => ({ ...prev, [fieldId]: val }));
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

        const { type, id, signerId, subtype, meta } = chunk;
        const fieldName = subtype?.fieldName;
        const fieldId = `${type}-${fieldName ?? id}`;

        console.log("SIGNER ID FOR CHUNK: ", signerId, "SIGNER ID FOR SIGNER: ", signer.id)

        const interacted = interactions[fieldId];
        const onClick = () => handleFieldClick(type, fieldId, subtype ?? undefined);
        const fieldDef = seed.fieldDefinitions[type];

        if (!fieldDef) {
          return (
            <span key={index} className="text-red-500 italic">
              [Unknown field: {type}]
            </span>
          );
        }

        if(type === "name" && signerId === signer.id) {
          //simulate click if name is filled
          handleFieldClick(type, fieldId)
        }

        // Resolve value prioritizing local input > prior signers saved values
        let value: string | React.ReactNode | undefined;
        let setValue: ((val: string) => void) | undefined;

        switch (type) {
          case 'date': {
            if (fieldName === 'current') {
              value = currentDate;
            } else {
              value = resolveValue(dateValues[fieldId], signerList, signer.id, fieldId) || '';
              setValue = (val: string) => setDateValue(fieldId, val);
            }
            break;
          }
          case 'input':
          case 'checkbox':
          case 'radio':
          case 'dropdown':
          case 'textarea': {
            value = resolveValue(inputValues[fieldId], signerList, signer.id, fieldId) || '';
            setValue = (val: string) => setInputValue(fieldId, val);
            break;
          }
          case 'name': {
            let localValue: string | undefined = '';

            if (signerId === signer.id) {
              // Current signer — use their own fieldValues
              localValue = signer.fieldValues?.[fieldId];
            } else if (signerId) {
              // Other signer — parse index from signerId
              const indexMatch = signerId.match(/-(\d+)$/);
              const index = indexMatch ? indexMatch[1] : null;

              if (index) {
                const fieldKey = `name-${index}`;
                const ownerSigner = signerList.find(s => s.id === signerId);
                if (ownerSigner) {
                  localValue = ownerSigner.fieldValues?.[fieldKey] || '';
                }
              }
            }

            value = localValue || '';
            break;
          }
          case 'signature': {
            const fieldKey = `signature-${subtype?.fieldName ?? id}`;
            const ownerSigner = signerList.find(s => s.id === signerId);

            let localValue = '';

            if (signerId === signer.id) {
              localValue = signer.fieldValues?.[fieldKey] || '';
            } else if (ownerSigner) {
              localValue = ownerSigner.fieldValues?.[fieldKey] || '';
            }

            value = localValue; // this is raw string now

            break;
          }
        }


        return (
          <span key={`${fieldId}-${index}`} className="inline-block align-baseline">
            {fieldDef.render(interacted, fieldId, onClick, value, setValue, subtype, meta)}
          </span>
        );
      })}
    </div>
  );
};

export default WaiverRenderer;
