import { useEffect, useMemo, useRef, useState } from "react";
import {
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";
import {
  MdAccessTime,
  MdCheck,
  MdContentCopy,
  MdEmail,
  MdLocationOn,
  MdRocketLaunch,
  MdAutoAwesome,
  MdWeb,
  MdWorkOutline,
  MdCode,
} from "react-icons/md";
import { config } from "../../config";
import DinqCard from "./DinqCard";
import "../styles/MobileProfile.css";

const techStackChips = [
  "Python",
  "TypeScript",
  "JavaScript",
  "React",
  "Next.js",
  "Node.js",
  "FastAPI",
  "PyTorch",
  "TensorFlow",
  "LLMs",
  "NLP",
  "Docker",
  "MongoDB",
  "PostgreSQL",
  "Linux",
  "Git",
  "TailwindCSS",
  "Vercel",
  "AWS",
];

const heroMarqueeChips = [
  "React",
  "TypeScript",
  "Python",
  "PyTorch",
  "LLMs",
  "Next.js",
  "FastAPI",
  "Node.js",
  "TensorFlow",
  "Docker",
];

const getDisplayYear = (period: string) => {
  if (period.includes("Present")) return "NOW";
  if (period.includes(" - ")) return period.split(" - ")[0];
  return period;
};

const MOBILE_HERO_ROLES = [
  "AI & Full-Stack Developer",
  "LLM & Agent Engineer",
  "Chess Engine Author",
  "ML Tinkerer & Automator",
];

const HERO_TIMEZONE = "Europe/Istanbul";

const istanbulHourFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: HERO_TIMEZONE,
  hour: "2-digit",
  hour12: false,
});

const istanbulTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: HERO_TIMEZONE,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const getIstanbulHour = (date: Date): number => {
  const parsed = parseInt(istanbulHourFormatter.format(date), 10);
  return Number.isFinite(parsed) ? parsed : date.getHours();
};

const formatIstanbulTime = (date: Date): string =>
  istanbulTimeFormatter.format(date);

const getGreetingForHour = (hour: number): string => {
  if (hour >= 5 && hour < 12) return "Good morning,";
  if (hour >= 12 && hour < 17) return "Good afternoon,";
  if (hour >= 17 && hour < 22) return "Good evening,";
  return "Working late,";
};

type StatusTone = "online" | "focus" | "offline";

const getStatusForHour = (
  hour: number
): { tone: StatusTone; label: string } => {
  if (hour >= 9 && hour < 22) return { tone: "online", label: "Available" };
  if (hour >= 1 && hour < 5) return { tone: "offline", label: "Sleeping" };
  return { tone: "focus", label: "Heads-down" };
};

const useNow = (intervalMs = 60_000): Date => {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return now;
};

const usePrefersReducedMotion = (): boolean => {
  return useMemo(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
};

const useRotator = (
  length: number,
  intervalMs = 2800,
  paused = false
): number => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (paused || length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [length, intervalMs, paused]);

  return index;
};

const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);

