export type WaiverRow = {
  [fieldId: string ]: any;  // values can be string or anything else (e.g., React elements)
};

export type Column = {
  key: string;             // The key in the data object to display (e.g., "name")
  label: string;            // The header label shown in the table (e.g., "Name")
  filterable?: boolean;     // Whether to show a filter input for this column
};

export interface DataGridProps {
  data: Record<string, any>[];
}

export interface WaiverSubmission {
  seedId: string;
  templateId: string;
  timestamp: string;
  submittedBy: {
    name: string;
    signatureElement: any;
    agreed: boolean;
  };
  touched: Record<string, boolean>;
  values: Record<string, any>;
}


