import { ArrowLeft, MessageCircle, Send, Users } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Alert from "../components/ui/Alert.jsx";
import Avatar from "../components/ui/Avatar.jsx";
import Button from "../components/ui/Button.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import LoadingState from "../components/ui/LoadingState.jsx";
import { useToast } from "../components/ui/ToastProvider.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  getUserProfile,
  listenChatMessages,
  listenNotifications,
  listenUserChats,
  markNotificationRead,
  sendChatMessage,
} from "../services/firestore.js";
import { formatDateTime, formatRelativeTime } from "../utils/format.js";
import { getServiceErrorMessage } from "../utils/messages.js";

export default function ChatPage() {
  const { chatId } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [chatLoading, setChatLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(Boolean(chatId));
  const [error, setError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();

  const selectedChat = useMemo(() => chats.find((chat) => chat.id === chatId) || null, [chatId, chats]);
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
    if (!chatId) return;

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
    <main className="page-shell page-reveal py-6 sm:py-10">
      <section className="panel-soft glass-reflect mb-6 overflow-hidden p-5 sm:p-6">
        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan/55 to-transparent" aria-hidden="true" />
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

      {!chats.length ? (
        <EmptyState
          title="No active chats yet"
          description="Chats are created automatically when a project owner accepts an applicant."
          actionLabel="Explore Projects"
          actionTo="/projects"
        />
      ) : (
        <section className="grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="panel grid max-h-[72vh] content-start overflow-hidden p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/48">Active chats</h2>
              <span className="rounded-full border border-cyan/20 bg-cyan/10 px-2.5 py-1 text-xs font-semibold text-cyan">
                {chats.length}
              </span>
            </div>
            <div className="grid gap-2 overflow-y-auto pr-1">
              {chats.map((chat) => (
                <ChatListItem
                  active={chat.id === chatId}
                  chat={chat}
                  currentUserId={user.uid}
                  key={chat.id}
                  onClick={() => navigate(`/chats/${chat.id}`)}
                  unreadCount={unreadByChat[chat.id] || 0}
                />
              ))}
            </div>
          </aside>

          <section className="panel grid min-h-[520px] overflow-hidden">
            {chatId && selectedChat ? (
              <>
                <div className="border-b border-line p-4 sm:p-5">
                  <Link to="/chats" className="mb-3 inline-flex items-center gap-2 text-xs font-semibold text-white/45 transition hover:text-white lg:hidden">
                    <ArrowLeft size={14} />
                    All chats
                  </Link>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-semibold text-white">{selectedChat.projectTitle}</h2>
                      <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-white/42">
                        <Users size={14} />
                        {selectedChat.members?.length || 0} members
                      </p>
                    </div>
                    <Button as="link" to={`/projects/${selectedChat.projectId}`} variant="secondary" className="w-full sm:w-auto">
                      View Project
                    </Button>
                  </div>
                </div>

                <div className="grid max-h-[56vh] min-h-[320px] content-start gap-3 overflow-y-auto p-4 sm:p-5">
                  {messageError ? <Alert variant="error">{messageError}</Alert> : null}
                  {messagesLoading ? (
                    <LoadingState label="Loading messages" />
                  ) : messages.length ? (
                    messages.map((message) => (
                      <MessageBubble currentUserId={user.uid} message={message} key={message.id} />
                    ))
                  ) : (
                    <div className="flex min-h-[240px] flex-col items-center justify-center text-center">
                      <span className="mb-3 rounded-lg border border-cyan/20 bg-cyan/10 p-3 text-cyan">
                        <MessageCircle size={22} />
                      </span>
                      <p className="text-sm font-semibold text-white">No messages yet</p>
                      <p className="mt-2 max-w-sm text-sm leading-6 text-white/44">
                        Start with a quick note about what to build next.
                      </p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form className="border-t border-line p-4 sm:p-5" onSubmit={handleSend}>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <textarea
                      className="input min-h-12 flex-1 resize-y sm:min-h-0"
                      maxLength={2000}
                      onChange={(event) => setDraft(event.target.value)}
                      placeholder="Send a focused project update..."
                      value={draft}
                    />
                    <Button type="submit" disabled={sending || !draft.trim()} className="sm:self-end">
                      <Send size={16} />
                      {sending ? "Sending..." : "Send"}
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex min-h-[420px] flex-col items-center justify-center p-6 text-center">
                <span className="mb-4 rounded-lg border border-cyan/20 bg-cyan/10 p-3 text-cyan shadow-glow">
                  <MessageCircle size={24} />
                </span>
                <h2 className="text-lg font-semibold text-white">Select a project chat</h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-white/48">
                  Choose an active room from the list to review context and send real-time updates.
                </p>
              </div>
            )}
          </section>
        </section>
      )}
    </main>
  );
}

function ChatListItem({ chat, active, currentUserId, onClick, unreadCount = 0 }) {
  const peerId = chat.members?.find((memberId) => memberId !== currentUserId);
  const peerName = chat.memberNames?.[peerId] || chat.memberNames?.[chat.applicantId] || "Project chat";

  return (
    <button
      type="button"
      className={`rounded-lg border p-3 text-left transition hover:-translate-y-0.5 hover:border-cyan/30 hover:bg-cyan/10 ${
        active ? "border-cyan/35 bg-cyan/10 shadow-[0_0_34px_rgba(103,232,249,0.1)]" : "border-white/[0.1] bg-white/[0.04]"
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
          <span className="rounded-full border border-mint/25 bg-mint/10 px-2 py-0.5 text-[11px] font-bold text-mint">
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

function MessageBubble({ message, currentUserId }) {
  const mine = message.senderId === currentUserId;

  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[88%] rounded-lg border px-4 py-3 sm:max-w-[72%] ${
          mine
            ? "border-cyan/25 bg-cyan/15 text-white shadow-[0_0_28px_rgba(103,232,249,0.08)]"
            : "border-white/[0.1] bg-white/[0.055] text-white"
        }`}
      >
        <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          <span className="font-semibold text-white/78">{message.senderName || "Builder"}</span>
          <span className="text-white/32" title={formatDateTime(message.createdAt)}>
            {formatRelativeTime(message.createdAt)}
          </span>
        </div>
        <p className="whitespace-pre-wrap break-words text-sm leading-6 text-white/72">{message.text}</p>
      </div>
    </div>
  );
}
