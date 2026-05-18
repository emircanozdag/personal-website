import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import "./styles/Landing.css";
import { config } from "../config";

const Landing = ({ children }: PropsWithChildren) => {
  const nameParts = config.developer.fullName.split(" ");
  const firstName = nameParts[0] || config.developer.name;
  const lastName = nameParts.slice(1).join(" ") || "";

  return (
    <>
      <div className="landing-section" id="home">
        <div className="landing-hero-bg" aria-hidden />
        <div className="landing-container">
          <div className="landing-intro">
            <p className="landing-kicker">{config.social.location}</p>
            <h2>Hello! I'm</h2>
            <div className="landing-name-rule" aria-hidden />
            <h1>
              {firstName.toUpperCase()}{" "}
              <br />
              {lastName && <span>{lastName.toUpperCase()}</span>}
            </h1>
          </div>
          <div className="landing-info">
            <h3>Focus</h3>
            <h2 className="landing-role">
              <span className="landing-role-accent">Full-Stack</span>
              <span className="landing-role-divider" aria-hidden />
              <span className="landing-role-rest">Developer</span>
            </h2>

            <Link
              to="/play"
              className="landing-play-card"
              data-cursor="disable"
              aria-label="Play chess against my 3640 ELO engine"
            >
              <span className="landing-play-glow" aria-hidden />

              <span className="landing-play-icon" aria-hidden>
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
                    <circle
                      cx="9"
                      cy="25.5"
                      r="0.7"
                      fill="currentColor"
                      stroke="none"
                    />
                    <path
                      fill="currentColor"
                      stroke="none"
                      d="M15.067 16.25c.276.478.082 1.252-.433 1.731s-1.156.479-1.432 0c-.276-.478-.082-1.252.433-1.731s1.156-.479 1.432 0z"
                    />
                  </g>
                </svg>
              </span>

              <span className="landing-play-text">
                <span className="landing-play-eyebrow">
                  <span className="landing-play-dot" aria-hidden />
                  Play with me
                </span>
                <span className="landing-play-headline">
                  Challenge my chess engine
                </span>
                <span className="landing-play-meta">
                  <span className="landing-play-rating">3640 ELO</span>
                  <span className="landing-play-sep" aria-hidden />
                  <span className="landing-play-engine">RedoxChess</span>
                </span>
              </span>

              <span className="landing-play-arrow" aria-hidden>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          </div>
          <div className="mobile-photo">
            <img src="/images/profile.jpg" alt={config.developer.fullName} />
          </div>
          <div className="landing-scroll-hint" aria-hidden="true">
            <span className="landing-scroll-label">Scroll</span>
            <span className="landing-scroll-line" />
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
