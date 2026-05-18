import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import Lenis from "lenis";
import { config } from "../config";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollTrigger);
export let lenis: Lenis | null = null;

const Navbar = () => {
  useEffect(() => {
    lenis = new Lenis({
      duration: 1.7,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.7,
      touchMultiplier: 2,
      infinite: false,
    });

    lenis.stop();

    const onLenisScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onLenisScroll);

    const tickerCallback = (time: number) => {
      lenis?.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    const links = document.querySelectorAll(".header a[data-href]");
    const clickHandlers: Array<{
      element: HTMLAnchorElement;
      handler: (e: Event) => void;
    }> = [];
    links.forEach((elem) => {
      const element = elem as HTMLAnchorElement;
      const handler = (e: Event) => {
        if (window.innerWidth > 1024) {
          e.preventDefault();
          const anchor = e.currentTarget as HTMLAnchorElement;
          const section = anchor.getAttribute("data-href");
          if (section && lenis) {
            const target = document.querySelector(section) as HTMLElement;
            if (target) {
              lenis.scrollTo(target, {
                offset: 0,
                duration: 1.0,
                easing: (t) => 1 - Math.pow(1 - t, 3),
                force: true,
                onComplete: () => ScrollTrigger.update(),
              });
            }
          }
        }
      };
      element.addEventListener("click", handler);
      clickHandlers.push({ element, handler });
    });

    const onResize = () => {
      lenis?.resize();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis?.off("scroll", onLenisScroll);
      clickHandlers.forEach(({ element, handler }) =>
        element.removeEventListener("click", handler)
      );
      window.removeEventListener("resize", onResize);
      lenis?.destroy();
    };
  }, []);
  return (
    <>
      <div className="header">
        <a
          href="#home"
          data-href="#home"
          className="navbar-title"
          data-cursor="disable"
          aria-label={`${config.developer.fullName} — Back to top`}
          title="Back to top"
        >
          <img src="/logo.svg" alt="" className="navbar-logo" />
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#whatido" href="#whatido">
              <HoverLinks text="WHAT I DO" />
            </a>
          </li>
          <li>
            <a data-href="#experience" href="#experience">
              <HoverLinks text="EXPERIENCE" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#techstack" href="#techstack">
              <HoverLinks text="TECH STACK" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
