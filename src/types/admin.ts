export type WaiverRow = {
  [fieldId: string ]: any;  // values can be string or anything else (e.g., React elements)
};

export type Column = {
  key: string;
  label: string;
  filterable?: boolean;
  type?: string; // "text" | "textarea" | "checkbox" | "date" | "number" | "signature";
};

export interface DataGridProps {
  data: Record<string, any>[];
}

export interface WaiverSubmission {
  seedId: string;
  templateId: string;
  timestamp: Date;
  serverTimestamp?: any;
  title: string;
  submittedBy: {
    name: string;
    signatureElement: any;
    agreed: boolean;
  };
  touched: Record<string, boolean>;
  values: Record<string, any>;
}

export type SubmissionCardProps = {
  submission: WaiverSubmission;
  highlightKeys?: string[];
};

export type Template = {
  id: string;
  title: string;
  groupingId: string;
  content: string;
};

export interface DashboardContext {
  waiverSubmissions: WaiverSubmission[];
}





