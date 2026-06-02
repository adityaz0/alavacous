import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, firebaseConfigured } from "../firebase/config.js";
import { toTimestampNumber } from "../utils/format.js";

function requireFirestore() {
  if (!firebaseConfigured || !db) {
    throw new Error("Firestore is not configured. Add Firebase environment variables first.");
  }
}

function withId(snapshot) {
  return { id: snapshot.id, ...snapshot.data() };
}

function sortNewest(items) {
  return [...items].sort((a, b) => toTimestampNumber(b.createdAt) - toTimestampNumber(a.createdAt));
}

export async function createUserProfile(uid, data) {
  requireFirestore();
  await setDoc(
    doc(db, "users", uid),
    {
      ...data,
      uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function getUserProfile(uid) {
  if (!uid || !firebaseConfigured) return null;
  const snapshot = await getDoc(doc(db, "users", uid));
  return snapshot.exists() ? withId(snapshot) : null;
}

export async function updateUserProfile(uid, data) {
  requireFirestore();
  await setDoc(
    doc(db, "users", uid),
    {
      ...data,
      uid,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function listProjects() {
  if (!firebaseConfigured) return [];
  const snapshot = await getDocs(collection(db, "projects"));
  return sortNewest(snapshot.docs.map(withId));
}

export async function getProject(projectId) {
  if (!firebaseConfigured) return null;

  const snapshot = await getDoc(doc(db, "projects", projectId));
  return snapshot.exists() ? withId(snapshot) : null;
}

export async function createProject(data) {
  requireFirestore();
  const payload = {
    ...data,
    applicantCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, "projects"), payload);
  return ref.id;
}

export async function listProjectsByOwner(ownerId) {
  if (!ownerId || !firebaseConfigured) return [];
  const snapshot = await getDocs(query(collection(db, "projects"), where("ownerId", "==", ownerId)));
  return sortNewest(snapshot.docs.map(withId));
}

export async function createApplication(data) {
  requireFirestore();
  const applicationId = `${data.projectId}_${data.applicantId}`;
  const applicationRef = doc(db, "applications", applicationId);
  const projectRef = doc(db, "projects", data.projectId);

  await runTransaction(db, async (transaction) => {
    const [applicationSnapshot, projectSnapshot] = await Promise.all([
      transaction.get(applicationRef),
      transaction.get(projectRef),
    ]);

    if (applicationSnapshot.exists()) {
      throw new Error("You already applied to this project.");
    }

    if (!projectSnapshot.exists()) {
      throw new Error("This project no longer exists.");
    }

    const project = projectSnapshot.data();

    if (project.ownerId === data.applicantId) {
      throw new Error("You cannot apply to your own project.");
    }

    if (project.status !== "Open") {
      throw new Error("Applications are closed for this project.");
    }

    transaction.set(applicationRef, {
      ...data,
      status: "Pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    transaction.update(projectRef, {
      applicantCount: increment(1),
      updatedAt: serverTimestamp(),
    });
  });

  return applicationId;
}

export async function getApplicationForProject(projectId, applicantId) {
  if (!projectId || !applicantId || !firebaseConfigured) return null;
  const snapshot = await getDocs(
    query(
      collection(db, "applications"),
      where("projectId", "==", projectId),
      where("applicantId", "==", applicantId)
    )
  );
  return snapshot.empty ? null : withId(snapshot.docs[0]);
}

export async function listApplicationsByApplicant(applicantId) {
  if (!applicantId || !firebaseConfigured) return [];
  const snapshot = await getDocs(query(collection(db, "applications"), where("applicantId", "==", applicantId)));
  return sortNewest(snapshot.docs.map(withId));
}

export async function listApplicationsByOwner(ownerId) {
  if (!ownerId || !firebaseConfigured) return [];
  const snapshot = await getDocs(query(collection(db, "applications"), where("ownerId", "==", ownerId)));
  return sortNewest(snapshot.docs.map(withId));
}

export async function listApplicationsByProject(projectId) {
  if (!projectId || !firebaseConfigured) return [];
  const snapshot = await getDocs(query(collection(db, "applications"), where("projectId", "==", projectId)));
  return sortNewest(snapshot.docs.map(withId));
}

export async function updateApplicationStatus(applicationId, status) {
  requireFirestore();
  await updateDoc(doc(db, "applications", applicationId), {
    status,
    updatedAt: serverTimestamp(),
  });
}
