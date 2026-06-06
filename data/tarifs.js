// Données de la grille tarifaire (page /nostarifs).
// Valeurs des tableaux : true = inclus (check), false = non inclus (croix),
// "warning" = basique/optionnel, toute chaîne = supplément / mention (ex: "+30€").

export const vitrineCards = [
  {
    title: "Landing Page Simple",
    description: "1 page, design moderne, responsive, formulaire de contact",
    price: "150€ - 300€",
  },
  {
    title: "Site Vitrine (3-5 pages)",
    description: "Accueil, À propos, Services, Contact, Blog optionnel",
    price: "300€ - 600€",
  },
  {
    title: "Site Vitrine (6-10 pages)",
    description: "Site complet avec plusieurs sections et fonctionnalités",
    price: "600€ - 1000€",
  },
];

export const vitrineComparison = {
  columns: ["Landing Page", "Site 3-5 pages", "Site 6-10 pages"],
  rows: [
    { label: "Maquette/Design personnalisé", values: [true, true, true] },
    {
      label: "Développement responsive (mobile, tablette, desktop)",
      values: [true, true, true],
    },
    { label: "SEO de base (meta tags, structure)", values: [true, true, true] },
    { label: "Formulaire de contact fonctionnel", values: [true, true, true] },
    {
      label: "Formation client (utilisation du site)",
      values: ["warning", true, true],
    },
    {
      label: "Intégration Google Analytics",
      values: ["+30€", true, true],
    },
    {
      label: "Mise en ligne et configuration hébergement",
      values: ["+50€", "+50€", "+50€"],
    },
  ],
};

export const ecommerceCards = [
  {
    title: "E-commerce Basique",
    description: "Jusqu'à 20 produits, paiement en ligne, gestion stock basique",
    price: "800€ - 1200€",
  },
  {
    title: "E-commerce Standard",
    description: "Jusqu'à 50 produits, catégories, filtres, comptes clients",
    price: "1200€ - 1800€",
  },
  {
    title: "E-commerce Avancé",
    description: "Produits illimités, fonctionnalités avancées, multi-devises",
    price: "1800€ - 3000€+",
  },
];

export const ecommerceComparison = {
  columns: ["Basique", "Standard", "Avancé"],
  rows: [
    { label: "Design personnalisé & responsive", values: [true, true, true] },
    {
      label: "Intégration paiement (Stripe/PayPal)",
      values: [true, true, true],
    },
    { label: "Gestion produits et stock", values: [true, true, true] },
    { label: "Panier et processus de commande", values: [true, true, true] },
    { label: "Système de comptes clients", values: [false, true, true] },
    { label: "Codes promo et réductions", values: [false, "+130€", true] },
    {
      label: "Gestion avancée (avis, wishlist, etc.)",
      values: [false, false, true],
    },
    {
      label: "Formation complète gestion boutique",
      values: [true, true, true],
    },
    { label: "SEO e-commerce optimisé", values: ["warning", true, true] },
  ],
};

export const applicationCards = [
  {
    title: "Application Simple",
    description: "CRUD basique, dashboard simple, authentification",
    price: "1000€ - 1500€",
  },
  {
    title: "Application Standard",
    description: "Fonctionnalités multiples, API, base de données complexe",
    price: "1500€ - 2500€",
  },
  {
    title: "Application Avancée",
    description: "Projet complexe, temps réel, intégrations tierces",
    price: "2500€ - 5000€+",
  },
];

export const refonteCards = [
  {
    title: "Refonte Design",
    description: "Nouveau design, conservation de la structure existante",
    price: "50-70% du prix d'un site neuf",
  },
  {
    title: "Refonte Complète",
    description:
      "Nouveau design + nouvelle structure + nouvelles fonctionnalités",
    price: "70-90% du prix d'un site neuf",
  },
  {
    title: "Migration de Plateforme",
    description: "Changement de technologie (ex: WordPress vers React)",
    price: "À partir de 500€",
  },
  {
    title: "Optimisation Performance",
    description: "Amélioration vitesse, SEO technique, accessibilité",
    price: "200€ - 500€",
  },
];

export const maintenanceCards = [
  {
    title: "Maintenance Basique",
    price: "50€",
    period: "/mois",
    features: [
      "Sauvegardes hebdomadaires",
      "Mises à jour sécurité",
      "Support email (48h)",
      "1h de modifications/mois",
    ],
  },
  {
    title: "Maintenance Standard",
    price: "100€",
    period: "/mois",
    features: [
      "Sauvegardes quotidiennes",
      "Mises à jour + monitoring",
      "Support prioritaire (24h)",
      "3h de modifications/mois",
      "Rapport mensuel",
    ],
  },
  {
    title: "Maintenance Premium",
    price: "150€",
    period: "/mois",
    features: [
      "Tout de la formule Standard",
      "Support urgent (12h)",
      "5h de modifications/mois",
      "Optimisations continues",
      "Hébergement inclus",
    ],
  },
];

export const servicesAdditionnels = [
  {
    service: "Hébergement & nom de domaine",
    description: "Configuration et gestion première année",
    price: "50€ (one-time)",
  },
  {
    service: "Configuration emails professionnels",
    description: "Setup adresses email @votredomaine.com",
    price: "30€",
  },
  {
    service: "Intégration réseaux sociaux",
    description: "Liens, widgets, flux social",
    price: "50€",
  },
  {
    service: "Blog/Système de contenu",
    description: "CMS intégré pour gérer articles",
    price: "150€ - 300€",
  },
  {
    service: "Multilingue",
    description: "Par langue supplémentaire",
    price: "200€/langue",
  },
  {
    service: "Formation approfondie",
    description: "Session supplémentaire (2h)",
    price: "80€",
  },
  {
    service: "Urgence (délai < 7 jours)",
    description: "Supplément rush",
    price: "+30% du projet",
  },
];

export const conditions = [
  "Devis gratuit et sans engagement",
  "Acompte de 30% à la commande",
  "Paiements échelonnés possibles",
  "2 révisions incluses par projet",
  "Révisions supplémentaires : 25€/heure",
  "Délais : variables selon la complexité (généralement 2-6 semaines)",
  "Les prix s'entendent hors hébergement et nom de domaine (sauf mention contraire)",
];
