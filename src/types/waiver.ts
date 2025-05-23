export type Waiver = {
  id: string
  businessId: string
  templateId: string
  guestId: string
  fields: Record<string, any>
  signature: string
  signedAt: string
}

export interface FieldDefinition {
  render: (
    interacted: boolean,
    fieldId: string,
    onClick: () => void,
    value?: React.ReactNode,
    setValue?: (val: string) => void,
    subtype?: string
  ) => React.ReactNode;
}

