import { useEffect, useRef, useState } from "react";
import { config } from "../../config";
import "./PlayChatPanel.css";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface PlayChatPanelProps {
  welcomeContent?: string;
}

interface BotConfig {
  welcomeMessage: string;
  quickReplies: string[];
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

const STORAGE_KEY = "emir-chat-history";
const SESSION_KEY = "emir-chat-session";
const LOG_IDLE_MS = 25_000;

const FALLBACK_WELCOME = `Hello there! I am ${config.developer.fullName} 👋 Ask me anything you want to know!`;

const createSessionId = (): string => {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    /* noop */
  }
  return `sess-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const getSessionId = (): string => {
  try {
    const existing = localStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const fresh = createSessionId();
    localStorage.setItem(SESSION_KEY, fresh);
    return fresh;
  } catch {
    return createSessionId();
  }
};

export const PlayChatPanel = ({ welcomeContent }: PlayChatPanelProps) => {
  const [botConfig, setBotConfig] = useState<BotConfig | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const sessionIdRef = useRef<string>(getSessionId());
  const chatMessagesRef = useRef<ChatMessage[]>(chatMessages);
  const lastSentCountRef = useRef<number>(0);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const configLoadedRef = useRef(false);

  // Fetch bot config once (welcome message, quick replies, maintenance mode)
  useEffect(() => {
    if (configLoadedRef.current) return;
    configLoadedRef.current = true;

    fetch("/api/bot-config")
      .then((r) => (r.ok ? r.json() : null))
      .then((cfg: BotConfig | null) => {
        setBotConfig(cfg);

        // Initialize chat messages now that we have the welcome content
        const welcome = welcomeContent ?? cfg?.welcomeMessage ?? FALLBACK_WELCOME;
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            const parsed = JSON.parse(saved) as ChatMessage[];
            if (Array.isArray(parsed) && parsed.length > 0) {
              setChatMessages(parsed);
              return;
            }
          }
        } catch {
          /* noop */
        }
        setChatMessages([{ role: "assistant", content: welcome }]);
      })
      .catch(() => {
        const welcome = welcomeContent ?? FALLBACK_WELCOME;
        setBotConfig({ welcomeMessage: welcome, quickReplies: [], maintenanceMode: false, maintenanceMessage: "" });
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            const parsed = JSON.parse(saved) as ChatMessage[];
            if (Array.isArray(parsed) && parsed.length > 0) {
              setChatMessages(parsed);
              return;
            }
          }
        } catch {
          /* noop */
        }
        setChatMessages([{ role: "assistant", content: welcome }]);
      });
  }, [welcomeContent]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

  useEffect(() => {
    chatMessagesRef.current = chatMessages;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chatMessages));
    } catch {
      /* noop */
    }
  }, [chatMessages]);

  const flushLog = () => {
    const messages = chatMessagesRef.current;
    const userMsgCount = messages.filter((m) => m.role === "user").length;
    if (userMsgCount === 0 || userMsgCount === lastSentCountRef.current) return;
    lastSentCountRef.current = userMsgCount;

    const body = JSON.stringify({
      sessionId: sessionIdRef.current,
      messages,
    });

    try {
      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        const blob = new Blob([body], { type: "application/json" });
        navigator.sendBeacon("/api/log-chat", blob);
        return;
      }
    } catch {
      /* noop */
    }

    fetch("/api/log-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => { /* noop */ });
  };

  const scheduleLog = () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(flushLog, LOG_IDLE_MS);
  };

  useEffect(() => {
    const handleHide = () => {
      if (document.visibilityState === "hidden" || document.visibilityState === undefined) {
        flushLog();
      }
    };
    const handlePageHide = () => flushLog();

    document.addEventListener("visibilitychange", handleHide);
    window.addEventListener("pagehide", handlePageHide);
    return () => {
      document.removeEventListener("visibilitychange", handleHide);
      window.removeEventListener("pagehide", handlePageHide);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  const sendMessage = async (text?: string) => {
    const msg = (text ?? chatInput).trim();
    if (!msg || isTyping) return;

    if (botConfig?.maintenanceMode) {
      setChatMessages((prev) => [
        ...prev,
        { role: "user", content: msg },
        { role: "assistant", content: botConfig.maintenanceMessage || "Chat is temporarily unavailable." },
      ]);
      setChatInput("");
      return;
    }

    const userMessage: ChatMessage = { role: "user", content: msg };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsTyping(true);

    try {
      const history = chatMessages
        .filter((m) => m.role !== "system")
        .map((m) => ({ role: m.role, content: m.content }));

      // System prompt is now built server-side in api/chat.js
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...history, { role: "user", content: msg }] }),
      });

      const data = await response.json();

      if (data?.choices?.[0]?.message?.content) {
        setChatMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.choices[0].message.content as string,
          },
        ]);
      } else {
        throw new Error(data?.error || "Invalid response");
      }
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, having some connection issues. Try again? 😅",
        },
      ]);
    } finally {
      setIsTyping(false);
      scheduleLog();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputFocus = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ block: "nearest" });
    }, 300);
  };

  const isMaintenance = botConfig?.maintenanceMode ?? false;
  const quickReplies = botConfig?.quickReplies ?? [];

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <span className="chat-title">💬 Talk with me</span>
      </div>

      <div className="chat-messages">
        {chatMessages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.role}`}>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
        {isTyping && (
          <div className="chat-message assistant">
            <div className="message-content typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick reply chips — show only when chat is fresh (1 message = welcome only) */}
      {quickReplies.length > 0 && chatMessages.length <= 1 && !isMaintenance && (
        <div className="chat-quick-replies">
          {quickReplies.map((reply, i) => (
            <button
              key={i}
              className="chat-quick-reply"
              onClick={() => sendMessage(reply)}
              disabled={isTyping}
              data-cursor="disable"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {isMaintenance && (
        <div className="chat-maintenance-notice">
          🔧 Chat geçici olarak kapalı
        </div>
      )}

      <div className="chat-input-area">
        <input
          type="text"
          className="chat-input"
          placeholder={isMaintenance ? "Chat şu an kapalı…" : "Type a message..."}
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          disabled={isTyping || isMaintenance}
          data-cursor="disable"
          aria-label="Chat input"
        />
        <button
          type="button"
          className="chat-send-btn"
          onClick={() => sendMessage()}
          disabled={isTyping || !chatInput.trim() || isMaintenance}
          data-cursor="disable"
          aria-label="Send message"
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default PlayChatPanel;
