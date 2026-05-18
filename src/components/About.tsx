import "./styles/About.css";
import { config } from "../config";

const About = () => {
  const { title, lead, description, highlights } = config.about;

  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <div className="about-card">
          <div className="about-rail" aria-hidden />
          <div className="about-grid">
            <header className="about-head">
              <span className="about-eyebrow">{title}</span>
              <h3 className="title about-title">{lead}</h3>
              <div className="about-rule" aria-hidden />
            </header>
            <div className="about-body">
              <p className="para about-para">{description}</p>
              {highlights && highlights.length > 0 && (
                <ul className="about-highlights" aria-label="Highlights">
                  {highlights.map((item) => (
                    <li key={item} className="about-chip">
                      <span className="about-chip-dot" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
