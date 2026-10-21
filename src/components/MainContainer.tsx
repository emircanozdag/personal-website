import { PropsWithChildren, Suspense, useEffect, useState } from "react";
import Cursor from "./Cursor";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import ScrollToTop from "./ScrollToTop";
import setSplitText from "./utils/splitText";
import { lazyWithReload } from "../utils/chunkReload";

// Desktop sections and the mobile profile are split so each device only downloads its own tree
const DesktopSections = lazyWithReload(() => import("./DesktopSections"));
const MobileProfile = lazyWithReload(() => import("./mobile/MobileProfile"));
const FloatingChat = lazyWithReload(() => import("./chat/FloatingChat"));

const MainContainer = ({ children }: PropsWithChildren) => {
  const [isDesktopView, setIsDesktopView] = useState<boolean>(
    window.innerWidth > 1024
  );
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);

  useEffect(() => {
    let rafId = 0;
    const update = () => {
      setSplitText();
      // React bails out when the boolean is unchanged, so this only re-renders on breakpoint changes
      setIsDesktopView(window.innerWidth > 1024);
      setIsMobile(window.innerWidth <= 768);
    };
    const resizeHandler = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("resize", resizeHandler);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <div className="container-main">
      <Cursor />
      <Navbar />
      <SocialIcons />
      {isDesktopView && !isMobile && children}
      <Suspense>
        {isMobile ? <MobileProfile /> : <DesktopSections />}
        {isMobile && <FloatingChat />}
      </Suspense>
      <ScrollToTop />
    </div>
  );
};

export default MainContainer;
