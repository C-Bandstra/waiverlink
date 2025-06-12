import { useReducer, useState } from "react";
import type { JSX } from "react";

// === Types ===

export interface Signer {
  name: string;
  signature: JSX.Element | null;
  agreedToTerms: boolean;
  touched: Record<string, boolean>;
  fieldValues: Record<string, any>;
}

type SignerAction =
  | { type: "update"; payload: Partial<Signer> }
  | { type: "reset" }
  | { type: "set"; payload: Signer };

// === Defaults ===

const defaultSigner: Signer = {
  name: "",
  signature: null,
  agreedToTerms: false,
  touched: {},
  fieldValues: {},
};

// === Reducer ===

function signerReducer(state: Signer, action: SignerAction): Signer {
  switch (action.type) {
    case "update":
      return { ...state, ...action.payload };
    case "reset":
      return defaultSigner;
    case "set":
      return action.payload;
    default:
      return state;
  }
}

// === Custom Hook ===

export function useSignerManager() {
  const [signer, dispatch] = useReducer(signerReducer, defaultSigner);
  const [signerList, setSignerList] = useState<Signer[]>([]);

  // Update part of signer state
  const update = (updates: Partial<Signer>) => {
    dispatch({ type: "update", payload: updates });
  };

  // Reset signer to defaults
  const reset = () => {
    dispatch({ type: "reset" });
  };

  // Save current signer and start fresh
  const save = (): boolean => {
    if (!signer.name || !signer.signature) {
      return false;
    }
    setSignerList((prev) => [...prev, signer]);
    reset();
    return true;
  };

  // Replace signer with one from list
  const load = (index: number) => {
    const target = signerList[index];
    if (target) {
      dispatch({ type: "set", payload: target });
    }
  };

  return {
    signer,
    update,
    reset,
    save,
    load,
    signerList,
  };
}
