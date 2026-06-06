import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  increment,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
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

function sortOldest(items) {
  return [...items].sort((a, b) => toTimestampNumber(a.createdAt) - toTimestampNumber(b.createdAt));
}

function sortByRecentActivity(items) {
  return [...items].sort(
    (a, b) =>
      toTimestampNumber(b.lastMessageAt || b.updatedAt || b.createdAt) -
      toTimestampNumber(a.lastMessageAt || a.updatedAt || a.createdAt)
  );
}

export function getProjectChatId(projectId, applicantId) {
  return `${projectId}_${applicantId}`;
}

async function commitInChunks(items, applyWrite) {
  const chunkSize = 450;

  for (let index = 0; index < items.length; index += chunkSize) {
    const batch = writeBatch(db);
    items.slice(index, index + chunkSize).forEach((item) => applyWrite(batch, item));
    await batch.commit();
  }
}

function assertProjectOwner(project, ownerId) {
  if (project.ownerId !== ownerId) {
    throw new Error("Only the project owner can manage this project.");
  }
}

function notificationPayload({ userId, type, title, message, link }) {
  return {
    userId,
    type,
    title,
    message,
    link,
    read: false,
    createdAt: serverTimestamp(),
  };
}

function truncateMessage(value, maxLength = 140) {
  const clean = String(value || "").trim();
  return clean.length > maxLength ? `${clean.slice(0, maxLength - 1)}...` : clean;
}

function normalizeStatus(value) {
  return String(value || "").trim().toLowerCase();
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

export function listenUserProfile(uid, onNext, onError) {
  if (!uid || !firebaseConfigured) {
    onNext(null);
    return () => {};
  }

  return onSnapshot(
    doc(db, "users", uid),
    (snapshot) => onNext(snapshot.exists() ? withId(snapshot) : null),
    onError
  );
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

export async function setUserPresence(uid, online) {
  if (!uid || !firebaseConfigured) return;

  await setDoc(
    doc(db, "users", uid),
    {
      online: Boolean(online),
      lastActiveAt: serverTimestamp(),
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

async function syncApplicationProjectTitle(projectId, projectTitle, ownerId) {
  const snapshot = await getDocs(
    query(collection(db, "applications"), where("projectId", "==", projectId), where("ownerId", "==", ownerId))
  );
  await commitInChunks(snapshot.docs, (batch, applicationSnapshot) => {
    batch.update(applicationSnapshot.ref, {
      projectTitle,
      updatedAt: serverTimestamp(),
    });
  });
}

async function syncProjectChatTitle(projectId, projectTitle, ownerId) {
  const snapshot = await getDocs(query(collection(db, "chats"), where("members", "array-contains", ownerId)));
  const projectChats = snapshot.docs.filter((chatSnapshot) => chatSnapshot.data().projectId === projectId);

  await commitInChunks(projectChats, (batch, chatSnapshot) => {
    batch.update(chatSnapshot.ref, {
      projectTitle,
      updatedAt: serverTimestamp(),
    });
  });
}

export async function updateProject(projectId, ownerId, data) {
  requireFirestore();
  const projectRef = doc(db, "projects", projectId);
  let shouldSyncApplicationTitles = false;

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(projectRef);

    if (!snapshot.exists()) {
      throw new Error("This project no longer exists.");
    }

    const currentProject = snapshot.data();
    assertProjectOwner(currentProject, ownerId);
    shouldSyncApplicationTitles = Boolean(data.title && data.title !== currentProject.title);

    transaction.update(projectRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  });

  if (shouldSyncApplicationTitles) {
    await Promise.all([
      syncApplicationProjectTitle(projectId, data.title, ownerId),
      syncProjectChatTitle(projectId, data.title, ownerId),
    ]);
  }
}

export async function closeProject(projectId, ownerId) {
  requireFirestore();
  const projectRef = doc(db, "projects", projectId);

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(projectRef);

    if (!snapshot.exists()) {
      throw new Error("This project no longer exists.");
    }

    assertProjectOwner(snapshot.data(), ownerId);
    transaction.update(projectRef, {
      status: "Closed",
      updatedAt: serverTimestamp(),
    });
  });
}

export async function reopenProject(projectId, ownerId) {
  requireFirestore();
  const projectRef = doc(db, "projects", projectId);

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(projectRef);

    if (!snapshot.exists()) {
      throw new Error("This project no longer exists.");
    }

    const project = snapshot.data();
    assertProjectOwner(project, ownerId);

    if (project.status !== "Closed") {
      throw new Error("Only closed projects can be reopened.");
    }

    transaction.update(projectRef, {
      status: "Open",
      updatedAt: serverTimestamp(),
    });
  });
}

