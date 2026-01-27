// Mock data pentru aplicația RRDesign

export const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "Platformă complexă de comerț electronic cu integrare payment gateway și management de stocuri.",
    image: "https://images.unsplash.com/photo-1661956602116-aa6865609028?w=800&h=600&fit=crop",
    technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
    link: "https://example-ecommerce.com",
    category: "Web Development",
    completionDate: "2025-12"
  },
  {
    id: 2,
    title: "CRM System",
    description: "Sistem de management relații clienți cu funcționalități avansate de raportare și automatizare.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    technologies: [".NET Core", "Angular", "SQL Server", "Redis"],
    link: "https://example-crm.com",
    category: "Enterprise Software",
    completionDate: "2025-11"
  },
  {
    id: 3,
    title: "Mobile Banking App",
    description: "Aplicație bancară mobilă cu funcționalități de plăți instant și management conturi multiple.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop",
    technologies: ["React Native", "Firebase", "Node.js", "MongoDB"],
    link: "https://example-banking.com",
    category: "Mobile Development",
    completionDate: "2025-10"
  },
  {
    id: 4,
    title: "Healthcare Management System",
    description: "Platformă de management pentru clinici private cu programări online și fișe medicale digitale.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop",
    technologies: ["React", ".NET Core", "PostgreSQL", "Docker"],
    link: "https://example-healthcare.com",
    category: "Healthcare",
    completionDate: "2025-09"
  },
  {
    id: 5,
    title: "Logistics Dashboard",
    description: "Dashboard pentru tracking în timp real al transporturilor și optimizare rute.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop",
    technologies: ["Vue.js", "Python", "PostgreSQL", "Redis"],
    link: "https://example-logistics.com",
    category: "Logistics",
    completionDate: "2025-08"
  },
  {
    id: 6,
    title: "Learning Management System",
    description: "Platformă educațională cu cursuri online, teste interactive și certificări digitale.",
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop",
    technologies: ["React", "Node.js", "MongoDB", "AWS"],
    link: "https://example-lms.com",
    category: "Education",
    completionDate: "2025-07"
  }
];

export const templates = [
  {
    id: 1,
    title: "Corporate Website Template",
    description: "Template modern pentru website-uri corporate cu secțiuni pentru servicii, echipă și contact.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
    technologies: ["React", "Tailwind CSS", "Framer Motion"],
    demoLink: "#",
    category: "Web Template",
    features: ["Responsive Design", "SEO Optimized", "Fast Loading", "Modern UI"]
  },
  {
    id: 2,
    title: "E-Commerce Starter",
    description: "Template complet pentru magazine online cu coș de cumpărături și integrare plăți.",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=600&fit=crop",
    technologies: ["Next.js", "Stripe", "Prisma", "PostgreSQL"],
    demoLink: "#",
    category: "E-Commerce",
    features: ["Shopping Cart", "Payment Integration", "Admin Panel", "Product Management"]
  },
  {
    id: 3,
    title: "Dashboard Admin Template",
    description: "Template dashboard cu grafice interactive și tabele de date pentru aplicații business.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    technologies: ["React", "Chart.js", "Material-UI"],
    demoLink: "#",
    category: "Dashboard",
    features: ["Data Visualization", "User Management", "Dark Mode", "Responsive Tables"]
  },
  {
    id: 4,
    title: "Portfolio Website",
    description: "Template elegant pentru portofolii personale sau de companie cu galerie de proiecte.",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop",
    technologies: ["React", "GSAP", "CSS Modules"],
    demoLink: "#",
    category: "Portfolio",
    features: ["Smooth Animations", "Project Gallery", "Contact Form", "Blog Section"]
  },
  {
    id: 5,
    title: "SaaS Landing Page",
    description: "Template landing page pentru produse SaaS cu secțiuni de pricing și testimoniale.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop",
    technologies: ["React", "Styled Components", "React Spring"],
    demoLink: "#",
    category: "Landing Page",
    features: ["Pricing Tables", "Testimonials", "FAQ Section", "Call-to-Action"]
  }
];

