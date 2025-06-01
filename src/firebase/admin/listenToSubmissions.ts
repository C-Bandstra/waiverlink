import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Listens to all documents under a specific grouping within a seed
 * @param seedId - e.g., "never-summer"
 * @param groupingId - e.g., "waivers"
 * @param callback - function to receive live snapshot data
 */
export const listenToSubmissions = (
  seedId: string,
  groupingId: string,
  callback: (data: any[]) => void
) => {
  const collectionRef = collection(db, "seeds", seedId, groupingId);

  return onSnapshot(collectionRef, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(data);
  });
};