export async function deleteProjectWithApplications(projectId, ownerId) {
  requireFirestore();
  const projectRef = doc(db, "projects", projectId);
  const snapshot = await getDoc(projectRef);

  if (!snapshot.exists()) {
    throw new Error("This project no longer exists.");
  }

  assertProjectOwner(snapshot.data(), ownerId);

  const applicationsSnapshot = await getDocs(query(collection(db, "applications"), where("ownerId", "==", ownerId)));
  const applicationRefs = applicationsSnapshot.docs
    .filter((applicationSnapshot) => applicationSnapshot.data().projectId === projectId)
    .map((applicationSnapshot) => applicationSnapshot.ref);

  const chatsSnapshot = await getDocs(query(collection(db, "chats"), where("members", "array-contains", ownerId)));
  const projectChatDocs = chatsSnapshot.docs.filter((chatSnapshot) => chatSnapshot.data().projectId === projectId);
  const messageSnapshots = await Promise.all(
    projectChatDocs.map((chatSnapshot) => getDocs(collection(db, "chats", chatSnapshot.id, "messages")))
  );
  const messageRefs = messageSnapshots.flatMap((messagesSnapshot) =>
    messagesSnapshot.docs.map((messageSnapshot) => messageSnapshot.ref)
  );
  const chatRefs = projectChatDocs.map((chatSnapshot) => chatSnapshot.ref);

  await commitInChunks(messageRefs, (batch, ref) => {
    batch.delete(ref);
  });
  await commitInChunks(chatRefs, (batch, ref) => {
    batch.delete(ref);
  });
  await commitInChunks(applicationRefs, (batch, ref) => {
    batch.delete(ref);
  });
  await commitInChunks([projectRef], (batch, ref) => {
    batch.delete(ref);
  });
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
    const projectSnapshot = await transaction.get(projectRef);

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

    transaction.set(
      doc(collection(db, "notifications")),
      notificationPayload({
        userId: project.ownerId,
        type: "application-new",
        title: "New application received",
        message: `${data.applicantName || "A builder"} applied to ${project.title || data.projectTitle || "your project"}.`,
        link: `/projects/${data.projectId}`,
      })
    );
  });

  return applicationId;
}

export async function withdrawApplication({ projectId, applicantId }) {
  requireFirestore();

  if (!projectId || !applicantId) {
    throw new Error("Only the applicant can withdraw this application.");
  }

  const applicationId = `${projectId}_${applicantId}`;
  const applicationRef = doc(db, "applications", applicationId);

  await runTransaction(db, async (transaction) => {
    const applicationSnapshot = await transaction.get(applicationRef);

    if (!applicationSnapshot.exists()) {
      throw new Error("This application no longer exists.");
    }

    const application = applicationSnapshot.data();

    if (application.applicantId !== applicantId || application.projectId !== projectId) {
      throw new Error("Only the applicant can withdraw this application.");
    }

    const applicationStatus = normalizeStatus(application.status);

    if (applicationStatus === "accepted") {
      throw new Error("You are already part of this project.");
    }

    if (applicationStatus !== "pending") {
      throw new Error("Only pending applications can be withdrawn.");
    }

    const projectRef = doc(db, "projects", projectId);
    const projectSnapshot = await transaction.get(projectRef);

    if (!projectSnapshot.exists()) {
      throw new Error("This project no longer exists.");
    }

    const project = projectSnapshot.data();
    const currentApplicantCount = Math.max(0, Number(project.applicantCount) || 0);

    transaction.delete(applicationRef);
    transaction.update(projectRef, {
      applicantCount: Math.max(0, currentApplicantCount - 1),
      updatedAt: serverTimestamp(),
    });

    transaction.set(
      doc(collection(db, "notifications")),
      notificationPayload({
        userId: project.ownerId || application.ownerId,
        type: "application-withdrawn",
        title: "Application withdrawn",
        message: `${application.applicantName || "A builder"} withdrew their application for ${project.title || application.projectTitle || "your project"}.`,
        link: `/projects/${projectId}`,
      })
    );
  });
}

