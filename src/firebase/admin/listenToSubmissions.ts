import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Listens to submissions for a given template within a seed and grouping
 * Firestore path: seeds/:seedId/:groupingId/:templateTitle/:docId
 */
export const listenToSubmissions = (
  seedId: string,
  groupingId: string,
  templateSlug: string,
  callback: (data: any[]) => void,
) => {
  const collectionRef = collection(
    db,
    "seeds",
    seedId,
    groupingId,
    templateSlug,
    "submissions",
  );

  return onSnapshot(collectionRef, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(data);
  });
};
