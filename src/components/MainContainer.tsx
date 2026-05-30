import { PropsWithChildren, useEffect, useState } from "react";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import TechStackNew from "./TechStackNew";
import CallToAction from "./CallToAction";
import ScrollToTop from "./ScrollToTop";
import MobileProfile from "./mobile/MobileProfile";
import FloatingChat from "./chat/FloatingChat";
import setSplitText from "./utils/splitText";
import { config } from "../config";

const MainContainer = ({ children }: PropsWithChildren) => {
  const [isDesktopView, setIsDesktopView] = useState<boolean>(
    window.innerWidth > 1024
  );
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);

  useEffect(() => {
    const resizeHandler = () => {
      setSplitText();
      setIsDesktopView(window.innerWidth > 1024);
      setIsMobile(window.innerWidth <= 768);
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [isDesktopView]);

  return (
    <div className="container-main">
      <Cursor />
      <Navbar />
      <SocialIcons />
      {isDesktopView && !isMobile && children}
      {isMobile ? (
        <MobileProfile />
      ) : (
        <div className="container-main">
          <Landing />
          <About />
          <WhatIDo />
          <Career />
          <Work />
          <TechStackNew />
          <CallToAction />
          <Contact />
        </div>
      )}
      {isMobile && (
        <FloatingChat
          welcomeContent={`Hello there! I am ${config.developer.fullName} 👋 Ask me anything you want to know!`}
        />
      )}
      <ScrollToTop />
    </div>
  );
};

export default MainContainer;
