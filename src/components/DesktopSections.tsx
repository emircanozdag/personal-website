import { useEffect } from "react";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Landing from "./Landing";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import TechStackNew from "./TechStackNew";
import CallToAction from "./CallToAction";
import setSplitText from "./utils/splitText";

const DesktopSections = () => {
  // Sections load lazily, so split text once they are actually in the DOM
  useEffect(() => {
    setSplitText();
  }, []);

  return (
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
  );
};

export default DesktopSections;
