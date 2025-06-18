export type Guest = {
  id: string;
  name?: string;
  createdAt: string;
  metadata?: Record<string, any>;
  converted: boolean;
};
