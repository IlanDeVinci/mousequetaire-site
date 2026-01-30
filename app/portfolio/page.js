"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ScrollReveal from "../../components/ScrollReveal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Enhanced portfolio items with importance representing layout size:
// 4: 2x2 grid (takes 4 spaces)
// 3: 2x1 grid (takes 2 spaces horizontally)
// 2: 1x2 grid (takes 2 spaces vertically) - NO LONGER USED
// 1: 1x1 grid (takes 1 space)
const portfolioItems = [
  {
    id: 1,
    title: "Murder Party App",
    description:
      "Application web interactive conçue pour organiser et animer des murder parties entre amis. Le joueur hote cree un scenario complet avec des personnages, des indices caches et des rebondissements. Chaque participant recoit son role, ses objectifs secrets et ses informations via une interface dediee. Le jeu se deroule en temps reel avec un systeme de phases (enquete, accusation, revelation) qui guide les joueurs tout au long de la partie. L'application gere automatiquement la distribution des indices au bon moment et permet aux joueurs d'echanger des informations entre eux.",
    image: "/images/projets/app-murder party/icon.jpg",
    images: [
      "/images/projets/app-murder party/menueprincipal.png",
      "/images/projets/app-murder party/chat.png",
      "/images/projets/app-murder party/classement.png",
      "/images/projets/app-murder party/connexion.png",
    ],
    importance: 3,
    technologies: ["Next.js", "TailwindCSS"],
    client: "Projet personnel",
    year: "2024",
    link: "https://app-halloween-nf61.vercel.app",
    linkLabel: "Visiter le site",
  },
  {
    id: 2,
    title: "Rackoon Streaming",
    description:
      "Plateforme de streaming video pensee comme une alternative moderne aux services existants. L'application propose un catalogue de contenus organise par categories, genres et popularite, avec un moteur de recherche avance et des filtres personnalisables. Le lecteur video integre offre une lecture fluide avec controle de qualite adaptatif. L'interface s'inspire des meilleures pratiques UX des plateformes de streaming actuelles, avec un systeme de recommandations, des listes de favoris et un historique de visionnage pour chaque utilisateur.",
    image: "/images/projets/application-rackoon-streaming/icon.png",
    images: ["/images/projets/application-rackoon-streaming/icon.png"],
    importance: 3,
    technologies: ["React.js", "TailwindCSS"],
    client: "Projet personnel",
    year: "2024",
    link: null,
    linkLabel: "Voir sur GitHub",
  },
  {
    id: 3,
    title: "Reservation de bureaux CCI",
    description:
      "Application professionnelle de reservation de bureaux developpee pour la Chambre de Commerce et d'Industrie France en Republique Tcheque. Integree directement dans Microsoft Teams sous forme d'onglet, elle permet aux employes de visualiser en temps reel la disponibilite des espaces de travail (bureaux individuels, salles de reunion, espaces partages), de reserver un creneau en quelques clics et de gerer leurs reservations existantes. Un panneau d'administration permet aux gestionnaires de configurer les espaces, de definir les regles de reservation et de consulter les statistiques d'occupation.",
    image: "/images/projets/Application-teams/icon.png",
    images: [
      "/images/projets/Application-teams/accueillereservbureau.png",
      "/images/projets/Application-teams/menuereservation.png",
      "/images/projets/Application-teams/reservationsalle.png",
    ],
    importance: 4,
    technologies: ["React.js", "CSS", "HTML", "Microsoft Teams"],
    client: "CCI France en Republique Tcheque",
    year: "2024",
    link: null,
    linkLabel: "Voir sur GitHub",
  },
  {
    id: 4,
    title: "Apprentissage de Langues IA",
    description:
      "Application innovante d'apprentissage de langues etrangeres propulsee par l'intelligence artificielle Gemini de Google. L'outil analyse le niveau de l'utilisateur puis genere des exercices sur mesure : traduction, comprehension orale, grammaire, vocabulaire et expression ecrite. L'IA corrige chaque reponse en temps reel avec des explications detaillees et des suggestions d'amelioration. Le systeme adapte progressivement la difficulte en fonction des performances, en insistant sur les points faibles identifies. L'utilisateur peut choisir parmi plusieurs langues et suivre sa progression via un tableau de bord personnalise.",
    image: "/images/projets/apprentisage-langueia/icon.png",
    images: [
      "/images/projets/apprentisage-langueia/langue.png",
      "/images/projets/apprentisage-langueia/quizecrit.png",
      "/images/projets/apprentisage-langueia/quizzselection.png",
    ],
    importance: 3,
    technologies: ["Next.js", "API Gemini", "TailwindCSS"],
    client: "Projet personnel",
    year: "2024",
    link: "https://lingua-gem.vercel.app/",
    linkLabel: "Visiter le site",
  },
  {
    id: 5,
    title: "Conge Chartrettes",
    description:
      "Projet complet mele hardware et software pour la mairie de Chartrettes. L'application web Next.js permet aux agents municipaux de poser leurs conges, de consulter leur solde et de visualiser le planning de l'equipe. Les responsables valident ou refusent les demandes depuis un back-office dedie. En parallele, un dispositif physique base sur un microcontroleur ESP32 programme en C++ permet le badgeage quotidien des agents. Le boitier de badgeage a ete entierement concu en 3D sur Fusion 360 puis imprime. Les donnees du badge sont synchronisees avec l'application web pour un suivi en temps reel des presences.",
    image: "/images/projets/conge-chartrettes/icon.png",
    images: [
      "/images/projets/conge-chartrettes/accueil-reservationmairie.png",
      "/images/projets/conge-chartrettes/image-mon-compte.png",
      "/images/projets/conge-chartrettes/imagemesreservation.png",
    ],
    importance: 4,
    technologies: ["Next.js", "TailwindCSS", "C++", "ESP32", "Fusion 360"],
    client: "Mairie de Chartrettes",
    year: "2024",
    link: null,
    linkLabel: "Voir sur GitHub",
  },
  {
    id: 6,
    title: "PokemonBattleDetector",
    description:
      "Extension Twitch originale qui utilise la vision par ordinateur en Python pour analyser le flux video d'un stream en direct et detecter automatiquement quand un combat Pokemon demarre a l'ecran. Lorsqu'un combat est identifie, l'extension capture les informations visibles (Pokemon en jeu, barres de vie) et les affiche aux spectateurs via un overlay web integre au stream. Le projet combine un backend Python pour l'analyse d'images avec un frontend HTML/CSS/JS pour l'interface de l'extension Twitch, le tout communiquant en temps reel.",
    image: "/images/projets/IA-pokemon/icon.png",
    images: [
      "/images/projets/IA-pokemon/icon.png",
    ],
    importance: 1,
    technologies: ["Python", "HTML", "CSS", "JS", "Extension Twitch"],
    client: "Projet personnel",
    year: "2023",
    link: null,
    linkLabel: "Voir sur GitHub",
  },
  {
    id: 7,
    title: "IA Detection d'objets",
    description:
      "Programme d'intelligence artificielle capable de detecter et d'identifier des objets en temps reel dans un flux video. Le systeme utilise le modele de deep learning YOLOv3 (You Only Look Once) combine avec la librairie OpenCV pour traiter les images provenant d'une webcam ou d'un fichier video. Il peut reconnaitre plus de 80 categories d'objets differents (personnes, vehicules, animaux, objets du quotidien) et les encadrer a l'ecran avec leur label et leur score de confiance. Le programme est optimise pour fonctionner en temps reel sur du materiel grand public.",
    image: "/images/projets/IA-recconaissance-objet/icon.png",
    images: [
      "/images/projets/IA-recconaissance-objet/reconaissance-telephone.png",
      "/images/projets/IA-recconaissance-objet/reconaissance-fourchettte.png",
      "/images/projets/IA-recconaissance-objet/reconnaisance-gateau.png",
    ],
    importance: 1,
    technologies: ["Python", "YOLOv3", "OpenCV"],
    client: "Projet personnel",
    year: "2023",
    link: null,
    linkLabel: "Voir sur GitHub",
  },
  {
    id: 8,
    title: "IA Langue des signes",
    description:
      "Application d'accessibilite utilisant l'intelligence artificielle pour reconnaitre la langue des signes en temps reel. Le systeme capture le flux video de la webcam, detecte les mains et les gestes de l'utilisateur grace a un modele YOLO entraine specifiquement sur un dataset de la langue des signes, puis traduit chaque signe en lettre ou mot affiche a l'ecran. L'objectif est de faciliter la communication entre les personnes sourdes ou malentendantes et celles qui ne connaissent pas la langue des signes. OpenCV assure le traitement video et l'affichage des resultats en surimposition.",
    image: "/images/projets/IA-reconnaissancelanguedessignes/icon.png",
    images: [
      "/images/projets/IA-reconnaissancelanguedessignes/montrelettre.png",
      "/images/projets/IA-reconnaissancelanguedessignes/ecritlettre.png",
    ],
    importance: 1,
    technologies: ["Python", "YOLO", "OpenCV"],
    client: "Projet personnel",
    year: "2023",
    link: null,
    linkLabel: "Voir sur GitHub",
  },
  {
    id: 9,
    title: "MousequetaireShop",
    description:
      "Boutique en ligne e-commerce complete construite sur l'ecosysteme PrestaShop avec des modules personnalises developpes en Laravel/PHP. Le site propose un catalogue de produits riche avec fiches detaillees, un systeme de filtres et de recherche, un panier d'achat intuitif et un tunnel de paiement securise. Le back-office permet de gerer les produits, les stocks, les commandes et les clients. Des fonctionnalites avancees comme les codes promo, les avis clients et le suivi de livraison ont ete integrees pour offrir une experience e-commerce professionnelle et complete.",
    image: "/images/projets/MousequetaireShop/icon.png",
    images: [
      "/images/projets/MousequetaireShop/magasin.png",
      "/images/projets/MousequetaireShop/adminboard.png",
    ],
    importance: 3,
    technologies: ["Laravel", "PrestaShop", "PHP"],
    client: "Projet personnel",
    year: "2023",
    link: null,
    linkLabel: "Voir sur GitHub",
  },
  {
    id: 10,
    title: "Pizzeria Chartrettes",
    description:
      "Site vitrine professionnel realise pour la pizzeria de Chartrettes, conçu pour attirer de nouveaux clients via le referencement local. Le site presente l'ensemble du menu avec les prix, les ingredients et les photos des plats, ainsi que les horaires d'ouverture, l'adresse avec integration Google Maps et un numero de telephone en click-to-call. Un formulaire de commande en ligne permet aux clients de passer commande pour la livraison ou le retrait sur place. L'optimisation SEO cible les recherches locales (pizzeria Chartrettes, pizza livraison 77) pour maximiser la visibilite sur Google.",
    image: "/images/projets/pizzeria/icon.png",
    images: [
      "/images/projets/pizzeria/accueil pizzeria.png",
      "/images/projets/pizzeria/infopizza.png",
      "/images/projets/pizzeria/menue-pizza.png",
    ],
    importance: 4,
    technologies: ["HTML", "CSS", "JavaScript", "SEO"],
    client: "Pizzeria de Chartrettes",
    year: "2023",
    link: "https://ladolcevita-pizza.fr/",
    linkLabel: "Visiter le site",
  },
  {
    id: 11,
    title: "Reservation Salles Chartrettes",
    description:
      "Application web de reservation de salles municipales developpee pour la mairie de Chartrettes. Les habitants peuvent consulter les salles disponibles (salle des fetes, salle de reunion, gymnase), visualiser les creneaux libres sur un calendrier interactif et soumettre une demande de reservation en ligne. Cote administration, le personnel municipal dispose d'un tableau de bord pour valider ou refuser les demandes, gerer les tarifs et consulter l'historique des reservations. Le systeme envoie des notifications automatiques a chaque etape du processus.",
    image: "/images/projets/reservation-chartrettes/icon.png",
    images: [
      "/images/projets/reservation-chartrettes/ecran-acueille.png",
      "/images/projets/reservation-chartrettes/ecrancalendrier.png",
      "/images/projets/reservation-chartrettes/selectionbatiment.png",
      "/images/projets/reservation-chartrettes/selectionsalle.png",
    ],
    importance: 3,
    technologies: ["Next.js", "TailwindCSS"],
    client: "Mairie de Chartrettes",
    year: "2024",
    link: null,
    linkLabel: "Voir sur GitHub",
  },
  {
    id: 12,
    title: "Yodea - Maison d'edition",
    description:
      "Site vitrine elegant conçu pour la maison d'edition Yodea. Le site met en valeur le catalogue complet des ouvrages publies avec pour chaque livre une fiche detaillee (resume, extrait, informations sur l'auteur, prix). Une section dediee presente les auteurs de la maison avec leur biographie et leur bibliographie. La page d'actualites relaie les evenements litteraires, seances de dedicaces et nouvelles parutions. Le design a ete pense pour refleter l'identite editoriale de Yodea : soigne, sobre et centre sur le contenu textuel.",
    image: "/images/projets/sitevitrine-yodea/icon.png",
    images: [
      "/images/projets/sitevitrine-yodea/ecran-accueil.png",
      "/images/projets/sitevitrine-yodea/livre1.png",
      "/images/projets/sitevitrine-yodea/livre2.png",
      "/images/projets/sitevitrine-yodea/livre3.png",
    ],
    importance: 1,
    technologies: ["HTML", "CSS", "JavaScript"],
    client: "Yodea",
    year: "2023",
    link: "https://yodea.com/",
    linkLabel: "Visiter le site",
  },
  {
    id: 13,
    title: "Wizzelek - Experience Vektroid",
    description:
      "Experience web artistique et immersive qui plonge l'utilisateur dans un univers 3D interactif inspire de l'esthetique vaporwave de Vektroid. Grace a Three.js, le site propose une navigation libre dans un espace tridimensionnel peuple de formes geometriques, de textures retro et d'effets visuels reactifs aux actions de l'utilisateur. L'ambiance sonore interactive accompagne l'exploration. Le projet explore les possibilites creatives du web 3D en fusionnant art numerique, musique electronique et interaction utilisateur dans une experience sensorielle unique.",
    image: "/images/projets/vektroid/vektroid-accueil.png",
    images: [
      "/images/projets/vektroid/vektroid-accueil.png",
      "/images/projets/vektroid/lecteurvektroid.png",
      "/images/projets/vektroid/creationdesign.png",
    ],
    importance: 4,
    technologies: ["HTML", "CSS", "Three.js"],
    client: "Projet artistique",
    year: "2023",
    link: "https://projet-vektroide.vercel.app/",
    linkLabel: "Visiter le site",
  },
  {
    id: 14,
    title: "Site Marchand Amazon Disjoncteurs",
    description:
      "Site e-commerce specialise pour un vendeur professionnel Amazon de disjoncteurs et materiel electrique. Le site propose des fiches produits techniques detaillees avec specifications, normes de conformite, schemas de branchement et guides de choix pour aider les clients (electriciens, particuliers) a trouver le bon disjoncteur. Des tableaux comparatifs permettent de comparer les caracteristiques entre modeles. Le design est pense pour la conversion avec des elements de rassurance (garantie, livraison rapide, service client) et un parcours d'achat simplifie redirigeant vers la page Amazon du produit.",
    image: "/images/projets/wizzelek/icon.png",
    images: ["/images/projets/wizzelek/icon.png"],
    importance: 1,
    technologies: ["HTML", "CSS", "JavaScript"],
    client: "Marchand Amazon",
    year: "2023",
    link: null,
    linkLabel: "Visiter le site",
  },
  {
    id: 15,
    title: "Site Mousequetaire",
    description:
      "Site portfolio officiel de l'agence Mousequetaire, conçu pour etre lui-meme une demonstration du savoir-faire de l'equipe. Le site utilise des animations GSAP sophistiquees pour les transitions de pages, les effets de parallaxe au scroll et les micro-interactions. Il presente les services de l'agence (developpement web, design, IA), le portfolio complet des realisations avec modales interactives, les profils de l'equipe et un formulaire de contact. Le design sombre et moderne avec des accents bleus cree une identite visuelle forte et memorable.",
    image: "/images/projets/vektroid/vektroid-accueil.png",
    images: ["/images/projets/vektroid/vektroid-accueil.png"],
    importance: 3,
    technologies: ["Next.js", "TailwindCSS", "GSAP"],
    client: "Mousequetaire",
    year: "2024",
    link: null,
    linkLabel: "Visiter le site",
  },
];

