export const config = {
    developer: {
        name: "Emir Can",
        fullName: "Emir Can Özdağ",
        title: "Senior Full-Stack Developer",
        description: "Senior Full-Stack Developer building scalable .NET Core backends, event-driven systems and modern React front ends, with a passion for AI-powered products."
    },
    social: {
        github: "emircanozdag",
        email: "emircanozdag@gmail.com",
        location: "Ankara, Turkey"
    },
    about: {
        title: "About Me",
        lead: "Scalable backends, clean front ends, shipped end to end.",
        description: "I am a Senior Full-Stack Developer based in Ankara, Turkey, with 6+ years of experience building high-performance enterprise systems at Türk Telekom and TRT scale. On the backend I work with C#, .NET Core and ASP.NET Core, designing RESTful APIs and event-driven services with Kafka, RabbitMQ and Redis; on the frontend I build responsive interfaces with React and TypeScript. I own features end to end in Agile teams — from analysis and technical design to CI/CD with Azure DevOps, Docker and Kubernetes — and outside work I build AI-powered side projects like LLM chatbots and a chess engine.",
        highlights: [
            "6+ Years",
            "Ankara, Turkey",
            ".NET Core",
            "React & TypeScript",
            "Event-Driven",
            "CI/CD & Cloud"
        ]
    },
    experiences: [
        {
            position: "Senior .NET Developer",
            company: "Türk Telekom",
            period: "2023 - Present",
            location: "Ankara, Turkey",
            description: "Developing .NET Core backend services and RESTful APIs in a large-scale telecom environment, owning features end to end from analysis and design to deployment and post-release support.",
            responsibilities: [
                "Building .NET Core services and RESTful APIs with EF Core and Dapper",
                "Improving performance with Redis caching and decoupling services via RabbitMQ",
                "Writing unit tests to keep backend services reliable",
                "Shipping through Git and Azure DevOps CI/CD with Docker and Kubernetes in Agile/Scrum teams"
            ],
            technologies: ["C#", ".NET Core", "EF Core", "Dapper", "Redis", "RabbitMQ", "Azure DevOps", "Docker", "Kubernetes"]
        },
        {
            position: "Backend Developer",
            company: "TRT",
            period: "2021 - 2023",
            location: "Ankara, Turkey",
            description: "Built ASP.NET Core RESTful APIs powering front-end applications and enterprise business systems at broadcast scale.",
            responsibilities: [
                "Building RESTful APIs with ASP.NET Core for front-end applications",
                "Implementing authentication and authorization with OAuth 2.0 and JWT",
                "Working with MSSQL and Oracle databases on enterprise business applications"
            ],
            technologies: ["C#", "ASP.NET Core", "REST API", "OAuth 2.0", "JWT", "MSSQL", "Oracle"]
        },
        {
            position: "Software Developer",
            company: "Apsiyon",
            period: "2020 - 2021",
            location: "Istanbul, Turkey",
            description: "Designed, developed and maintained scalable, high-performance backend systems with C# and .NET Core, alongside web front ends.",
            responsibilities: [
                "Building and maintaining backend systems with C# and .NET Core",
                "Developing web front ends with JavaScript, TypeScript, HTML/CSS and DevExpress"
            ],
            technologies: ["C#", ".NET Core", "JavaScript", "TypeScript", "HTML/CSS", "DevExpress"]
        }
    ],
    projects: [
        {
            id: 1,
            title: "Telecom Usage & Notification Platform",
            category: "Microservices / .NET",
            technologies: "C#, .NET 8, ASP.NET Core, Kafka, RabbitMQ, Redis, PostgreSQL, EF Core, YARP, Docker, Testcontainers",
            image: "/images/telecom-platform.svg",
            link: "https://github.com/emircanozdag/telecom-platform",
            description: "Event-driven microservices that track mobile data usage, bill overage and alert subscribers near their quota. Transactional outbox to Kafka, idempotent consumers, optimistic concurrency, RabbitMQ work queues with retries and dead-letter queues, Redis caching, a YARP gateway, and Testcontainers integration tests in CI."
        },
        {
            id: 2,
            title: "Akıllı Hesap Bölüşme",
            category: "Full Stack / AI",
            technologies: "TypeScript, React Native, React, Cloudflare Workers, AI OCR, GitHub Actions",
            image: "/images/hesap-bolusme.svg",
            link: "https://github.com/emircanozdag/akilli-hesap-bolusme",
            description: "Cross-platform (iOS, Android, Web) bill-splitting app: scan a receipt with the camera, extract items and prices with AI-based OCR, and split costs within a group. TypeScript monorepo with separate mobile, web, server, split-engine and AI-orchestrator packages, plus CI."
        },
        {
            id: 3,
            title: "Futbol Düellosu",
            category: "Real-time / Full Stack",
            technologies: "TypeScript, Node.js, Socket.io, React, Vite, PWA, Python",
            image: "/images/futbol-duello.svg",
            link: "https://github.com/emircanozdag/futbol-duello",
            description: "Real-time 1v1 football trivia game: two clubs, one player, first correct answer wins. Server-authoritative room state over Socket.io, a bot opponent, a Python data pipeline that builds the dataset from Wikidata, and unit plus end-to-end smoke tests."
        },
        {
            id: 4,
            title: "emircanozdag.com",
            category: "Full Stack / Serverless",
            technologies: "React, TypeScript, Three.js, GSAP, Vercel Functions, Upstash Redis, LLM",
            image: "/images/portfolio.svg",
            link: "https://github.com/emircanozdag/personal-website",
            description: "This site: an interactive 3D portfolio with serverless APIs for an AI chat assistant, a JWT-protected admin panel, Redis-backed settings and per-IP rate limiting, and a playable chess page."
        }
    ],
    contact: {
        email: "emircanozdag@gmail.com",
        github: "https://github.com/emircanozdag",
        linkedin: "https://www.linkedin.com/in/emircanozdag/"
    },
    skills: {
        develop: {
            title: "BACKEND",
            description: "Scalable .NET services & event-driven systems",
            details: "Designing and building high-performance backend services and RESTful APIs with C#, .NET Core and ASP.NET Core. Event-driven architectures with Kafka and RabbitMQ, Redis caching, secure auth with OAuth 2.0/JWT, and delivery through CI/CD on Docker and Kubernetes.",
            tools: ["C#", ".NET Core", "ASP.NET Core", "EF Core", "Dapper", "Kafka", "RabbitMQ", "Redis", "MSSQL", "Oracle", "Docker", "Kubernetes", "Azure DevOps"]
        },
        design: {
            title: "FRONTEND & AI",
            description: "Modern web apps & AI-powered features",
            details: "Building responsive, performant interfaces with React, Next.js and TypeScript on top of clean REST APIs — and bringing AI into products with LLM chatbots and intelligent automation.",
            tools: ["React", "Next.js", "TypeScript", "JavaScript", "HTML/CSS", "TailwindCSS", "Node.js", "MongoDB", "LLMs", "Python"]
        }
    }
};