export const services = [
  {
    id: 1,
    title: "Web Development",
    description: "Dezvoltăm aplicații web moderne, scalabile și performante folosind cele mai noi tehnologii și best practices din industrie.",
    icon: "monitor",
    features: [
      "Single Page Applications (SPA)",
      "Progressive Web Apps (PWA)",
      "E-Commerce Solutions",
      "Content Management Systems"
    ],
    technologies: ["React", "Vue.js", "Angular", "Next.js"]
  },
  {
    id: 2,
    title: "Mobile Development",
    description: "Creăm aplicații mobile native și cross-platform pentru iOS și Android cu experiențe de utilizator excepționale.",
    icon: "smartphone",
    features: [
      "iOS & Android Apps",
      "Cross-Platform Development",
      "Mobile UI/UX Design",
      "App Store Optimization"
    ],
    technologies: ["React Native", "Flutter", "Swift", "Kotlin"]
  },
  {
    id: 3,
    title: "Backend Development",
    description: "Dezvoltăm API-uri robuste și arhitecturi backend scalabile pentru aplicații de orice dimensiune.",
    icon: "server",
    features: [
      "RESTful APIs",
      "Microservices Architecture",
      "Database Design",
      "Cloud Integration"
    ],
    technologies: [".NET Core", "Node.js", "Python", "Java"]
  },
  {
    id: 4,
    title: "UI/UX Design",
    description: "Creăm interfețe intuitive și experiențe de utilizator memorabile prin design modern și functional.",
    icon: "palette",
    features: [
      "User Interface Design",
      "User Experience Research",
      "Prototyping & Wireframing",
      "Design Systems"
    ],
    technologies: ["Figma", "Adobe XD", "Sketch", "InVision"]
  },
  {
    id: 5,
    title: "Cloud Solutions",
    description: "Implementăm soluții cloud pentru scalabilitate, securitate și performanță optimă a aplicațiilor tale.",
    icon: "cloud",
    features: [
      "Cloud Migration",
      "Infrastructure as Code",
      "DevOps & CI/CD",
      "Monitoring & Analytics"
    ],
    technologies: ["AWS", "Azure", "Google Cloud", "Docker"]
  },
  {
    id: 6,
    title: "Consulting & Support",
    description: "Oferim consultanță tehnică și suport continuu pentru a asigura succesul proiectelor tale.",
    icon: "users",
    features: [
      "Technical Consulting",
      "Code Review",
      "Performance Optimization",
      "24/7 Support"
    ],
    technologies: ["Agile", "Scrum", "Best Practices", "Code Quality"]
  }
];

export const pricingPackages = [
  {
    id: 1,
    title: "Site de Prezentare",
    price: "1500 RON",
    description: "Ideal pentru mici afaceri sau portofolii personale care au nevoie de o prezență online profesională.",
    features: [
      "Suport 24/7 pe durata colaborării",
      "Domeniu & Hosting inclus (1 an)",
      "Sfaturi de Design & UX",
      "Mentenanță gratuită primul an",
      "Optimizare SEO Basic",
      "Formular de contact",
      "Integrare Social Media"
    ],
    highlight: false
  },
  {
    id: 2,
    title: "Magazin Online",
    price: "3500 RON",
    description: "Soluție completă pentru a vinde produse online, cu panou de administrare și plăți securizate.",
    features: [
      "Tot ce include pachetul Prezentare",
      "Număr nelimitat de produse",
      "Panou de administrare",
      "Integrare procesator plăți",
      "Sistem de stocuri",
      "Sistem de vouchere & reduceri",
      "Analytics integrat"
    ],
    highlight: true
  },
  {
    id: 3,
    title: "Aplicație Custom",
    price: "Custom",
    description: "Soluții software complexe dezvoltate de la zero pentru nevoile specifice ale afacerii tale.",
    features: [
      "Arhitectură scalabilă",
      "Database Design avansat",
      "API Development",
      "Aplicație Mobile (opțional)",
      "Dashboard personalizat",
      "Consultant dedicat",
      "Maintenance SLA"
    ],
    highlight: false
  }
];

