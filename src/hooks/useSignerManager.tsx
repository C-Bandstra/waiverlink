import { useReducer, useState } from "react";
import type { JSX } from "react";
import type { WaiverToken } from "../types";

export interface Signer {
  id: string; // e.g. "signer-1"
  name: string;
  signature: JSX.Element | null;
  agreedToTerms: boolean;
  touched: Record<string, boolean>;
  fieldValues: Record<string, any>;
  requiredFields: WaiverToken[];
}

// --- Utility to create a blank signer with given index ---
export function createSigner(index: number): Signer {
  return {
    id: `signer-${index}`,
    name: "",
    signature: null,
    agreedToTerms: false,
    touched: {},
    fieldValues: {},
    requiredFields: [],
  };
}

// --- Reducer and actions to manage current signer state ---
type SignerAction =
  | { type: "update"; payload: Partial<Signer> }
  | { type: "set"; payload: Signer };

function signerReducer(state: Signer, action: SignerAction): Signer {
  switch (action.type) {
    case "update":
      const newState = { ...state, ...action.payload };
      console.log("Reducer update:", newState);
      return newState;
    case "set":
      console.log("Reducer set:", action.payload);
      return action.payload;
    default:
      return state;
  }
}

// --- Main hook managing current signer and signer list ---
export function useSignerManager() {
  // Initialize with the first signer in the list (signer-1)
  const firstSigner = createSigner(1);

  // State: list of all signers
  const [signerList, setSignerList] = useState<Signer[]>([firstSigner]);

  // State: index of the currently active signer (0-based)
  const [currentSignerIndex, setCurrentSignerIndex] = useState(0);

  // Reducer: manages the state of the currently active signer
  const [signer, dispatch] = useReducer(signerReducer, firstSigner);

  /**
   * Update parts of the current signer state
   * @param updates Partial signer data to merge in
   */
  const update = (updates: Partial<Signer>) => {
    dispatch({ type: "update", payload: updates });
  };

  /**
   * Reset (clear) the current signer to a blank signer
   * with the same id (based on currentSignerIndex)
   */
  const reset = () => {
    const blankSigner = createSigner(currentSignerIndex + 1); // ids are 1-based
    dispatch({ type: "set", payload: blankSigner });
  };

  /**
   * Save the current signer into the signerList state,
   * replacing the signer at currentSignerIndex
   * @returns boolean whether save was successful
   */
  const save = (): Promise<Signer[]> => {
    return new Promise((resolve, reject) => {
      if (!signer.name || !signer.signature) {
        reject(new Error("Missing name or signature"));
        return;
      }

      setSignerList((prev) => {
        const updated = [...prev];
        updated[currentSignerIndex] = signer;

        // Defer resolve to next tick to allow state to propagate
        setTimeout(() => resolve(updated), 0);

        return updated;
      });
    });
  };

  /**
   * Expand the signer list up to the given count,
   * adding new blank signers if needed
   * @param count total number of signers desired
   */
  const expandSignerList = (count: number) => {
    setSignerList((prev) => {
      const existing = [...prev];
      for (let i = existing.length + 1; i <= count; i++) {
        existing.push(createSigner(i));
      }
      return existing;
    });
  };

  /**
   * Load a signer from the signerList by index,
   * making them the current active signer
   * @param index index of signer in signerList to load
   */
  const load = (index: number) => {
    const target = signerList[index];
    if (target) {
      setCurrentSignerIndex(index);
      dispatch({ type: "set", payload: target });
    }
  };

  /**
   * Advance to the next signer in the list,
   * if available, and load their data
   */
  const nextSigner = () => {
    const nextIndex = currentSignerIndex + 1;

    if (nextIndex < signerList.length) {
      setCurrentSignerIndex(nextIndex);
      dispatch({ type: "set", payload: signerList[nextIndex] });
    } else {
      // If no next signer, create a new blank one
      const newSigner = createSigner(nextIndex + 1);
      setSignerList((prev) => [...prev, newSigner]);
      setCurrentSignerIndex(nextIndex);
      dispatch({ type: "set", payload: newSigner });
    }
  };


  /**
   * Go back to the previous signer in the list,
   * if available, and load their data
   */
  const previousSigner = () => {
    if (currentSignerIndex > 0) {
      setCurrentSignerIndex(currentSignerIndex - 1);
      dispatch({ type: "set", payload: signerList[currentSignerIndex - 1] });
    }
  };

  // Return all relevant data and functions for external use
  return {
    signer,
    update,
    reset,
    save,
    load,
    signerList,
    currentSignerIndex,
    nextSigner,
    previousSigner,
    expandSignerList,
  };
}

