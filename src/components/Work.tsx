import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { config } from "../config";
import { Link } from "react-router-dom";
import { HiArrowLongLeft, HiArrowLongRight } from "react-icons/hi2";

gsap.registerPlugin(ScrollTrigger);

const Work = () => {
  const cardWidthRef = useRef<number>(0);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );
  const [atStart, setAtStart] = useState<boolean>(true);
  const [atEnd, setAtEnd] = useState<boolean>(false);

  useEffect(() => {
    const mobile = window.innerWidth <= 768;
    setIsMobile(mobile);
    // Disable pinning on mobile to allow scrolling
    if (mobile) return;

    let translateX: number = 0;

    function setTranslateX() {
      const box = document.getElementsByClassName("work-box");
      if (box.length === 0) return;
      const rectLeft = document
        .querySelector(".work-container")!
        .getBoundingClientRect().left;
      const rect = box[0].getBoundingClientRect();
      const parentWidth = box[0].parentElement!.getBoundingClientRect().width;
      let padding: number =
        parseInt(window.getComputedStyle(box[0]).padding) / 2;
      translateX = rect.width * box.length - (rectLeft + parentWidth) + padding;
      cardWidthRef.current = rect.width;
    }

    setTranslateX();

    let timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: `+=${translateX}`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        id: "work",
        invalidateOnRefresh: true,
        onRefresh: () => {
          setTranslateX();
        },
        onUpdate: (self) => {
          setAtStart(self.progress <= 0.001);
          setAtEnd(self.progress >= 0.999);
        },
      },
    });

    timeline.to(".work-flex", {
      x: -translateX,
      ease: "none",
    });

    // Refresh ScrollTrigger after layout settles
    ScrollTrigger.refresh();
    triggerRef.current = ScrollTrigger.getById("work") ?? null;

    // Clean up
    return () => {
      timeline.kill();
      ScrollTrigger.getById("work")?.kill();
      triggerRef.current = null;
    };
  }, []);

  const navigate = (direction: 1 | -1) => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const cardWidth = cardWidthRef.current || 600;
    const current = window.scrollY;
    const target = Math.min(
      Math.max(current + direction * cardWidth, trigger.start),
      trigger.end
    );
    window.scrollTo({ top: target, behavior: "smooth" });
  };
  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {config.projects.slice(0, 5).map((project, index) => (
            <div className="work-box" key={project.id}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>

                  <div>
                    <h4>{project.title}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <h4>Tools and features</h4>
                <p>{project.technologies}</p>
              </div>
              <WorkImage image={project.image} alt={project.title} />
            </div>
          ))}
          {/* See All Works Button */}
          <div className="work-box work-box-cta">
            <div className="see-all-works">
              <h3>Want to see more?</h3>
              <p>Explore all of my projects and creations</p>
              <Link to="/myworks" className="see-all-btn" data-cursor="disable">
                See All Works →
              </Link>
            </div>
          </div>
        </div>

        {!isMobile && (
          <div className="work-nav" data-cursor="disable">
            <button
              type="button"
              className="work-nav-btn work-nav-prev"
              onClick={() => navigate(-1)}
              disabled={atStart}
              aria-label="Previous project"
            >
              <span className="work-nav-btn__glow" aria-hidden="true" />
              <HiArrowLongLeft />
            </button>
            <button
              type="button"
              className="work-nav-btn work-nav-next"
              onClick={() => navigate(1)}
              disabled={atEnd}
              aria-label="Next project"
            >
              <span className="work-nav-btn__glow" aria-hidden="true" />
              <HiArrowLongRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Work;
