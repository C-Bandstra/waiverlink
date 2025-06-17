import React, { createContext, useContext } from "react";
import type { Signer } from "../hooks/useSignerManager";
import { useSignerManager } from "../hooks/useSignerManager"; // adjust import path

// The shape of context value:
interface SignerContextType {
  signer: Signer;
  update: (updates: Partial<Signer>) => void;
  reset: () => void;
  save: () => Promise<Signer[]>;
  load: (index: number) => void;
  nextSigner: () => void;
  previousSigner: () => void;
  expandSignerList: (count: number) => void;
  signerList: Signer[];
  currentSignerIndex: number;
}

// Create context with a default value of undefined
const SignerContext = createContext<SignerContextType | undefined>(undefined);

// Provider component wraps app and provides the signer state
export const SignerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const signerManager = useSignerManager();

  return <SignerContext.Provider value={signerManager}>{children}</SignerContext.Provider>;
};

// Hook to consume the context easily
export function useSigner() {
  const context = useContext(SignerContext);
  if (!context) {
    throw new Error("useSigner must be used within a SignerProvider");
  }
  return context;
}