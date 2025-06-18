export type WaiverRow = {
  [fieldId: string]: any; // values can be string or anything else (e.g., React elements)
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

  // New: full signer group replaces submittedBy, touched, values
  signers: {
    id: string;
    name?: string;
    agreedToTerms?: boolean;
    fieldValues: Record<string, any>; // Firestore-safe values
    touched?: Record<string, boolean>;
  }[];
}

export type FirestoreValue =
  | string
  | number
  | boolean
  | null
  | Date
  | FirestoreValue[] // optional, for arrays
  | { [key: string]: FirestoreValue }; // optional, for nested objects

export type FirestoreValues = Record<string, FirestoreValue>;

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
  selectedTemplateTitle: string | null;
  setSelectedTemplateTitle: (title: string) => void;
}