export const companyInfo = {
  name: "RRDesign",
  tagline: "Transformăm idei în soluții software inovatoare",
  description: "RRDesign este o companie de outsourcing software specializată în dezvoltarea de soluții complete pentru business-uri moderne. Cu o echipă de experți pasionați, livrăm proiecte de calitate superioară care depășesc așteptările clienților noștri.",
  email: "contact@rrdesign.ro",
  phone: "+40 123 456 789",
  address: "București, România",
  socialMedia: {
    linkedin: "https://linkedin.com/company/rrdesign",
    github: "https://github.com/rrdesign",
    twitter: "https://twitter.com/rrdesign"
  }
};

export const contactSubmissions = [
  {
    id: 1,
    name: "Ion Popescu",
    email: "ion.popescu@example.com",
    phone: "+40 721 123 456",
    company: "Tech Solutions SRL",
    message: "Bună ziua, sunt interesat de dezvoltarea unui magazin online pentru afacerea noastră. Avem aproximativ 500 de produse și am dori o integrare cu un sistem de plăți securizat. Când putem discuta mai multe detalii?",
    date: "2026-01-22T10:30:00",
    status: "new"
  },
  {
    id: 2,
    name: "Maria Ionescu",
    email: "maria.ionescu@company.ro",
    phone: "+40 732 456 789",
    company: "Marketing Plus",
    message: "Salut! Am văzut proiectele voastre și sunt foarte impresionată. Aș vrea să discutăm despre dezvoltarea unui site de prezentare pentru agenția noastră de marketing. Bugetul nostru este în jurul sumei de 2000 RON.",
    date: "2026-01-21T15:45:00",
    status: "read"
  },
  {
    id: 3,
    name: "Andrei Gheorghe",
    email: "andrei.g@startup.com",
    phone: "",
    company: "StartUp Innovations",
    message: "Avem nevoie de o aplicație mobilă pentru iOS și Android. Este un proiect complex care implică integrare cu API-uri externe și sistem de plăți. Putem avea o întâlnire săptămâna viitoare?",
    date: "2026-01-20T09:15:00",
    status: "read"
  },
  {
    id: 4,
    name: "Elena Dumitrescu",
    email: "elena.dumitrescu@medical.ro",
    phone: "+40 744 567 890",
    company: "Clinica MedLife",
    message: "Bună ziua, căutăm o soluție software pentru management de pacienți și programări online. Am dori să integrăm și un sistem de consultații video. Aveți experiență în domeniul medical?",
    date: "2026-01-19T14:20:00",
    status: "archived"
  },
  {
    id: 5,
    name: "Cristian Marin",
    email: "cristian.m@personal.ro",
    phone: "+40 755 678 901",
    company: "",
    message: "Doresc să îmi fac un site portfolio pentru a-mi prezenta lucrările de fotografie. Aș vrea ceva modern și elegant, cu galerie foto și blog. Care ar fi timpul de dezvoltare și costul aproximativ?",
    date: "2026-01-18T11:00:00",
    status: "archived"
  },
  {
    id: 6,
    name: "Laura Stanciu",
    email: "laura.stanciu@education.ro",
    phone: "+40 766 789 012",
    company: "Academia de Formare",
    message: "Suntem interesați de o platformă LMS (Learning Management System) pentru cursurile noastre online. Ar trebui să suporte video streaming, teste interactive și certificări. Puteți oferi o soluție completă?",
    date: "2026-01-22T08:30:00",
    status: "new"
  },
  {
    id: 7,
    name: "Alexandru Popa",
    email: "alex.popa@restaurant.ro",
    phone: "+40 777 890 123",
    company: "Restaurant Gustos",
    message: "Am nevoie de un sistem de comenzi online pentru restaurantul nostru, cu livrare la domiciliu. Ceva similar cu aplicațiile de food delivery. Cât ar costa?",
    date: "2026-01-17T16:40:00",
    status: "read"
  }
];
