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
  type: string;
  id: number;
  subtype?: string | null;
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

