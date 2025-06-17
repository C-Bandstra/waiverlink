import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import type { WaiverSubmission } from "../../types/admin";
import { toSlug } from "../../utils/helpers";

/**
 * Submits a waiver under the following Firestore structure:
 * seeds/:seedId/:groupingId/:templateTitle/:docId
 */
export async function submitWaiver(
  seedId: string,
  groupingId: string,
  templateTitle: string,
  submission: WaiverSubmission
): Promise<string> {
  try {
    const templateSlug = toSlug(templateTitle); // => "multi-signer-waiver"

    const submissionToSave = {
      ...submission,
      serverTimestamp: serverTimestamp(),
    };

    const submissionsRef = collection(
      db,
      "seeds",
      seedId,
      groupingId,
      templateSlug,
      "submissions"
    );

    const docRef = await addDoc(submissionsRef, submissionToSave);
    return docRef.id;
  } catch (error) {
    console.error("Error submitting waiver:", error);
    throw error;
  }
}
