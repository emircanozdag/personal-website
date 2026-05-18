import { forwardRef, ReactNode } from "react";
import { Link } from "react-router-dom";

export type DinqCardVariant = "default" | "accent" | "highlight" | "ghost";
export type DinqCardSpan = "half" | "full";

export type DinqCardProps = {
  variant?: DinqCardVariant;
  span?: DinqCardSpan;
  interactive?: boolean;
  showArrow?: boolean;
  glow?: boolean;
  className?: string;
  id?: string;
  /** Eyebrow / label above the title */
  eyebrow?: ReactNode;
  /** Small leading icon shown inside the header */
  icon?: ReactNode;
  /** Main heading line */
  title?: ReactNode;
  /** Sub-heading shown beneath title */
  subtitle?: ReactNode;
  /** Trailing element rendered after the header (status pill, etc.) */
  trailing?: ReactNode;
  /** Optional meta row rendered below subtitle */
  meta?: ReactNode;
  /** Card body content (rendered below the header block) */
  children?: ReactNode;
  /** Renders the card as an external <a> link */
  href?: string;
  target?: string;
  rel?: string;
  /** Renders the card as a react-router Link */
  to?: string;
  onClick?: () => void;
  ariaLabel?: string;
};

/**
 * DinqCard
 * --------
 * Glassy bento-style card primitive used throughout the mobile profile.
 * It can render as a div, anchor, or react-router Link depending on
 * which navigation prop is provided.
 */
const DinqCard = forwardRef<HTMLElement, DinqCardProps>(function DinqCard(
  {
    variant = "default",
    span = "full",
    interactive,
    showArrow,
    glow,
    className,
    id,
    eyebrow,
    icon,
    title,
    subtitle,
    trailing,
    meta,
    children,
    href,
    target,
    rel,
    to,
    onClick,
    ariaLabel,
  },
  ref
) {
  const isLink = Boolean(href || to);
  const isInteractive = interactive ?? isLink ?? Boolean(onClick);

  const classes = [
    "dinq-card",
    `dinq-card--${variant}`,
    `dinq-card--span-${span}`,
    isInteractive ? "is-interactive" : "",
    isLink ? "is-link" : "",
    glow ? "has-glow" : "",
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  const hasHeader = Boolean(eyebrow || icon || title || subtitle || trailing || meta);

  const content = (
    <>
      {glow && <span className="dinq-card__glow" aria-hidden />}
      {hasHeader && (
        <header className="dinq-card__header">
          {icon && <span className="dinq-card__icon" aria-hidden>{icon}</span>}
          <div className="dinq-card__heading">
            {eyebrow && <span className="dinq-card__eyebrow">{eyebrow}</span>}
            {title && <h3 className="dinq-card__title">{title}</h3>}
            {subtitle && <p className="dinq-card__subtitle">{subtitle}</p>}
            {meta && <div className="dinq-card__meta">{meta}</div>}
          </div>
          {trailing && <span className="dinq-card__trailing">{trailing}</span>}
          {showArrow && (
            <span className="dinq-card__arrow" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M7 17 17 7M9 7h8v8"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          )}
        </header>
      )}
      {children && <div className="dinq-card__body">{children}</div>}
    </>
  );

  if (to) {
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        to={to}
        id={id}
        className={classes}
        onClick={onClick}
        aria-label={ariaLabel}
        data-cursor="disable"
      >
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
        id={id}
        className={classes}
        onClick={onClick}
        aria-label={ariaLabel}
        data-cursor="disable"
      >
        {content}
      </a>
    );
  }

  return (
    <section
      ref={ref as React.Ref<HTMLElement>}
      id={id}
      className={classes}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {content}
    </section>
  );
});

export default DinqCard;
