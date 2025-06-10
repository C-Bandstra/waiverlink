export type Waiver = {
  id: string
  businessId: string
  templateId: string
  guestId: string
  fields: Record<string, any>
  signature: string
  signedAt: string
}

export interface WaiverProps {
  // setNotifications: React.Dispatch<React.SetStateAction<string>>;
}

export interface WaiverToken {
  type: string;                      // "input", "dropdown", etc.
  id: number;                        // 1-based index of this token type
  subtype?: string | null;          // raw field definition before '|'
  meta?: Record<string, string>;    // parsed metadata like { style: 'highlight' }
}

export interface SubType {
  //Currently not used until issues ironed out; still good for reference
  fieldName: string | null , //fieldName extracted directly after first colon
  options: Array<string> | [] , //options extracted after each colon after the fieldName (:) 
  label: string | null //label extracted after semi-colon(;) (input:fieldName:option1;This is a label)
}

export interface FieldDefinition {
  render: (
    interacted: boolean,
    fieldId: string,
    onClick: () => void,
    value?: string | React.ReactNode,
    setValue?: (val: string) => void,
    subtype?: string | null,
    meta?: Record<string, string>
  ) => React.ReactNode;
}

