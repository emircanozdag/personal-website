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
  const [expanded, setExpanded] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const focusedRef = useRef(false);
  const expandedRef = useRef(false);

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

  // When the on-screen keyboard opens (or the input is focused), expand the
  // panel into a full-screen sheet that is pinned exactly to the visible
  // viewport. Pinning top/left/width/height from visualViewport is required
  // on iOS WebKit (Safari/Chrome), where the layout viewport ignores the
  // keyboard and only the visual viewport shifts/shrinks.
  useEffect(() => {
    if (!open) {
      focusedRef.current = false;
      expandedRef.current = false;
      setExpanded(false);
      return;
    }

    const evaluate = () => {
      const vv = window.visualViewport;
      const keyboardOpen = vv
        ? window.innerHeight - vv.height > 120
        : false;
      const next = keyboardOpen || focusedRef.current;

      if (next !== expandedRef.current) {
        expandedRef.current = next;
        setExpanded(next);
      }

      const panel = panelRef.current;
      if (!panel || !vv) return;
      if (next) {
        panel.style.top = `${vv.offsetTop}px`;
        panel.style.left = `${vv.offsetLeft}px`;
        panel.style.width = `${vv.width}px`;
        panel.style.height = `${vv.height}px`;
      } else {
        panel.style.top = "";
        panel.style.left = "";
        panel.style.width = "";
        panel.style.height = "";
      }
    };

    const onFocusIn = () => {
      focusedRef.current = true;
      evaluate();
    };
    const onFocusOut = () => {
      window.setTimeout(() => {
        focusedRef.current =
          panelRef.current?.contains(document.activeElement) ?? false;
        evaluate();
      }, 50);
    };

    const panel = panelRef.current;
    panel?.addEventListener("focusin", onFocusIn);
    panel?.addEventListener("focusout", onFocusOut);

    const vv = window.visualViewport;
    vv?.addEventListener("resize", evaluate);
    vv?.addEventListener("scroll", evaluate);

    evaluate();
    return () => {
      panel?.removeEventListener("focusin", onFocusIn);
      panel?.removeEventListener("focusout", onFocusOut);
      vv?.removeEventListener("resize", evaluate);
      vv?.removeEventListener("scroll", evaluate);
    };
  }, [open]);

  const toggleOpen = () => {
    setOpen((v) => !v);
    if (showTeaser) dismissTeaser();
  };

  const closeChat = () => {
    const active = document.activeElement as HTMLElement | null;
    active?.blur?.();
    setOpen(false);
  };

  return (
    <div
      className={`floating-chat ${open ? "is-open" : ""} ${
        expanded ? "is-expanded" : ""
      }`}
    >
      {expanded && (
        <div
          className="floating-chat__backdrop"
          onClick={closeChat}
          aria-hidden
        />
      )}
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
        <div
          ref={panelRef}
          className="floating-chat__panel"
          role="dialog"
          aria-label="Chat"
        >
          {expanded && (
            <button
              type="button"
              className="floating-chat__sheet-close"
              onClick={closeChat}
              aria-label="Close chat"
              data-cursor="disable"
            >
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
          <PlayChatPanel welcomeContent={welcomeContent} />
        </div>
      )}
    </div>
  );
};

export default FloatingChat;
