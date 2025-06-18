import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  type JSX,
} from "react";
import type { WaiverToken, FieldDefinition, SubType } from "../types/waiver";
import { useSigner } from "../context/SignerContext";

interface SeedData {
  fieldDefinitions: Record<string, FieldDefinition>;
}

interface WaiverRendererProps {
  content: (string | WaiverToken)[];
  name: string;
  signatureElement: React.ReactNode;
  onFieldInteract: (fieldName: string, fieldId: string) => void;
  onFieldValueChange: (
    fieldId: string,
    value: string | React.ReactNode,
  ) => void;
  seed: SeedData;
}

export type TokenChunk = WaiverToken & {
  //Extends WaiverToken
  variant: "field";
  key: string;
  fieldId: string;
  fieldDef: FieldDefinition;
  value: string | React.ReactNode;
  interacted: boolean;
  setValue?: (val: string) => void;
  onClick: () => void;
};

export type ReservedChunk = {
  variant: "text" | "br";
  value: string;
  key: string;
};

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

  const currentDate = new Date().toISOString().split("T")[0];

  const { signer, update, signerList } = useSigner();

  // Handle field click (first interaction triggers prefill for some types)
  const handleFieldClick = useCallback(
    (type: string, fieldId: string, subtype?: SubType) => {
      if (!interactions[fieldId]) {
        setInteractions((prev) => ({ ...prev, [fieldId]: true }));
        onFieldInteract(type, fieldId);

        // Prefill logic on first interaction (name, date:current, signature)
        if (type === "name") {
          onFieldValueChange(fieldId, name);
        } else if (type === "date" && subtype?.fieldName) {
          onFieldValueChange(fieldId, currentDate);
        } else if (type === "signature") {
          onFieldValueChange(fieldId, name);
        }
        // Other types handled by user input events
      }
    },
    [
      interactions,
      onFieldInteract,
      onFieldValueChange,
      name,
      currentDate,
      signatureElement,
    ],
  );

  // Handle date field changes
  const setDateValue = useCallback(
    (fieldId: string, val: string) => {
      setDateValues((prev) => ({ ...prev, [fieldId]: val }));
      onFieldValueChange(fieldId, val);
    },
    [onFieldValueChange],
  );

  // Handle generic input-like fields change
  const setInputValue = useCallback(
    (fieldId: string, val: string) => {
      setInputValues((prev) => ({ ...prev, [fieldId]: val }));
      onFieldValueChange(fieldId, val);
    },
    [onFieldValueChange],
  );

  /**
   * Resolves the value for a field, prioritizing:
   * 1) local (in-progress) value from current signer input state
   * 2) saved value from previous signers in signerList.fieldValues
   * 3) undefined if none found
   */
  function resolveValue<T>(
    local: T | undefined, //render local if available
    currentSignerId: string,
    fieldId: string,
    fieldSignerId?: string, // who owns the field
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

  //Create Reserved and Token Chunks from Content
  const mapContentToChunks = (): (ReservedChunk | TokenChunk)[] => {
    return content.map((chunk, index) => {
      //ReservedChunk
      if (typeof chunk === "string") {
        return {
          variant: "text",
          value: chunk,
          key: `text-${index}`,
        };
      }

      if (chunk.type === "br") {
        return {
          variant: "br",
          value: "",
          key: `br-${index}`,
        };
      }

      //Token Chunk
      const { type, id, signerId, subtype, meta } = chunk;
      const fieldName = subtype?.fieldName;
      const fieldId = `${type}-${fieldName ?? id}`;
      const interacted = interactions[fieldId];
      const onClick = () =>
        handleFieldClick(type, fieldId, subtype ?? undefined);

      let value: string | React.ReactNode = "";
      let setValue: ((val: string) => void) | undefined;
      console.log(type);

      if (type === "name" && signerId === signer.id) {
        // simulate click if name is filled
        handleFieldClick(type, fieldId);
      }

      switch (type) {
        case "date": {
          value =
            fieldName === "current"
              ? currentDate
              : resolveValue(dateValues[fieldId], signer.id, fieldId) || "";
          setValue = (val: string) => setDateValue(fieldId, val);
          break;
        }
        case "input":
        case "checkbox":
        case "radio":
        case "dropdown":
        case "textarea": {
          value = resolveValue(inputValues[fieldId], signer.id, fieldId) || "";
          setValue = (val: string) => setInputValue(fieldId, val);
          break;
        }
        case "name": {
          if (signerId === signer.id) {
            value = signer.fieldValues?.[fieldId] || "";
          } else if (signerId) {
            const index = signerId.match(/-(\d+)$/)?.[1];
            const fieldKey = `name-${index}`;
            const ownerSigner = signerList.find(
              (signer) => signer.id === signerId,
            );
            value = ownerSigner?.fieldValues?.[fieldKey] || "";
          }
          break;
        }
        case "signature": {
          const sigKey = `signature-${subtype?.fieldName ?? id}`;
          const ownerSigner = signerList.find(
            (signer) => signer.id === signerId,
          );
          value =
            signerId === signer.id
              ? signer.fieldValues?.[sigKey] || ""
              : ownerSigner?.fieldValues?.[sigKey] || "";
          break;
        }
      }

      return {
        id,
        type,
        signerId,
        subtype,
        meta,
        variant: "field",
        key: fieldId,
        fieldId,
        fieldDef: seed.fieldDefinitions[type],
        value,
        interacted,
        onClick,
        setValue,
      };
    });
  };

  //Map ref to all chunks from content
  const contentChunks = useMemo(() => {
    if (!content) return [];
    return mapContentToChunks();
  }, [content]);

  //Build renderable chunk elements from content chunks
  const buildRenderableChunks = (
    chunks: (TokenChunk | ReservedChunk)[],
  ): JSX.Element[] => {
    return chunks.map((chunk, index) => {
      if (chunk.variant === "text") {
        return <span key={chunk.key}>{chunk.value}</span>;
      }

      if (chunk.variant === "br") {
        return <span key={chunk.key} className="block my-3" />;
      }

      // Handle TokenChunk (field)
      if (chunk.variant === "field") {
        const {
          key,
          fieldId,
          fieldDef,
          interacted,
          onClick,
          value,
          setValue,
          subtype,
          meta,
        } = chunk;

        if (!fieldDef) {
          return (
            <span key={`unknown-${fieldId}`} className="text-red-500 italic">
              [Unknown field: {fieldId}]
            </span>
          );
        }

        return (
          <span key={key} className="inline-block align-baseline">
            {fieldDef.render(
              interacted,
              fieldId,
              onClick,
              value,
              setValue,
              subtype,
              meta,
            )}
          </span>
        );
      }

      // Fallback for unexpected variants
      return (
        <span key={`unknown-${index}`} className="text-red-500 italic">
          [Unknown variant]
        </span>
      );
    });
  };

  //Map ref to renderable chunk elements
  const renderableChunks = useMemo(() => {
    return buildRenderableChunks(contentChunks);
  }, [contentChunks, seed]);

  //Grab all token chunks from content
  const extractTokenChunksFromContent = (): TokenChunk[] => {
    return contentChunks.filter(
      (chunk): chunk is TokenChunk =>
        chunk.variant !== "text" && chunk.variant !== "br",
    );
  };

  //Define signer required fields from token chunk and current signer
  const signerRequiredFields = useMemo(() => {
    return extractTokenChunksFromContent()
      .filter((chunk): chunk is TokenChunk => chunk.variant === "field")
      .filter((token) => token.signerId === signer.id);
  }, [contentChunks, signer.id]);

  //Ensure tokens aren't the same before saving
  function areTokensEqual(chunkA: TokenChunk[], chunkB: TokenChunk[]): boolean {
    if (chunkA.length !== chunkB.length) return false;
    return chunkA.every((tokenA, i) => {
      const tokenB = chunkB[i];
      return (
        tokenA.type === tokenB.type &&
        tokenA.id === tokenB.id &&
        tokenA.signerId === tokenB.signerId &&
        JSON.stringify(tokenA.subtype) === JSON.stringify(tokenB.subtype)
      );
    });
  }

  //Update current signer required fields
  useEffect(() => {
    if (!areTokensEqual(signer.requiredFields, signerRequiredFields)) {
      update({ requiredFields: signerRequiredFields });
    }
  }, [signerRequiredFields, signer.requiredFields, update]);

  return <div className="text-left">{renderableChunks}</div>;
};

export default WaiverRenderer;
