import { Link } from "react-router-dom";
import { config } from "../config";
import "./styles/SeoFooter.css";

const SeoFooter = () => {
  return (
    <footer className="seo-footer" aria-label="Site summary for search engines">
      <h2>{config.developer.fullName}</h2>
      <p>{config.developer.title}</p>
      <p>{config.about.description}</p>

      <nav aria-label="Primary">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/myworks">All Projects</Link>
          </li>
          <li>
            <Link to="/play">Play Chess</Link>
          </li>
        </ul>
      </nav>

      <section aria-labelledby="seo-skills-heading">
        <h3 id="seo-skills-heading">Skills</h3>
        <p>{config.skills.develop.details}</p>
        <p>{config.skills.design.details}</p>
      </section>

      <section aria-labelledby="seo-projects-heading">
        <h3 id="seo-projects-heading">Featured Projects</h3>
        <ul>
          {config.projects.map((project) => (
            <li key={project.id}>
              <strong>{project.title}</strong> — {project.category}. {project.description}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="seo-contact-heading">
        <h3 id="seo-contact-heading">Contact</h3>
        <p>
          Email:{" "}
          <a href={`mailto:${config.contact.email}`}>{config.contact.email}</a>
        </p>
        <p>
          GitHub:{" "}
          <a href={config.contact.github} rel="me">
            {config.contact.github}
          </a>
        </p>
        <p>
          LinkedIn:{" "}
          <a href={config.contact.linkedin} rel="me">
            {config.contact.linkedin}
          </a>
        </p>
        <p>Location: {config.social.location}</p>
      </section>
    </footer>
  );
};

export default SeoFooter;
