import { DocumentSnapshot } from "firebase/firestore";

interface FirebaseDocumentData {
  [key: string]: any;
}

export const convertFirebaseDocToObject = <T = FirebaseDocumentData>(
  doc: DocumentSnapshot<T> | null,
): { id: string; data: T } | null => {
  if (!doc || !doc.exists()) return null;

  const data = doc.data();

  if (!data) return null;

  return { id: doc.id, data } as { id: string; data: T };
};