export async function removeProjectMember({ applicationId, ownerId }) {
  requireFirestore();

  if (!applicationId || !ownerId) {
    throw new Error("Only the project owner can remove team members.");
  }

  const applicationRef = doc(db, "applications", applicationId);

  await runTransaction(db, async (transaction) => {
    const applicationSnapshot = await transaction.get(applicationRef);

    if (!applicationSnapshot.exists()) {
      throw new Error("This application no longer exists.");
    }

    const application = applicationSnapshot.data();

    if (application.ownerId !== ownerId) {
      throw new Error("Only the project owner can remove team members.");
    }

    if (normalizeStatus(application.status) !== "accepted") {
      throw new Error("Only accepted members can be removed.");
    }

    const projectRef = doc(db, "projects", application.projectId);
    const projectSnapshot = await transaction.get(projectRef);

    if (!projectSnapshot.exists()) {
      throw new Error("This project no longer exists.");
    }

    const project = projectSnapshot.data();
    if (project.ownerId !== ownerId) {
      throw new Error("Only the project owner can remove team members.");
    }

    const chatId = application.chatId || getProjectChatId(application.projectId, application.applicantId);
    const chatRef = doc(db, "chats", chatId);
    const chatSnapshot = await transaction.get(chatRef);

    transaction.update(applicationRef, {
      status: "Removed",
      updatedAt: serverTimestamp(),
    });

    if (chatSnapshot.exists()) {
      transaction.update(chatRef, {
        members: [ownerId],
        updatedAt: serverTimestamp(),
      });
    }

    transaction.set(
      doc(collection(db, "notifications")),
      notificationPayload({
        userId: application.applicantId,
        type: "member-removed",
        title: "Removed from project",
        message: `You were removed from ${project.title || application.projectTitle || "a project"}.`,
        link: `/projects/${application.projectId}`,
      })
    );
  });
}

