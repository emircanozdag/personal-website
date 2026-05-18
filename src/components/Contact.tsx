import {
  MdCopyright,
  MdEmail,
  MdLocationOn,
  MdContentCopy,
  MdCheck,
} from "react-icons/md";
import { FaGithub, FaLinkedinIn, FaXTwitter, FaInstagram } from "react-icons/fa6";
import "./styles/Contact.css";
import { config } from "../config";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const contactTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".contact-section",
        start: "top 80%",
        end: "bottom center",
        toggleActions: "play none none none",
      },
    });

    contactTimeline
      .fromTo(
        ".contact-eyebrow",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
      )
      .fromTo(
        ".contact-title",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
        "-=0.25"
      )
      .fromTo(
        ".contact-subtitle",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
        "-=0.4"
      )
      .fromTo(
        ".contact-card",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: "power3.out" },
        "-=0.3"
      )
      .fromTo(
        ".contact-foot",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
        "-=0.2"
      );

    return () => {
      contactTimeline.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === ".contact-section") st.kill();
      });
    };
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(config.contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      // fallback noop
    }
  };

  const socials = [
    {
      label: "GitHub",
      href: config.contact.github,
      Icon: FaGithub,
    },
    {
      label: "LinkedIn",
      href: config.contact.linkedin,
      Icon: FaLinkedinIn,
    },
    {
      label: "Twitter / X",
      href: config.contact.twitter,
      Icon: FaXTwitter,
    },
    {
      label: "Instagram",
      href: config.contact.instagram,
      Icon: FaInstagram,
    },
  ];

  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <div className="contact-glow" aria-hidden />

        <header className="contact-header">
          <span className="contact-eyebrow">
            <span className="contact-dot" aria-hidden />
            GET IN TOUCH
          </span>
          <h3 className="contact-title">
            Let’s build something
            <br />
            <span className="contact-title-grad">extraordinary</span> together.
          </h3>
          <p className="contact-subtitle">
            Have a project, an idea, or just want to say hi? My inbox is always
            open — I’ll get back to you as soon as I can.
          </p>
        </header>

        <div className="contact-grid">
          <a
            href={`mailto:${config.contact.email}`}
            className="contact-card contact-card-email"
            data-cursor="disable"
          >
            <div className="contact-card-icon">
              <MdEmail />
            </div>
            <div className="contact-card-body">
              <span className="contact-card-label">EMAIL ME</span>
              <span className="contact-card-value">{config.contact.email}</span>
            </div>
            <button
              type="button"
              className={`contact-copy ${copied ? "is-copied" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleCopyEmail();
              }}
              aria-label="Copy email"
              data-cursor="disable"
            >
              {copied ? <MdCheck /> : <MdContentCopy />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </a>

          <div className="contact-side">
            <div className="contact-card contact-card-info">
              <div className="contact-card-icon contact-card-icon-sm">
                <MdLocationOn />
              </div>
              <div className="contact-card-body">
                <span className="contact-card-label">LOCATION</span>
                <span className="contact-card-value-sm">
                  {config.social.location}
                </span>
              </div>
            </div>

            <div className="contact-card contact-card-info">
              <div className="contact-status" aria-hidden>
                <span className="contact-status-pulse" />
              </div>
              <div className="contact-card-body">
                <span className="contact-card-label">AVAILABILITY</span>
                <span className="contact-card-value-sm">
                  Open to opportunities
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-socials" aria-label="Social profiles">
          {socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-social-btn"
              aria-label={label}
              data-tooltip={label}
              data-cursor="disable"
            >
              <Icon />
            </a>
          ))}
        </div>

        <div className="contact-foot">
          <p className="contact-foot-credit">
            Designed &amp; developed by{" "}
            <span>{config.developer.fullName}</span>
          </p>
          <p className="contact-foot-rights">
            <MdCopyright /> {new Date().getFullYear()} — All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
