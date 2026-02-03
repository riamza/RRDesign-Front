// Data that hasn't been migrated to DB yet

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