export async function leaveProject({ projectId, applicantId }) {
  requireFirestore();

  if (!projectId || !applicantId) {
    throw new Error("Only accepted members can leave a project.");
  }

  const applicationId = `${projectId}_${applicantId}`;
  const applicationRef = doc(db, "applications", applicationId);

  await runTransaction(db, async (transaction) => {
    const applicationSnapshot = await transaction.get(applicationRef);

    if (!applicationSnapshot.exists()) {
      throw new Error("This application no longer exists.");
    }

    const application = applicationSnapshot.data();

    if (application.applicantId !== applicantId || application.projectId !== projectId) {
      throw new Error("Only accepted members can leave a project.");
    }

    if (application.ownerId === applicantId) {
      throw new Error("Project owners cannot leave their own project.");
    }

    if (normalizeStatus(application.status) !== "accepted") {
      throw new Error("Only accepted members can leave a project.");
    }

    const projectRef = doc(db, "projects", projectId);
    const projectSnapshot = await transaction.get(projectRef);

    if (!projectSnapshot.exists()) {
      throw new Error("This project no longer exists.");
    }

    const project = projectSnapshot.data();
    const chatId = application.chatId || getProjectChatId(projectId, applicantId);
    const chatRef = doc(db, "chats", chatId);
    const chatSnapshot = await transaction.get(chatRef);

    transaction.update(applicationRef, {
      status: "Left",
      updatedAt: serverTimestamp(),
    });

    if (chatSnapshot.exists()) {
      transaction.update(chatRef, {
        members: [application.ownerId],
        updatedAt: serverTimestamp(),
      });
    }

    transaction.set(
      doc(collection(db, "notifications")),
      notificationPayload({
        userId: application.ownerId,
        type: "member-left",
        title: "Member left your project",
        message: `${application.applicantName || "A builder"} left ${project.title || application.projectTitle || "your project"}.`,
        link: `/projects/${projectId}`,
      })
    );
  });
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

export async function listApplicationsByProject(projectId, options = {}) {
  if (!projectId || !firebaseConfigured) return [];

  const constraints = [where("projectId", "==", projectId)];

  if (options.ownerId) {
    constraints.push(where("ownerId", "==", options.ownerId));
  }

  if (options.acceptedOnly) {
    constraints.push(where("status", "==", "Accepted"));
  }

  const snapshot = await getDocs(query(collection(db, "applications"), ...constraints));
  return sortNewest(snapshot.docs.map(withId));
}

export async function updateApplicationStatus(applicationId, ownerId, status) {
  requireFirestore();

  if (!applicationId || !ownerId) {
    throw new Error("Only the project owner can review applications.");
  }

  if (!["Accepted", "Rejected"].includes(status)) {
    throw new Error("Please choose a valid application status.");
  }

  const applicationRef = doc(db, "applications", applicationId);
  let reviewResult = null;

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(applicationRef);

    if (!snapshot.exists()) {
      throw new Error("This application no longer exists.");
    }

    const application = snapshot.data();

    if (application.ownerId !== ownerId) {
      throw new Error("Only the project owner can review applications.");
    }

    if (application.status !== "Pending") {
      throw new Error("This application has already been reviewed.");
    }

    const projectRef = doc(db, "projects", application.projectId);
    const projectSnapshot = await transaction.get(projectRef);
    const project = projectSnapshot.exists() ? projectSnapshot.data() : null;
    const projectTitle = project?.title || application.projectTitle || "Project";
    const chatId = getProjectChatId(application.projectId, application.applicantId);
    const applicationPatch = {
      status,
      updatedAt: serverTimestamp(),
    };

    if (status === "Accepted") {
      applicationPatch.chatId = chatId;
    }

    transaction.update(applicationRef, {
      ...applicationPatch,
    });

    if (status === "Accepted") {
      transaction.set(doc(db, "chats", chatId), {
        projectId: application.projectId,
        projectTitle,
        ownerId,
        applicantId: application.applicantId,
        members: [ownerId, application.applicantId],
        memberNames: {
          [ownerId]: project?.ownerName || "Project owner",
          [application.applicantId]: application.applicantName || "Accepted builder",
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastMessage: "",
        lastMessageAt: null,
      });
    }

    transaction.set(
      doc(collection(db, "notifications")),
      notificationPayload({
        userId: application.applicantId,
        type: status === "Accepted" ? "application-accepted" : "application-rejected",
        title: status === "Accepted" ? "Application accepted" : "Application rejected",
        message:
          status === "Accepted"
            ? `You were accepted to ${projectTitle}. A project chat is ready.`
            : `Your application for ${projectTitle} was reviewed and rejected.`,
        link: status === "Accepted" ? `/chats/${chatId}` : `/projects/${application.projectId}`,
      })
    );

    reviewResult = {
      chatId: status === "Accepted" ? chatId : "",
      applicationPatch,
    };
  });

  return reviewResult;
}

export async function listUserChats(userId) {
  if (!userId || !firebaseConfigured) return [];
  const snapshot = await getDocs(query(collection(db, "chats"), where("members", "array-contains", userId)));
  return sortByRecentActivity(snapshot.docs.map(withId));
}

export function listenUserChats(userId, onNext, onError) {
  if (!userId || !firebaseConfigured) {
    onNext([]);
    return () => {};
  }

  return onSnapshot(
    query(collection(db, "chats"), where("members", "array-contains", userId)),
    (snapshot) => onNext(sortByRecentActivity(snapshot.docs.map(withId))),
    onError
  );
}

