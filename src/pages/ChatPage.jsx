import { ArrowLeft, CheckCheck, MessageCircle, Send, Users } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Alert from "../components/ui/Alert.jsx";
import Avatar from "../components/ui/Avatar.jsx";
import Button from "../components/ui/Button.jsx";
import LoadingState from "../components/ui/LoadingState.jsx";
import { useToast } from "../components/ui/ToastProvider.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  getUserProfile,
  listenChatMessages,
  listenNotifications,
  listenUserProfile,
  listenUserChats,
  markChatRead,
  markNotificationRead,
  sendChatMessage,
  setChatTyping,
} from "../services/firestore.js";
import { formatDateTime, formatRelativeTime, toTimestampNumber } from "../utils/format.js";
import { getServiceErrorMessage } from "../utils/messages.js";

export default function ChatPage() {
  const { chatId } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [peerProfile, setPeerProfile] = useState(null);
  const [chatLoading, setChatLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(Boolean(chatId));
  const [error, setError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimerRef = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();

  const selectedChat = useMemo(() => chats.find((chat) => chat.id === chatId) || null, [chatId, chats]);
  const selectedPeerId = useMemo(
    () => selectedChat?.members?.find((memberId) => memberId !== user.uid) || selectedChat?.applicantId || "",
    [selectedChat, user.uid]
  );
  const selectedPeerOnline = Boolean(
    peerProfile?.online && Date.now() - toTimestampNumber(peerProfile.lastActiveAt) < 2 * 60 * 1000
  );
  const unreadByChat = useMemo(
    () =>
      notifications
        .filter((notification) => !notification.read && notification.type === "chat-message")
        .reduce((counts, notification) => {
          const match = String(notification.link || "").match(/\/chats\/([^/?#]+)/);
          if (match?.[1]) {
            counts[match[1]] = (counts[match[1]] || 0) + 1;
          }
          return counts;
        }, {}),
    [notifications]
  );
  const typingUsers = useMemo(() => {
    if (!selectedChat?.typing) return [];

    return Object.entries(selectedChat.typing)
      .filter(([memberId, typing]) => {
        if (memberId === user.uid || !typing) return false;
        return Date.now() - toTimestampNumber(typing.updatedAt) < 6_000;
      })
      .map(([, typing]) => typing.name || "Builder");
  }, [selectedChat, user.uid]);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      const data = await getUserProfile(user.uid);
      if (mounted) setProfile(data);
    }

    loadProfile().catch(() => {});
    return () => {
      mounted = false;
    };
  }, [user.uid]);

  useEffect(() => {
    setChatLoading(true);
    setError("");

    return listenUserChats(
      user.uid,
      (data) => {
        setChats(data);
        setChatLoading(false);
      },
      (err) => {
        setError(getServiceErrorMessage(err, "Could not load chats."));
        setChatLoading(false);
      }
    );
  }, [user.uid]);

  useEffect(() => {
    return listenNotifications(user.uid, setNotifications, () => setNotifications([]));
  }, [user.uid]);

  useEffect(() => {
    setPeerProfile(null);

    if (!selectedPeerId) return undefined;

    return listenUserProfile(
      selectedPeerId,
      setPeerProfile,
      () => setPeerProfile(null)
    );
  }, [selectedPeerId]);

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      setMessagesLoading(false);
      return undefined;
    }

    setMessagesLoading(true);
    setMessageError("");

    return listenChatMessages(
      chatId,
      (data) => {
        setMessages(data);
        setMessagesLoading(false);
      },
      (err) => {
        setMessageError(getServiceErrorMessage(err, "Could not load messages."));
        setMessagesLoading(false);
      }
    );
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chatId, messages.length, messagesLoading]);

  useEffect(() => {
    if (!chatId || !selectedChat?.members?.includes(user.uid)) return undefined;

    const senderName = profile?.fullName || user.displayName || user.email || "Builder";
    window.clearTimeout(typingTimerRef.current);

    if (!draft.trim()) {
      setChatTyping(chatId, user.uid, senderName, false).catch(() => {});
      return undefined;
    }

    setChatTyping(chatId, user.uid, senderName, true).catch(() => {});
    typingTimerRef.current = window.setTimeout(() => {
      setChatTyping(chatId, user.uid, senderName, false).catch(() => {});
    }, 2500);

    return () => window.clearTimeout(typingTimerRef.current);
  }, [chatId, draft, profile?.fullName, selectedChat, user.displayName, user.email, user.uid]);

  useEffect(() => {
    return () => {
      if (chatId) {
        setChatTyping(chatId, user.uid, "", false).catch(() => {});
      }
    };
  }, [chatId, user.uid]);

  useEffect(() => {
    if (!chatId) return;

    markChatRead(chatId, user.uid).catch(() => {});

    const unreadChatNotifications = notifications.filter(
      (notification) => !notification.read && notification.type === "chat-message" && notification.link === `/chats/${chatId}`
    );

    if (!unreadChatNotifications.length) return;

    Promise.all(unreadChatNotifications.map((notification) => markNotificationRead(notification.id, user.uid))).catch(() => {});
  }, [chatId, notifications, user.uid]);

  async function handleSend(event) {
    event.preventDefault();
    const cleanDraft = draft.trim();

    if (!chatId || !cleanDraft) return;

    setSending(true);
    setMessageError("");

    try {
      await sendChatMessage(
        chatId,
        {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          name: profile?.fullName,
        },
        cleanDraft
      );
      setDraft("");
      setChatTyping(chatId, user.uid, "", false).catch(() => {});
    } catch (err) {
      const message = getServiceErrorMessage(err, "Could not send message.");
      setMessageError(message);
      toast.error(message);
    } finally {
      setSending(false);
    }
  }

  if (chatLoading) {
    return <LoadingState label="Loading chats" />;
  }

  return (
    <main className="page-shell page-reveal py-4 sm:py-6">
      <section className="internal-page-header">
        <p className="label text-mint">Real-time collaboration</p>
        <h1 className="mt-2 text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">Project chats</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/56">
          Accepted builders and project owners can coordinate inside focused project rooms.
        </p>
      </section>

      {error ? (
        <Alert variant="error" className="mb-5">
          {error}
        </Alert>
      ) : null}

      <section className="grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="panel grid max-h-[42svh] content-start overflow-hidden p-3 lg:max-h-[72vh]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-white/44">Active chats</h2>
            <span className="rounded-full border border-line bg-white/[0.025] px-2.5 py-1 text-xs font-semibold text-white/54">
              {chats.length}
            </span>
          </div>
          <div className="grid gap-2 overflow-y-auto pr-1">
            {chats.length ? (
              chats.map((chat) => (
                <ChatListItem
                  active={chat.id === chatId}
                  chat={chat}
                  currentUserId={user.uid}
                  key={chat.id}
                  onClick={() => navigate(`/chats/${chat.id}`)}
                  unreadCount={unreadByChat[chat.id] || 0}
                />
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-line bg-white/[0.015] px-3 py-8 text-center">
                <p className="text-sm font-semibold text-white">No chat rooms</p>
                <p className="mt-2 text-sm leading-6 text-white/42">
                  Chats appear here after an application is accepted.
                </p>
              </div>
            )}
          </div>
        </aside>

        <section className="panel grid min-h-[60svh] overflow-hidden lg:min-h-[520px]">
          {chatId && selectedChat ? (
            <>
              <div className="border-b border-line p-4">
                <Link to="/chats" className="mb-3 inline-flex items-center gap-2 text-xs font-semibold text-white/45 transition hover:text-white lg:hidden">
                  <ArrowLeft size={14} />
                  All chats
                </Link>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-semibold text-white">{selectedChat.projectTitle}</h2>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-white/40">
                      <Users size={14} />
                      {selectedChat.members?.length || 0} members
                    </p>
                    <p className="mt-1 inline-flex items-center gap-2 text-xs text-white/38">
                      <span className={`h-2 w-2 rounded-full ${selectedPeerOnline ? "bg-white/58" : "bg-white/24"}`} />
                      {selectedPeerOnline ? "Online" : `Offline${peerProfile?.lastActiveAt ? ` - ${formatRelativeTime(peerProfile.lastActiveAt)}` : ""}`}
                    </p>
                  </div>
                  <Button as="link" to={`/projects/${selectedChat.projectId}`} variant="secondary" className="w-full sm:w-auto">
                    View Project
                  </Button>
                </div>
              </div>

              <div className="chat-scroll-area max-h-[52svh] min-h-[280px] overflow-y-auto lg:max-h-[56vh] lg:min-h-[320px]">
                {messageError ? <Alert variant="error">{messageError}</Alert> : null}
                {typingUsers.length ? (
                  <p className="mx-4 mt-3 rounded-lg border border-line bg-white/[0.02] px-3 py-2 text-xs font-semibold text-white/48">
                    {typingUsers.slice(0, 2).join(", ")} {typingUsers.length > 1 ? "are" : "is"} typing...
                  </p>
                ) : null}
                {messagesLoading ? (
                  <LoadingState label="Loading messages" />
                ) : messages.length ? (
                  messages.map((message) => (
                    <MessageBubble
                      currentUserId={user.uid}
                      message={message}
                      key={message.id}
                      peerReadAt={selectedChat.readReceipts?.[selectedPeerId]}
                    />
                  ))
                ) : (
                  <div className="flex min-h-[240px] flex-col items-center justify-center text-center">
                    <span className="mb-3 rounded-lg border border-line bg-white/[0.025] p-3 text-white/54">
                      <MessageCircle size={20} />
                    </span>
                    <p className="text-sm font-semibold text-white">No messages yet</p>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-white/44">
                      Start with a quick note about what to build next.
                    </p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form className="border-t border-line p-3 sm:p-4" onSubmit={handleSend}>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <textarea
                    className="input min-h-11 flex-1 resize-y sm:min-h-0"
                    maxLength={2000}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Send a focused project update..."
                    value={draft}
                  />
                  <Button type="submit" disabled={sending || !draft.trim()} className="w-full sm:w-auto sm:self-end">
                    <Send size={16} />
                    {sending ? "Sending..." : "Send"}
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex min-h-[420px] flex-col items-center justify-center p-5 text-center">
              <span className="mb-4 rounded-xl border border-line bg-white/[0.025] p-3 text-white/54">
                <MessageCircle size={22} />
              </span>
              <h2 className="text-lg font-semibold text-white">{chats.length ? "Select a project chat" : "No active chats yet"}</h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-white/48">
                {chats.length
                  ? "Choose an active room from the list to review context and send real-time updates."
                  : "Chats are created automatically when a project owner accepts an applicant."}
              </p>
              {!chats.length ? (
                <Button as="link" to="/projects" variant="secondary" className="mt-5">
                  Explore Projects
                </Button>
              ) : null}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

function ChatListItem({ chat, active, currentUserId, onClick, unreadCount = 0 }) {
  const peerId = chat.members?.find((memberId) => memberId !== currentUserId);
  const peerName = chat.memberNames?.[peerId] || chat.memberNames?.[chat.applicantId] || "Project chat";

  return (
    <button
      type="button"
      className={`rounded-lg border p-3 text-left transition duration-150 hover:-translate-y-px hover:border-white/[0.08] hover:bg-white/[0.025] ${
        active ? "border-white/[0.08] bg-white/[0.04]" : "border-line bg-transparent"
      }`}
      onClick={onClick}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Avatar name={peerName} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{chat.projectTitle}</p>
          <p className="mt-0.5 truncate text-xs text-white/42">{peerName}</p>
        </div>
        {unreadCount ? (
          <span className="rounded-full border border-line bg-white/[0.04] px-2 py-0.5 text-[11px] font-bold text-white/68">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </div>
      <p className="mt-3 line-clamp-2 text-xs leading-5 text-white/42">
        {chat.lastMessage || "Chat room ready. Send the first message."}
      </p>
      <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/28">
        {formatRelativeTime(chat.lastMessageAt || chat.updatedAt || chat.createdAt)}
      </p>
    </button>
  );
}

function MessageBubble({ message, currentUserId, peerReadAt }) {
  const mine = message.senderId === currentUserId;
  const seen = mine && toTimestampNumber(peerReadAt) >= toTimestampNumber(message.createdAt);

  return (
    <article className="border-b border-line px-4 py-3 last:border-b-0">
      <div className="flex min-w-0 gap-3">
        <Avatar name={message.senderName || "Builder"} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            <span className="font-semibold text-white/78">{mine ? "You" : message.senderName || "Builder"}</span>
            <span className="text-white/30" title={formatDateTime(message.createdAt)}>
              {formatRelativeTime(message.createdAt)}
            </span>
            {mine ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-white/28">
                <CheckCheck size={12} />
                {seen ? "Seen" : "Delivered"}
              </span>
            ) : null}
          </div>
          <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-white/68">{message.text}</p>
        </div>
      </div>
    </article>
  );
}
