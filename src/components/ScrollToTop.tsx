import { useEffect, useState, useCallback } from "react";
import { lenis } from "./Navbar";
import "./styles/ScrollToTop.css";

const SHOW_THRESHOLD = 0.6;

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.innerHeight * SHOW_THRESHOLD;
      setVisible(window.scrollY > threshold);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const home =
      (document.getElementById("home") as HTMLElement | null) ||
      (document.querySelector(".landing-section") as HTMLElement | null);

    if (lenis) {
      const easing = (t: number) => 1 - Math.pow(1 - t, 3);
      if (home) {
        lenis.scrollTo(home, { offset: 0, duration: 1.0, easing, force: true });
      } else {
        lenis.scrollTo(0, { duration: 1.0, easing, force: true });
      }
      return;
    }

    if (home && "scrollIntoView" in home) {
      home.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  return (
    <button
      type="button"
      className={`scroll-to-top${visible ? " is-visible" : ""}`}
      onClick={handleClick}
      aria-label="Back to top"
      title="Back to top"
      data-cursor="disable"
      tabIndex={visible ? 0 : -1}
    >
      <span className="scroll-to-top-ring" aria-hidden />
      <svg
        className="scroll-to-top-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
      </svg>
      <span className="scroll-to-top-label">TOP</span>
    </button>
  );
};

export default ScrollToTop;