const useCountUp = (
  target: number,
  start: boolean,
  duration = 1200,
  instant = false
): number => {
  const [value, setValue] = useState<number>(instant ? target : 0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (instant) {
      setValue(target);
      return;
    }
    if (!start) return;

    const startTime = performance.now();
    const from = 0;

    const tick = (timestamp: number) => {
      const progress = Math.min(1, (timestamp - startTime) / duration);
      const eased = easeOutQuart(progress);
      setValue(Math.round(from + (target - from) * eased));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [target, start, duration, instant]);

  return value;
};

const MobileProfile = () => {
  const [copied, setCopied] = useState(false);
  const [statsStarted, setStatsStarted] = useState(false);
  const statsRef = useRef<HTMLUListElement | null>(null);

  const { developer, social, about, contact, skills, projects, experiences } =
    config;

  const nameParts = developer.fullName.split(" ");
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
  const firstName = nameParts.slice(0, -1).join(" ") || developer.fullName;

  const prefersReducedMotion = usePrefersReducedMotion();

  const now = useNow();
  const istanbulHour = getIstanbulHour(now);
  const greetingWord = getGreetingForHour(istanbulHour);
  const liveTime = formatIstanbulTime(now);
  const status = getStatusForHour(istanbulHour);

  const roleIndex = useRotator(
    MOBILE_HERO_ROLES.length,
    2800,
    prefersReducedMotion
  );
  const currentRole = MOBILE_HERO_ROLES[roleIndex];

  const yearsCount = useCountUp(
    experiences.length,
    statsStarted,
    1200,
    prefersReducedMotion
  );
  const projectsCount = useCountUp(
    projects.length,
    statsStarted,
    1200,
    prefersReducedMotion
  );
  const eloCount = useCountUp(3640, statsStarted, 1400, prefersReducedMotion);

  useEffect(() => {
    if (statsStarted) return;
    const node = statsRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setStatsStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setStatsStarted(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [statsStarted]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* noop */
    }
  };

  const socialCards: Array<{
    key: string;
    label: string;
    href: string;
    icon: JSX.Element;
  }> = [
    {
      key: "github",
      label: "GitHub",
      href: contact.github,
      icon: <FaGithub />,
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      href: contact.linkedin,
      icon: <FaLinkedinIn />,
    },
    {
      key: "twitter",
      label: "X / Twitter",
      href: contact.twitter,
      icon: <FaXTwitter />,
    },
    {
      key: "instagram",
      label: "Instagram",
      href: contact.instagram,
      icon: <FaInstagram />,
    },
  ];

  return (
    <div className="mobile-profile" id="home">
      {/* ─── Hero ─── */}
      <header className="mp-hero">
        <div className="mp-hero__avatar">
          <span className="mp-hero__avatar-ring" aria-hidden />
          <img src="/images/profile.jpg" alt={developer.fullName} />
          <span
            className="mp-hero__status"
            data-tone={status.tone}
            aria-label={`${status.label} — local time ${liveTime} in Ankara`}
          >
            <span className="mp-hero__status-dot" aria-hidden />
            {status.label}
          </span>
        </div>

        <p className="mp-hero__greeting" aria-hidden>
          <span key={greetingWord} className="mp-hero__greeting-word">
            {greetingWord}
          </span>{" "}
          <span className="mp-hero__greeting-word">I'm</span>{" "}
          <span
            className="mp-hero__wave"
            role="img"
            aria-label="waving hand"
          >
            👋
          </span>
        </p>

        <h1 className="mp-hero__name">
          <span className="mp-hero__name-first">{firstName}</span>
          {lastName && (
            <span className="mp-hero__name-last">{lastName}</span>
          )}
        </h1>

        <p className="mp-hero__role" aria-live="polite">
          <span key={roleIndex} className="mp-hero__role-text">
            {currentRole}
          </span>
        </p>
        <div className="mp-hero__meta">
          <span className="mp-hero__location">
            <MdLocationOn />
            {social.location}
          </span>
          <span
            className="mp-hero__time"
            aria-label={`Local time in Ankara: ${liveTime}`}
          >
            <MdAccessTime aria-hidden />
            <span className="mp-hero__time-value">{liveTime}</span>
            <span className="mp-hero__time-zone">Ankara</span>
          </span>
        </div>

        <ul
          ref={statsRef}
          className="mp-hero__stats"
          aria-label="Quick stats"
        >
          <li>
            <strong>
              <span aria-hidden>{yearsCount}+</span>
              <span className="mp-hero__stats-sr">
                {experiences.length}+
              </span>
            </strong>
            <span>Years</span>
          </li>
          <li>
            <strong>
              <span aria-hidden>{projectsCount}+</span>
              <span className="mp-hero__stats-sr">
                {projects.length}+
              </span>
            </strong>
            <span>Projects</span>
          </li>
          <li>
            <strong>
              <span aria-hidden>{eloCount}</span>
              <span className="mp-hero__stats-sr">3640</span>
            </strong>
            <span>Chess ELO</span>
          </li>
        </ul>

        <div className="mp-hero__actions">
          <a
            href={`mailto:${contact.email}`}
            className="mp-hero__btn mp-hero__btn--primary"
          >
            <MdEmail />
            Get in touch
          </a>
          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="mp-hero__btn"
          >
            <FaGithub />
            Follow
          </a>
        </div>

        <div className="mp-hero__now" aria-label="Currently building">
          <div className="mp-hero__now-row">
            <span className="mp-hero__now-pulse" aria-hidden />
            <span className="mp-hero__now-label">Currently</span>
            <span className="mp-hero__now-text">
              Building AI Agents &amp; LLMs
            </span>
          </div>

          <div className="mp-hero__marquee" aria-hidden>
            <ul className="mp-hero__marquee-track">
              {[...heroMarqueeChips, ...heroMarqueeChips].map((tech, i) => (
                <li key={`${tech}-${i}`}>{tech}</li>
              ))}
            </ul>
          </div>
        </div>

        <a
          href="#about"
          className="mp-hero__scroll-cue"
          aria-label="Scroll to about"
        >
          <span className="mp-hero__scroll-label">Scroll</span>
          <span className="mp-hero__scroll-line" aria-hidden />
        </a>
      </header>

      {/* ─── About ─── */}
      <section className="mp-section" id="about">
        <div className="mp-section__head">
          <span className="mp-section__label">About</span>
          <span className="mp-section__hint">{about.title}</span>
        </div>
        <DinqCard
          variant="accent"
          glow
          eyebrow={about.title}
          title={about.lead}
        >
          <p>{about.description}</p>
          {about.highlights?.length > 0 && (
            <ul className="mp-chips" aria-label="Highlights">
              {about.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </DinqCard>
      </section>

      {/* ─── What I Do (Skills) ─── */}
      <section className="mp-section" id="whatido">
        <div className="mp-section__head">
          <span className="mp-section__label">What I do</span>
          <span className="mp-section__hint">Focus areas</span>
        </div>
        <div className="mp-grid">
          <DinqCard
            span="half"
            icon={<MdAutoAwesome />}
            eyebrow={skills.develop.title}
            title={skills.develop.description}
          >
            <p>{skills.develop.details}</p>
            <div className="mp-skill__tools">
              {skills.develop.tools.slice(0, 8).map((tool) => (
                <span key={tool}>{tool}</span>
              ))}
            </div>
          </DinqCard>
          <DinqCard
            span="half"
            icon={<MdWeb />}
            eyebrow={skills.design.title}
            title={skills.design.description}
          >
            <p>{skills.design.details}</p>
            <div className="mp-skill__tools">
              {skills.design.tools.slice(0, 8).map((tool) => (
                <span key={tool}>{tool}</span>
              ))}
            </div>
          </DinqCard>
        </div>
      </section>

      {/* ─── Career ─── */}
      <section className="mp-section" id="experience">
        <div className="mp-section__head">
          <span className="mp-section__label">Career</span>
          <span className="mp-section__hint">{experiences.length} roles</span>
        </div>
        <DinqCard icon={<MdWorkOutline />} title="Experience timeline">
          <ol className="mp-career">
            {experiences.map((exp) => (
              <li key={`${exp.position}-${exp.period}`} className="mp-career__item">
                <div className="mp-career__row">
                  <h4 className="mp-career__role">{exp.position}</h4>
                  <span className="mp-career__period">
                    {getDisplayYear(exp.period)}
                  </span>
                </div>
                <p className="mp-career__company">{exp.company}</p>
                <p className="mp-career__desc">{exp.description}</p>
              </li>
            ))}
          </ol>
        </DinqCard>
      </section>

      {/* ─── Projects ─── */}
      <section className="mp-section" id="work">
        <div className="mp-section__head">
          <span className="mp-section__label">Selected work</span>
          <span className="mp-section__hint">{projects.length} projects</span>
        </div>
        <DinqCard icon={<MdRocketLaunch />} title="Latest projects">
          <div className="mp-projects">
            {projects.slice(0, 5).map((project) => (
              <a
                key={project.id}
                href="#work"
                className="mp-project"
                onClick={(e) => e.preventDefault()}
                aria-label={project.title}
              >
                <div className="mp-project__thumb">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                  />
                </div>
                <div className="mp-project__info">
                  <span className="mp-project__category">
                    {project.category}
                  </span>
                  <h4 className="mp-project__title">{project.title}</h4>
                  <p className="mp-project__tech">{project.technologies}</p>
                </div>
              </a>
            ))}
            <a href="/myworks" className="mp-projects__cta">
              See all works
              <span aria-hidden>→</span>
            </a>
          </div>
        </DinqCard>
      </section>

      {/* ─── Tech stack ─── */}
      <section className="mp-section" id="techstack">
        <div className="mp-section__head">
          <span className="mp-section__label">Tech stack</span>
          <span className="mp-section__hint">{techStackChips.length}+ tools</span>
        </div>
        <DinqCard icon={<MdCode />} title="Tools I build with">
          <div className="mp-stack">
            {techStackChips.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
        </DinqCard>
      </section>

      {/* ─── Play with me ─── */}
      <section className="mp-section">
        <div className="mp-section__head">
          <span className="mp-section__label">Play with me</span>
          <span className="mp-section__hint">For fun</span>
        </div>
        <DinqCard
          className="mp-play"
          variant="highlight"
          to="/play"
          showArrow
          icon={
            <svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
              <g
                fillRule="evenodd"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.6"
              >
                <path
                  fill="currentColor"
                  fillOpacity="0.18"
                  d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21"
                />
                <path
                  fill="currentColor"
                  fillOpacity="0.18"
                  d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3"
                />
              </g>
            </svg>
          }
          eyebrow="Challenge me"
          title="Play my chess engine"
          subtitle="RedoxChess — neural-network evaluation, bitboards & UCI."
          trailing={<span className="mp-play__rating">3640 ELO</span>}
        />
      </section>

      {/* ─── Contact ─── */}
      <section className="mp-section" id="contact">
        <div className="mp-section__head">
          <span className="mp-section__label">Contact</span>
          <span className="mp-section__hint">Inbox always open</span>
        </div>

        <DinqCard
          variant="accent"
          icon={<MdEmail />}
          eyebrow="Email me"
          title={contact.email}
        >
          <div className="mp-email__row">
            <span className="mp-email__value">Tap copy or write me directly.</span>
            <button
              type="button"
              className={`mp-email__copy ${copied ? "is-copied" : ""}`}
              onClick={handleCopy}
              aria-label="Copy email"
            >
              {copied ? <MdCheck /> : <MdContentCopy />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </DinqCard>

        <div className="mp-grid">
          <DinqCard
            variant="ghost"
            span="half"
            icon={<MdLocationOn />}
            eyebrow="Location"
            title={social.location}
          />
          <DinqCard
            variant="ghost"
            span="half"
            icon={
              <span style={{ display: "inline-flex" }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#6ee7a4",
                    boxShadow: "0 0 0 4px rgba(110,231,164,0.18)",
                  }}
                />
              </span>
            }
            eyebrow="Status"
            title="Open to work"
          />
        </div>

        <div className="mp-social-row" aria-label="Social profiles">
          {socialCards.map((s) => (
            <a
              key={s.key}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`mp-social-btn mp-social-btn--${s.key}`}
              aria-label={s.label}
            >
              {s.icon}
            </a>
          ))}
        </div>
      </section>

      <footer className="mp-foot">
        <p>
          Designed &amp; developed by{" "}
          <strong>{developer.fullName}</strong>
        </p>
        <p>© {new Date().getFullYear()} — All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MobileProfile;
