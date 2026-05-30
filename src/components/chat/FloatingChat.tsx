import { useEffect, useRef, useState } from "react";
import PlayChatPanel from "../play/PlayChatPanel";
import { config } from "../../config";
import "./FloatingChat.css";

interface FloatingChatProps {
  welcomeContent: string;
}

const TEASER_SEEN_KEY = "emir-chat-teaser-seen";
const TEASER_DELAY_MS = 3500;
const TEASER_AUTO_HIDE_MS = 9000;

const firstName = config.developer.fullName.split(" ")[0];

export const FloatingChat = ({ welcomeContent }: FloatingChatProps) => {
  const [open, setOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismissTeaser = () => {
    setShowTeaser(false);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    try {
      localStorage.setItem(TEASER_SEEN_KEY, "1");
    } catch {
      /* noop */
    }
  };

  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(TEASER_SEEN_KEY) === "1";
    } catch {
      /* noop */
    }
    if (seen) return;

    const showTimer = setTimeout(() => {
      setShowTeaser(true);
      hideTimerRef.current = setTimeout(() => {
        setShowTeaser(false);
      }, TEASER_AUTO_HIDE_MS);
    }, TEASER_DELAY_MS);

    return () => {
      clearTimeout(showTimer);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  const toggleOpen = () => {
    setOpen((v) => !v);
    if (showTeaser) dismissTeaser();
  };

  return (
    <div className={`floating-chat ${open ? "is-open" : ""}`}>
      <button
        type="button"
        className="floating-chat__fab"
        onClick={toggleOpen}
        aria-label={open ? "Close chat" : `Chat with ${firstName}`}
        aria-expanded={open}
        data-cursor="disable"
      >
        {open ? (
          <span className="floating-chat__close" aria-hidden>
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path
                d="M6 6l12 12M18 6L6 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </span>
        ) : (
          <>
            <span className="floating-chat__label">Ask me anything</span>
            <span className="floating-chat__avatar">
              <img src="/images/profile.jpg" alt={config.developer.fullName} />
              <span className="floating-chat__online" aria-hidden />
              <span className="floating-chat__ping" aria-hidden />
            </span>
          </>
        )}
      </button>

      {showTeaser && !open && (
        <button
          type="button"
          className="floating-chat__teaser"
          onClick={toggleOpen}
          data-cursor="disable"
        >
          <span
            className="floating-chat__teaser-close"
            role="button"
            aria-label="Dismiss"
            onClick={(e) => {
              e.stopPropagation();
              dismissTeaser();
            }}
          >
            ✕
          </span>
          <span className="floating-chat__teaser-text">
            Hey! I'm {firstName} <span aria-hidden>👋</span> Ask me anything.
          </span>
        </button>
      )}

      {open && (
        <div className="floating-chat__panel" role="dialog" aria-label="Chat">
          <PlayChatPanel welcomeContent={welcomeContent} />
        </div>
      )}
    </div>
  );
};

export default FloatingChat;
