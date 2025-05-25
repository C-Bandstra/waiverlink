export type Waiver = {
  id: string
  businessId: string
  templateId: string
  guestId: string
  fields: Record<string, any>
  signature: string
  signedAt: string
}

export interface WaiverToken {
  type: string; // e.g., "name", "signature", "date", "input"
  id: number;  // count of this type in the waiver string (1-based)
  subtype?: string | null;  // optional subtype or identifier (e.g., "boardModel")
}

export interface FieldDefinition {
  render: (
    interacted: boolean,
    fieldId: string,
    onClick: () => void,
    value?: string | React.ReactNode,
    setValue?: (val: string) => void,
    subtype?: string | null
  ) => React.ReactNode;
}

