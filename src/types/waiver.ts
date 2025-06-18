export interface WaiverTemplate {
  id: string;
  title: string;
  groupingId: string;
  content: string;
}

export type Waiver = {
  id: string;
  businessId: string;
  templateId: string;
  guestId: string;
  fields: Record<string, any>;
  signature: string;
  signedAt: string;
};

export interface WaiverProps {
  // setNotifications: React.Dispatch<React.SetStateAction<string>>;
}

export interface WaiverToken {
  type: string; // "input", "signature", etc.
  id: number; // Unique ID for each token type
  signerId?: string; // e.g., "signer-1" (parsed from [signer-X])
  subtype?: SubType; // Parsed subtype details
  meta?: Record<string, string>; // Optional metadata parsed from '|'
}

export interface SubType {
  fieldName: string | null;
  options: string[];
  label: string | null;
}

export interface FieldDefinition {
  render: (
    interacted: boolean,
    fieldId: string,
    onClick: () => void,
    value?: string | React.ReactNode,
    setValue?: (val: string) => void,
    subtype?: SubType,
    meta?: Record<string, string>,
  ) => React.ReactNode;
}

export type SignerRequiredField = {
  type: string;
  id: number;
  subtype: SubType; // Must be present (not nullable)
};