export async function getChat(chatId) {
  if (!chatId || !firebaseConfigured) return null;
  const snapshot = await getDoc(doc(db, "chats", chatId));
  return snapshot.exists() ? withId(snapshot) : null;
}

export function listenChatMessages(chatId, onNext, onError) {
  if (!chatId || !firebaseConfigured) {
    onNext([]);
    return () => {};
  }

  return onSnapshot(
    query(collection(db, "chats", chatId, "messages"), orderBy("createdAt", "asc")),
    (snapshot) => onNext(sortOldest(snapshot.docs.map(withId))),
    onError
  );
}

export async function setChatTyping(chatId, userId, name, typing) {
  requireFirestore();

  if (!chatId || !userId) return;

  await updateDoc(doc(db, "chats", chatId), {
    [`typing.${userId}`]: typing
      ? {
          name: name || "Builder",
          updatedAt: serverTimestamp(),
        }
      : null,
  });
}

export async function markChatRead(chatId, userId) {
  requireFirestore();

  if (!chatId || !userId) return;

  await updateDoc(doc(db, "chats", chatId), {
    [`readReceipts.${userId}`]: serverTimestamp(),
  });
}

export async function sendChatMessage(chatId, sender, text) {
  requireFirestore();

  const cleanText = String(text || "").trim();
  if (!cleanText) {
    throw new Error("Please enter a message before sending.");
  }

  if (cleanText.length > 2000) {
    throw new Error("Messages must be 2,000 characters or less.");
  }

  const chatRef = doc(db, "chats", chatId);
  const chatSnapshot = await getDoc(chatRef);

  if (!chatSnapshot.exists()) {
    throw new Error("This chat no longer exists.");
  }

  const chat = withId(chatSnapshot);
  if (!chat.members?.includes(sender.uid)) {
    throw new Error("You are not a member of this chat.");
  }

  const senderName = sender.name || sender.displayName || sender.email || "ALAVACOUS builder";
  const messageRef = doc(collection(db, "chats", chatId, "messages"));
  const batch = writeBatch(db);

  batch.set(messageRef, {
    senderId: sender.uid,
    senderName,
    text: cleanText,
    createdAt: serverTimestamp(),
  });

  batch.update(chatRef, {
    lastMessage: cleanText,
    lastMessageAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  chat.members
    .filter((memberId) => memberId !== sender.uid)
    .forEach((memberId) => {
      batch.set(
        doc(collection(db, "notifications")),
        notificationPayload({
          userId: memberId,
          type: "chat-message",
          title: `New message in ${chat.projectTitle || "project chat"}`,
          message: `${senderName}: ${truncateMessage(cleanText)}`,
          link: `/chats/${chatId}`,
        })
      );
    });

  await batch.commit();
}

export async function listNotifications(userId) {
  if (!userId || !firebaseConfigured) return [];
  const snapshot = await getDocs(query(collection(db, "notifications"), where("userId", "==", userId)));
  return sortNewest(snapshot.docs.map(withId));
}

export function listenNotifications(userId, onNext, onError) {
  if (!userId || !firebaseConfigured) {
    onNext([]);
    return () => {};
  }

  return onSnapshot(
    query(collection(db, "notifications"), where("userId", "==", userId)),
    (snapshot) => onNext(sortNewest(snapshot.docs.map(withId))),
    onError
  );
}

export async function markNotificationRead(notificationId, userId) {
  requireFirestore();
  const notificationRef = doc(db, "notifications", notificationId);

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(notificationRef);

    if (!snapshot.exists()) {
      throw new Error("This notification no longer exists.");
    }

    if (snapshot.data().userId !== userId) {
      throw new Error("You can only update your own notifications.");
    }

    transaction.update(notificationRef, {
      read: true,
      updatedAt: serverTimestamp(),
    });
  });
}

export async function markAllNotificationsRead(userId) {
  requireFirestore();
  const notifications = await listNotifications(userId);
  const unread = notifications.filter((notification) => !notification.read);

  await commitInChunks(unread, (batch, notification) => {
    batch.update(doc(db, "notifications", notification.id), {
      read: true,
      updatedAt: serverTimestamp(),
    });
  });
}
