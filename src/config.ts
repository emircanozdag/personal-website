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
            title: "Drishti",
            category: "AI / LLM",
            technologies: "Python, PyTorch, Transformers, FastAPI, React, MongoDB",
            image: "/images/drishti.png",
            description: "Bangladesh's first intelligent advanced AI chatbot powered by a custom Large Language Model. Features natural language understanding, contextual conversations, and multilingual support including Bengali."
        },
        {
            id: 2,
            title: "VoteChain",
            category: "Blockchain",
            technologies: "Solidity, Web3.js, React, Ethereum, IPFS, MetaMask, Node.js",
            image: "/images/votechain.png",
            description: "A decentralized election system built on blockchain technology ensuring transparent, tamper-proof, and verifiable voting. Features smart contracts for vote integrity and real-time result tracking."
        },
        {
            id: 3,
            title: "EIE - Earthquake Impact Estimator",
            category: "IoT / Hardware",
            technologies: "Arduino, C++, IoT Sensors, Python, ML, React",
            image: "/images/eie.svg",
            description: "A practical circuit-based IoT system utilizing Arduino to predict earthquakes before they strike. Integrates hardware sensors for real-time seismic detection and impact estimation."
        },
        {
            id: 4,
            title: "GameKroy",
            category: "Full Stack",
            technologies: "React, Node.js, MongoDB, Express, Stripe, TailwindCSS",
            image: "/images/gamekroy.png",
            description: "A full-featured e-commerce platform for gaming products. Includes user authentication, product catalog, shopping cart, secure payments, order tracking, and admin dashboard."
        },
        {
            id: 5,
            title: "RedxChess",
            category: "AI / Game Engine",
            technologies: "Python, C++, Neural Networks, Bitboards, UCI Protocol",
            image: "/images/redxchess.png",
            description: "A high-performance chess engine rated 3640 ELO. Features advanced search algorithms, neural network evaluation, and optimized bitboard representation for lightning-fast move generation."
        },
        {
            id: 6,
            title: "Floodhub",
            category: "AI / ML",
            technologies: "Python, TensorFlow, Pandas, React, FastAPI, GIS",
            image: "/images/floodhub.png",
            description: "A flood prediction model specifically designed for Bangladesh's river systems. Analyzes weather patterns, water levels, and historical data to provide accurate flood forecasts and alerts."
        },
        {
            id: 7,
            title: "Phoenix",
            category: "AI Assistant",
            technologies: "Python, Speech Recognition, PyAutoGUI, OpenAI API, Tkinter",
            image: "/images/phoenix.png",
            description: "A JARVIS-inspired personal AI desktop assistant. Controls system functions, manages tasks, answers queries, automates workflows, and provides voice-activated computing experience."
        },
        {
            id: 8,
            title: "HekTools",
            category: "Security / Android",
            technologies: "Kotlin, Android SDK, Firebase, Python, Encryption",
            image: "/images/hektools.png",
            description: "An advanced Android monitoring and security research tool. Features remote device management, activity logging, and encrypted data transmission for security testing purposes."
        }
    ],
    contact: {
        email: "emircanozdag@gmail.com",
        github: "https://github.com/emircanozdag",
        linkedin: "https://www.linkedin.com/in/emircanozdag/",
        twitter: "https://x.com/i/flow/login",
        facebook: "https://www.facebook.com/redoyanulhaque.hacker.official",
        instagram: "https://www.instagram.com/accounts/login/"
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


