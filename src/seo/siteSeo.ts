import { config } from "../config";

export const SITE_URL = "https://emircanozdag.com";
export const SITE_NAME = config.developer.fullName;
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/profile.jpg`;

export type SeoPageKey = "home" | "myworks" | "play";

export interface PageSeo {
  title: string;
  description: string;
  path: string;
  keywords: string;
}

export const seoPages: Record<SeoPageKey, PageSeo> = {
  home: {
    title: "Emir Can Özdağ - Full-Stack Developer | .NET, React & AI",
    description:
      "Emir Can Özdağ is a Senior Full-Stack Developer with 6+ years of experience building scalable .NET Core backends, event-driven systems with Kafka and RabbitMQ, and modern React/TypeScript front ends — at Türk Telekom and TRT scale.",
    path: "/",
    keywords:
      "Emir Can Özdağ, full-stack developer, senior .NET developer, C# developer, ASP.NET Core, React developer, TypeScript, Kafka, RabbitMQ, microservices, backend developer, Ankara Turkey",
  },
  myworks: {
    title: "Projects & Works | Emir Can Özdağ",
    description:
      "Explore .NET microservices, full-stack and real-time projects by Emir Can Özdağ — an event-driven telecom platform with Kafka and RabbitMQ, an AI receipt-splitting app, a real-time multiplayer game and an interactive 3D portfolio with serverless APIs.",
    path: "/myworks",
    keywords:
      "Emir Can Özdağ projects, .NET microservices, Kafka, RabbitMQ, full-stack portfolio, React, TypeScript, Socket.io, Cloudflare Workers",
  },
  play: {
    title: "Play Chess vs 3640 ELO Engine | Emir Can Özdağ",
    description:
      "Play chess online against RedxChess — a 3640 ELO rated AI chess engine built by Emir Can Özdağ with neural networks and advanced search algorithms.",
    path: "/play",
    keywords:
      "RedxChess, chess engine, 3640 ELO, play chess online, AI chess, Emir Can Özdağ",
  },
};

export const getCanonicalUrl = (path: string): string => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${normalized.replace(/\/$/, "")}`;
};

export const getPersonSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: config.developer.fullName,
  givenName: config.developer.name,
  url: SITE_URL,
  image: DEFAULT_OG_IMAGE,
  jobTitle: config.developer.title,
  description: config.developer.description,
  email: config.social.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ankara",
    addressCountry: "TR",
  },
  knowsAbout: [
    "C#",
    ".NET Core",
    "ASP.NET Core",
    "Apache Kafka",
    "RabbitMQ",
    "Redis",
    "React",
    "TypeScript",
    "Microservices",
    "Large Language Models",
  ],
  sameAs: [config.contact.github, config.contact.linkedin],
});

export const getWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: seoPages.home.description,
  author: {
    "@type": "Person",
    name: config.developer.fullName,
    url: SITE_URL,
  },
  inLanguage: "en",
});

export const getProfilePageSchema = () => ({
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  name: `${config.developer.fullName} - Portfolio`,
  url: SITE_URL,
  mainEntity: getPersonSchema(),
});

export const getCreativeWorkListSchema = () => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Projects by Emir Can Özdağ",
  url: getCanonicalUrl("/myworks"),
  numberOfItems: config.projects.length,
  itemListElement: config.projects.map((project, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "CreativeWork",
      name: project.title,
      description: project.description,
      keywords: project.technologies,
      genre: project.category,
      author: {
        "@type": "Person",
        name: config.developer.fullName,
        url: SITE_URL,
      },
    },
  })),
});