export default function Portfolio() {
  const [gridItems, setGridItems] = useState([]);
  const [error, setError] = useState(null);
  const [showDebug, setShowDebug] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    totalCells: 0,
    totalWidth: 0,
    cellsUsed: 0,
    placeholders: 0,
    adjustments: [],
    debugLog: [],
  });
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const createDebugLogger = () => {
    const debugLog = [];
    return {
      log: (message) => {
        debugLog.push(`[${debugLog.length}] ${message}`);
        console.log(message);
      },
      getLog: () => debugLog,
    };
  };

  const openProjectModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    setCurrentImageIndex(0);
    document.body.style.overflow = "hidden";
  };

  const closeProjectModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const navigateToNextProject = () => {
    const currentIndex = gridItems.findIndex(
      (item) => item.id === selectedProject.id
    );
    const nextIndex = (currentIndex + 1) % gridItems.length;
    setSelectedProject(gridItems[nextIndex]);
    setCurrentImageIndex(0);
  };

  const navigateToPrevProject = () => {
    const currentIndex = gridItems.findIndex(
      (item) => item.id === selectedProject.id
    );
    const prevIndex = (currentIndex - 1 + gridItems.length) % gridItems.length;
    setSelectedProject(gridItems[prevIndex]);
    setCurrentImageIndex(0);
  };

  const showNextImage = () => {
    if (
      selectedProject &&
      selectedProject.images &&
      selectedProject.images.length > 0
    ) {
      setCurrentImageIndex(
        (currentImageIndex + 1) % selectedProject.images.length
      );
    }
  };

  const showPrevImage = () => {
    if (
      selectedProject &&
      selectedProject.images &&
      selectedProject.images.length > 0
    ) {
      setCurrentImageIndex(
        (currentImageIndex - 1 + selectedProject.images.length) %
          selectedProject.images.length
      );
    }
  };

  useEffect(() => {
    const { log, getLog } = createDebugLogger();
    const gridWidth = 3;
    const adjustments = [];

    try {
      let allItems = portfolioItems.map((item, index) => {
        return {
          ...item,
          originalImportance: item.importance,
          gridStyle: {
            gridRow: `span 1`,
            gridColumn: `span 1`,
          },
          debugDimensions: { width: 1, height: 1, label: "1×1" },
          uniqueKey: `item-${item.id}`,
          index: index,
        };
      });

      log(`Prepared ${allItems.length} items with default 1×1 size`);

      allItems.sort((a, b) => b.originalImportance - a.originalImportance);
      log(`Sorted items by importance (highest first)`);

      const createOptimizedLayout = () => {
        const generateLayoutBlueprint = (itemCount) => {
          const layoutSpaces = [];
          const dummyItems = Array(itemCount)
            .fill()
            .map((_, i) => ({
              id: `dummy-${i}`,
              originalImportance: 1,
              title: `Dummy Item ${i}`,
            }));

          const trackSpace = (width, height) => {
            layoutSpaces.push({
              type: `${width}x${height}`,
              width,
              height,
            });
            return { id: `dummy-space-${layoutSpaces.length}` };
          };

          const simulateLayoutCreation = () => {
            const remainingDummyItems = [...dummyItems];

            const simulatedGetNextItem = (width, height) => {
              if (remainingDummyItems.length === 0) return null;
              remainingDummyItems.shift();
              return trackSpace(width, height);
            };

            while (remainingDummyItems.length > 0) {
              const itemsLeft = remainingDummyItems.length;

              if (itemsLeft === 4) {
                simulatedGetNextItem(2, 1);
                simulatedGetNextItem(1, 1);
                simulatedGetNextItem(1, 1);
                simulatedGetNextItem(2, 1);
              } else if (itemsLeft >= 3) {
                for (let i = 0; i < 3 && remainingDummyItems.length > 0; i++) {
                  simulatedGetNextItem(1, 1);
                }
              } else if (itemsLeft === 2) {
                simulatedGetNextItem(1, 1);
                simulatedGetNextItem(2, 1);
              } else if (itemsLeft === 1) {
                simulatedGetNextItem(2, 1);
              }

              if (remainingDummyItems.length === 0) break;

              if (remainingDummyItems.length <= 5) {
                if (remainingDummyItems.length === 4) {
                  simulatedGetNextItem(1, 1);
                  simulatedGetNextItem(2, 1);
                  simulatedGetNextItem(2, 1);
                  simulatedGetNextItem(1, 1);
                } else if (remainingDummyItems.length === 3) {
                  for (let i = 0; i < 3; i++) {
                    simulatedGetNextItem(1, 1);
                  }
                } else if (remainingDummyItems.length >= 2) {
                  simulatedGetNextItem(2, 1);
                  simulatedGetNextItem(1, 1);
                } else if (remainingDummyItems.length === 1) {
                  simulatedGetNextItem(2, 1);
                }
              } else {
                if (remainingDummyItems.length >= 3) {
                  simulatedGetNextItem(1, 1);
                  simulatedGetNextItem(2, 2);
                  simulatedGetNextItem(1, 1);
                } else if (remainingDummyItems.length === 2) {
                  simulatedGetNextItem(1, 1);
                  simulatedGetNextItem(2, 1);
                } else if (remainingDummyItems.length === 1) {
                  simulatedGetNextItem(2, 1);
                }
              }

              if (remainingDummyItems.length === 0) break;

              if (remainingDummyItems.length === 4) {
                simulatedGetNextItem(1, 1);
                simulatedGetNextItem(2, 1);
                simulatedGetNextItem(2, 1);
                simulatedGetNextItem(1, 1);
              } else if (remainingDummyItems.length === 3) {
                for (let i = 0; i < 3; i++) {
                  simulatedGetNextItem(1, 1);
                }
              } else if (remainingDummyItems.length === 2) {
                simulatedGetNextItem(2, 1);
                simulatedGetNextItem(1, 1);
              } else if (remainingDummyItems.length === 1) {
                simulatedGetNextItem(2, 1);
              } else {
                simulatedGetNextItem(2, 1);
                simulatedGetNextItem(1, 1);
              }

              if (remainingDummyItems.length === 0) break;

              if (remainingDummyItems.length <= 3) {
                if (remainingDummyItems.length === 3) {
                  for (let i = 0; i < 3; i++) {
                    simulatedGetNextItem(1, 1);
                  }
                } else if (remainingDummyItems.length === 2) {
                  simulatedGetNextItem(1, 1);
                  simulatedGetNextItem(2, 1);
                } else {
                  simulatedGetNextItem(2, 1);
                }
              } else {
                simulatedGetNextItem(1, 1);
                simulatedGetNextItem(2, 1);
              }

              if (remainingDummyItems.length === 0) break;

              if (remainingDummyItems.length <= 4) {
                if (remainingDummyItems.length === 4) {
                  simulatedGetNextItem(2, 1);
                  simulatedGetNextItem(1, 1);
                  simulatedGetNextItem(1, 1);
                  simulatedGetNextItem(2, 1);
                } else if (remainingDummyItems.length === 3) {
                  for (let i = 0; i < 3; i++) {
                    simulatedGetNextItem(1, 1);
                  }
                } else if (remainingDummyItems.length === 2) {
                  simulatedGetNextItem(2, 1);
                  simulatedGetNextItem(1, 1);
                } else {
                  simulatedGetNextItem(2, 1);
                }
              } else {
                simulatedGetNextItem(2, 2);
                simulatedGetNextItem(1, 1);
                simulatedGetNextItem(1, 1);
              }

              if (remainingDummyItems.length === 0) break;

              if (remainingDummyItems.length === 3) {
                for (let i = 0; i < 3; i++) {
                  simulatedGetNextItem(1, 1);
                }
              } else if (remainingDummyItems.length === 2) {
                simulatedGetNextItem(1, 1);
                simulatedGetNextItem(2, 1);
              } else if (remainingDummyItems.length === 1) {
                simulatedGetNextItem(2, 1);
              } else {
                if (remainingDummyItems.length === 4) {
                  simulatedGetNextItem(1, 1);
                  simulatedGetNextItem(2, 1);
                  simulatedGetNextItem(2, 1);
                  simulatedGetNextItem(1, 1);
                } else {
                  simulatedGetNextItem(1, 1);
                  simulatedGetNextItem(2, 1);
                }
              }
            }
          };

          simulateLayoutCreation();
          return layoutSpaces;
        };

        const assignItemsToBlueprint = (items, blueprint) => {
          const spacesByType = {
            "2x2": [],
            "2x1": [],
            "1x1": [],
          };

          blueprint.forEach((space, index) => {
            spacesByType[space.type].push({
              ...space,
              index,
            });
          });

          const sortedItems = [...items].sort(
            (a, b) => b.originalImportance - a.originalImportance
          );
          const resultItems = new Array(sortedItems.length);

          log(
            `Blueprint has: ${spacesByType["2x2"].length} 2×2 spaces, ${spacesByType["2x1"].length} 2×1 spaces, ${spacesByType["1x1"].length} 1×1 spaces`
          );

          const getOriginalSizeLabel = (importance) => {
            switch (importance) {
              case 4:
                return "2×2";
              case 3:
                return "2×1";
              case 2:
                return "1×2";
              case 1:
              default:
                return "1×1";
            }
          };

          let itemIndex = 0;

          while (
            itemIndex < sortedItems.length &&
            sortedItems[itemIndex].originalImportance === 4 &&
            spacesByType["2x2"].length > 0
          ) {
            const item = sortedItems[itemIndex];
            const space = spacesByType["2x2"].shift();

            item.debugDimensions = { width: 2, height: 2, label: "2×2" };
            item.gridStyle = { gridRow: `span 2`, gridColumn: `span 2` };

            resultItems[space.index] = item;
            log(
              `Assigned importance 4 item ${item.id} to 2×2 space at position ${space.index}`
            );
            itemIndex++;
          }

          while (
            itemIndex < sortedItems.length &&
            sortedItems[itemIndex].originalImportance === 3 &&
            spacesByType["2x1"].length > 0
          ) {
            const item = sortedItems[itemIndex];
            const space = spacesByType["2x1"].shift();

            item.debugDimensions = { width: 2, height: 1, label: "2×1" };
            item.gridStyle = { gridRow: `span 1`, gridColumn: `span 2` };

            resultItems[space.index] = item;
            log(
              `Assigned importance 3 item ${item.id} to 2×1 space at position ${space.index}`
            );
            itemIndex++;
          }

          while (
            spacesByType["2x2"].length > 0 &&
            itemIndex < sortedItems.length
          ) {
            const item = sortedItems[itemIndex];
            const space = spacesByType["2x2"].shift();

            item.debugDimensions = { width: 2, height: 2, label: "2×2" };
            item.gridStyle = { gridRow: `span 2`, gridColumn: `span 2` };

            if (item.originalImportance !== 4) {
              adjustments.push({
                itemId: item.id,
                title: item.title,
                from: getOriginalSizeLabel(item.originalImportance),
                to: "2×2",
                reason: "Assigned to 2×2 based on importance ranking",
              });
            }

            resultItems[space.index] = item;
            log(
              `Assigned importance ${item.originalImportance} item ${item.id} to 2×2 space at position ${space.index}`
            );
            itemIndex++;
          }

          while (
            spacesByType["2x1"].length > 0 &&
            itemIndex < sortedItems.length
          ) {
            const item = sortedItems[itemIndex];
            const space = spacesByType["2x1"].shift();

            item.debugDimensions = { width: 2, height: 1, label: "2×1" };
            item.gridStyle = { gridRow: `span 1`, gridColumn: `span 2` };

            if (item.originalImportance !== 3) {
              adjustments.push({
                itemId: item.id,
                title: item.title,
                from: getOriginalSizeLabel(item.originalImportance),
                to: "2×1",
                reason: "Assigned to 2×1 based on importance ranking",
              });
            }

            resultItems[space.index] = item;
            log(
              `Assigned importance ${item.originalImportance} item ${item.id} to 2×1 space at position ${space.index}`
            );
            itemIndex++;
          }

          while (
            spacesByType["1x1"].length > 0 &&
            itemIndex < sortedItems.length
          ) {
            const item = sortedItems[itemIndex];
            const space = spacesByType["1x1"].shift();

            item.debugDimensions = { width: 1, height: 1, label: "1×1" };
            item.gridStyle = { gridRow: `span 1`, gridColumn: `span 1` };

            if (item.originalImportance !== 1) {
              adjustments.push({
                itemId: item.id,
                title: item.title,
                from: getOriginalSizeLabel(item.originalImportance),
                to: "1×1",
                reason: "Assigned to 1×1 based on importance ranking",
              });
            }

            resultItems[space.index] = item;
            log(
              `Assigned importance ${item.originalImportance} item ${item.id} to 1×1 space at position ${space.index}`
            );
            itemIndex++;
          }

          return resultItems.filter((item) => item !== undefined);
        };

        const layoutBlueprint = generateLayoutBlueprint(allItems.length);
        return assignItemsToBlueprint(allItems, layoutBlueprint);
      };

      const finalItems = createOptimizedLayout();

      log(`Created optimized layout with ${finalItems.length} items`);
      log(`Made ${adjustments.length} size adjustments to fit pattern`);

      setGridItems(finalItems);

      let totalCells = 0;
      let totalWidth = 0;

      finalItems.forEach((item) => {
        const width = item.debugDimensions.width;
        const height = item.debugDimensions.height;

        totalCells += width * height;
        totalWidth += width;
      });

      setDebugInfo({
        totalCells,
        totalWidth,
        cellsUsed: totalCells,
        placeholders: 0,
        adjustments,
        gridWidth,
        widthRemainder: totalWidth % gridWidth,
        cellsRemainder: totalCells % gridWidth,
        debugLog: getLog(),
      });
    } catch (err) {
      setError(err.message);
      console.error("Grid error:", err);

      const simpleGrid = portfolioItems.map((item) => {
        return {
          ...item,
          gridStyle: {
            gridRow: `span 1`,
            gridColumn: `span 1`,
          },
          debugDimensions: { width: 1, height: 1, label: "1×1" },
          uniqueKey: `simple-${item.id}`,
        };
      });

      setGridItems(simpleGrid);
    }
  }, []);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") closeProjectModal();
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="bg-[#050610] min-h-screen p-4 text-white font-sans">
      <style jsx>{`
        .portfolio-grid {
          display: grid;
          --base-size: 31vw;
          --grid-size: calc(var(--base-size) - 1rem);
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          grid-auto-rows: var(--grid-size);
        }

        @media (max-width: 768px) {
          .portfolio-grid {
            gap: 0.5rem;
          }
        }

        @media (max-width: 640px) {
          .portfolio-grid {
            gap: 0.25rem;
          }
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.85);
          z-index: 50;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1rem;
          backdrop-filter: blur(5px);
        }

        .modal-content {
          background-color: #111827;
          border-radius: 0.75rem;
          max-width: 95%;
          width: 1000px;
          max-height: 80vh;
          overflow-y: auto;
          position: relative;
          border: 1px solid rgba(59, 130, 246, 0.2);
          box-shadow: 0 0 25px rgba(59, 130, 246, 0.15);
        }

        @media (max-width: 1250px) {
          .modal-content {
            max-height: 65vh;
          }
        }

        .carousel-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 9999px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .carousel-button:hover {
          background-color: rgba(59, 130, 246, 0.7);
        }

        .prev-button {
          left: 10px;
        }

        .next-button {
          right: 10px;
        }

        .swiper {
          width: 100%;
          height: 100%;
        }

        .swiper-slide {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
        }

        .swiper-pagination-bullet-active {
          background: white;
          transform: scale(1.3);
        }

        .swiper-button-next,
        .swiper-button-prev {
          color: white;
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background-color: rgba(59, 130, 246, 0.7);
        }

        .swiper-button-next::after,
        .swiper-button-prev::after {
          font-size: 16px;
          font-weight: bold;
        }
      `}</style>

      <h1 className="text-center text-2xl md:text-3xl lg:text-4xl mb-6 md:mb-8 mt-8 md:mt-12">
        Quelques unes de nos créations
      </h1>

      {error && (
        <div className="bg-red-500 text-white p-4 mb-4 rounded-sm max-w-6xl mx-auto">
          Error: {error}
        </div>
      )}

      <div className="mx-auto mb-6 flex justify-between items-center">
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-sm transition-colors hidden"
        >
          {showDebug ? "Hide Debug Info" : "Show Debug Info"}
        </button>

        {showDebug && (
          <div className="text-xs bg-gray-800 p-4 rounded-sm">
            <h3 className="font-bold mb-2">Grid Stats</h3>
            <p>Total Cells Used: {debugInfo.cellsUsed}</p>
            <p>Total Width Used: {debugInfo.totalWidth || "N/A"}</p>
            <p>Grid Width: {debugInfo.gridWidth || 3}</p>
            <p>Items: {gridItems.length}</p>
            {debugInfo.adjustments && debugInfo.adjustments.length > 0 && (
              <p>Adjustments: {debugInfo.adjustments.length}</p>
            )}
          </div>
        )}
      </div>

      <div className="mx-2 sm:mx-4 md:mx-6">
        <div className="portfolio-grid">
          {gridItems.map((item, index) => (
            <div
              key={`grid-cell-${item.uniqueKey || item.id}`}
              style={{
                gridRow: `span ${item.debugDimensions.height}`,
                gridColumn: `span ${item.debugDimensions.width}`,
              }}
            >
              <ScrollReveal
                key={item.uniqueKey || item.id}
                threshold={0.25}
                delay={(index % 3) * 75}
                animation="fade-up"
                className={`
                  h-full w-full
                  relative overflow-hidden rounded-4xl
                  group cursor-pointer
                  hover:shadow-lg hover:shadow-blue-500/20
                  opacity-0 translate-y-8
                `}
                style={{
                  visibility: "hidden",
                }}
              >
                <div
                  className="h-full w-full"
                  onClick={() => openProjectModal(item)}
                >
                  <div className="absolute inset-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      priority
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300  "></div>
                  </div>
                  <div className="absolute left-0 right-0 bottom-0 z-10">
                    <div className="px-4 py-3 transition-transform duration-300 ease-in-out translate-y-full group-hover:translate-y-0 rounded-b-2xl bg-gradient-to-t from-black/20 to-transparent">
                      <h3 className="text-base font-semibold text-blue-300 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-200 line-clamp-1">
                        {
                          portfolioItems.find((p) => p.id === item.id)
                            ?.description
                        }
                      </p>
                    </div>
                  </div>

                  {showDebug && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white p-2 text-center">
                      <p className="font-bold text-lg">
                        {item.debugDimensions.label}
                      </p>
                      <p className="text-xs">ID: {item.id}</p>
                      <p className="text-xs">
                        Grid: {item.debugDimensions.width}×
                        {item.debugDimensions.height}
                      </p>
                      <p className="text-xs">
                        Cells:{" "}
                        {item.debugDimensions.width *
                          item.debugDimensions.height}
                      </p>
                      <p className="text-xs">
                        Importance: {item.originalImportance}
                      </p>
                      {item.originalImportance !==
                        (item.debugDimensions.width === 2 &&
                        item.debugDimensions.height === 2
                          ? 4
                          : item.debugDimensions.width === 2 &&
                            item.debugDimensions.height === 1
                          ? 3
                          : 1) && (
                        <p className="text-xs text-yellow-400 mt-2">
                          Adjusted from original size
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && selectedProject && (
        <div
          className="modal-overlay"
          onClick={closeProjectModal}
          style={{
            animation: `fadeIn 0.3s ease forwards`,
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: `slideUp 0.4s ease forwards`,
            }}
          >
            <button
              onClick={closeProjectModal}
              className="absolute top-4 right-4 z-10 bg-black/40 hover:bg-blue-600 transition-colors duration-300 rounded-full p-2 text-white"
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="relative h-72 md:h-96">
              {selectedProject.images && selectedProject.images.length > 0 ? (
                <Swiper
                  modules={[Navigation, Pagination, A11y, Autoplay]}
                  spaceBetween={0}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                  loop={true}
                  autoplay={{ delay: 5000, disableOnInteraction: false }}
                  initialSlide={currentImageIndex}
                  onSlideChange={(swiper) =>
                    setCurrentImageIndex(swiper.activeIndex)
                  }
                  className="h-full"
                  style={{
                    "--swiper-pagination-bullet-size": "16px",
                    "--swiper-theme-color": "#ffffff",
                  }}
                >
                  {selectedProject.images.map((image, index) => (
                    <SwiperSlide key={`slide-${index}`}>
                      <div className="relative w-full h-full">
                        <Image
                          src={image}
                          alt={`${selectedProject.title} - image ${index + 1}`}
                          fill
                          priority
                          className="object-cover rounded-t-lg"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  fill
                  priority
                  className="object-cover rounded-t-lg"
                />
              )}

              {/* Project title overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/40 to-transparent p-6 z-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  {selectedProject.title}
                </h2>
              </div>
            </div>

            <div className="p-6 md:p-8 bg-linear-to-b from-gray-900 to-gray-950 rounded-b-lg">
              <div className="mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                  {selectedProject.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {selectedProject.client && (
                  <div>
                    <span className="font-semibold text-blue-300 text-sm uppercase tracking-wide">
                      Client
                    </span>
                    <p className="text-white mt-1">{selectedProject.client}</p>
                  </div>
                )}

                {selectedProject.year && (
                  <div>
                    <span className="font-semibold text-blue-300 text-sm uppercase tracking-wide">
                      Year
                    </span>
                    <p className="text-white mt-1">{selectedProject.year}</p>
                  </div>
                )}
              </div>

              {selectedProject.technologies &&
                selectedProject.technologies.length > 0 && (
                  <div className="mb-6">
                    <span className="font-semibold text-blue-300 text-sm uppercase tracking-wide">
                      Technologies
                    </span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedProject.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-900/30 border border-blue-800/50 rounded-full text-sm text-blue-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {selectedProject.link != null && (
                <div className="mb-8">
                  <a
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors duration-300"
                  >
                    <div className="flex items-center gap-2">
                      <span>{selectedProject.linkLabel || "Voir le projet"}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </div>
                  </a>
                </div>
              )}

              <div className="flex justify-between border-t border-gray-800 pt-6">
                <button
                  onClick={navigateToPrevProject}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span>Previous</span>
                </button>
                <button
                  onClick={navigateToNextProject}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors duration-300"
                >
                  <span>Next</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(30px);
            opacity: 0;
          }
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.85);
          z-index: 50;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1rem;
          backdrop-filter: blur(8px);
        }

        .modal-content {
          background-color: #0c1221;
          border-radius: 0.75rem;
          max-width: 95%;
          width: 1000px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          border: 1px solid rgba(59, 130, 246, 0.2);
          box-shadow: 0 0 40px rgba(59, 130, 246, 0.2),
            0 0 100px rgba(0, 0, 0, 0.5);
          scrollbar-width: thin;
          scrollbar-color: rgba(59, 130, 246, 0.5) rgba(17, 24, 39, 0.7);
        }

        .modal-content::-webkit-scrollbar {
          width: 8px;
        }

        .modal-content::-webkit-scrollbar-track {
          background: rgba(17, 24, 39, 0.7);
          border-radius: 0 0.75rem 0.75rem 0;
        }

        .modal-content::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 20px;
        }

        /* Swiper custom styles */
        .swiper-pagination {
          position: absolute;
          bottom: 10px !important;
          z-index: 20;
        }

        .swiper-button-next,
        .swiper-button-prev {
          z-index: 20;
        }

        /* Make sure swiper buttons are visible on mobile */
        @media (max-width: 640px) {
          .swiper-button-next::after,
          .swiper-button-prev::after {
            font-size: 14px;
          }

          .swiper-button-next,
          .swiper-button-prev {
            width: 32px;
            height: 32px;
          }
        }
      `}</style>
    </div>
  );
}
