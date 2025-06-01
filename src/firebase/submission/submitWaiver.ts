import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import type { WaiverSubmission } from "../../types/admin";

export async function submitWaiver(
  seedId: string,
  groupingId: string,
  submission: WaiverSubmission
): Promise<string> {
  try {
    const submissionToSave = {
      ...submission,
      serverTimestamp: serverTimestamp(),
    };

    const submissionsRef = collection(db, "seeds", seedId, groupingId);
    console.log(submissionsRef)

    const docRef = await addDoc(submissionsRef, submissionToSave);

    return docRef.id;
  } catch (error) {
    console.error("Error submitting waiver:", error);
    throw error;
  }
}