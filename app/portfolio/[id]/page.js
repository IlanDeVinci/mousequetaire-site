"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
// Portfolio items data from main page
const portfolioItems = [
  {
    id: 1,
    title: "Murder Party App",
    description:
      "Application web interactive conçue pour organiser et animer des murder parties entre amis. Le joueur hote cree un scenario complet avec des personnages, des indices caches et des rebondissements. Chaque participant recoit son role, ses objectifs secrets et ses informations via une interface dediee. Le jeu se deroule en temps reel avec un systeme de phases (enquete, accusation, revelation) qui guide les joueurs tout au long de la partie. L'application gere automatiquement la distribution des indices au bon moment et permet aux joueurs d'echanger des informations entre eux. L'interface est entierement thematique avec une ambiance visuelle sombre et immersive adaptee a l'univers du jeu.",
    image: "/images/projets/app-murder party/menueprincipal.png",
    importance: 3,
    technologies: ["Next.js", "TailwindCSS"],
    client: "Projet personnel",
    year: "2024",
    link: null,
    linkLabel: "Voir sur GitHub",
    challenge:
      "Concevoir une experience de jeu fluide et immersive en temps reel, avec gestion des roles, des indices et du deroulement du scenario pour plusieurs joueurs simultanement.",
    solution:
      "Developpement d'une application Next.js avec un systeme de gestion d'etat en temps reel, des interfaces thematiques pour chaque role et un moteur de scenario flexible.",
    results:
      "Application fonctionnelle permettant d'organiser des murder parties de 4 a 12 joueurs avec une experience utilisateur immersive et intuitive.",
    gallery: [
      "/images/projets/app-murder party/menueprincipal.png",
      "/images/projets/app-murder party/chat.png",
      "/images/projets/app-murder party/classement.png",
      "/images/projets/app-murder party/connexion.png",
    ],
  },
  {
    id: 2,
    title: "Rackoon Streaming",
    description:
      "Plateforme de streaming video pensee comme une alternative moderne aux services existants. L'application propose un catalogue de contenus organise par categories, genres et popularite, avec un moteur de recherche avance et des filtres personnalisables. Le lecteur video integre offre une lecture fluide avec controle de qualite adaptatif. L'interface s'inspire des meilleures pratiques UX des plateformes de streaming actuelles, avec un systeme de recommandations, des listes de favoris et un historique de visionnage pour chaque utilisateur. Le design responsive assure une experience optimale sur tous les appareils, du smartphone au grand ecran.",
    image: "/images/projets/vektroid/vektroid-accueil.png",
    importance: 3,
    technologies: ["React.js", "TailwindCSS"],
    client: "Projet personnel",
    year: "2024",
    link: null,
    linkLabel: "Voir sur GitHub",
    challenge:
      "Creer une interface de streaming intuitive et performante avec un systeme de navigation fluide entre les contenus et un lecteur video optimise.",
    solution:
      "Architecture React.js modulaire avec un systeme de composants reutilisables, un lecteur video custom et une interface responsive optimisee pour tous les ecrans.",
    results:
      "Plateforme de streaming complete avec catalogue, recherche, filtres et lecture video fluide sur desktop et mobile.",
    gallery: ["/images/projets/vektroid/vektroid-accueil.png"],
  },
  {
    id: 3,
    title: "Reservation de bureaux CCI",
    description:
      "Application professionnelle de reservation de bureaux developpee pour la Chambre de Commerce et d'Industrie France en Republique Tcheque. Integree directement dans Microsoft Teams sous forme d'onglet, elle permet aux employes de visualiser en temps reel la disponibilite des espaces de travail (bureaux individuels, salles de reunion, espaces partages), de reserver un creneau en quelques clics et de gerer leurs reservations existantes. Un panneau d'administration permet aux gestionnaires de configurer les espaces, de definir les regles de reservation et de consulter les statistiques d'occupation. Le systeme gere les conflits de reservation et envoie des confirmations automatiques.",
    image: "/images/projets/Application-teams/accueillereservbureau.png",
    importance: 4,
    technologies: ["React.js", "CSS", "HTML", "Microsoft Teams"],
    client: "CCI France en Republique Tcheque",
    year: "2024",
    link: null,
    linkLabel: "Voir sur GitHub",
    challenge:
      "Integrer un systeme de reservation complet dans l'ecosysteme Microsoft Teams tout en assurant une synchronisation en temps reel des disponibilites des bureaux.",
    solution:
      "Developpement d'une application React.js deployee comme onglet Teams avec une API de synchronisation pour les disponibilites et un calendrier interactif.",
    results:
      "Systeme de reservation operationnel utilise quotidiennement par les employes de la CCI, ameliorant significativement la gestion des espaces de travail.",
    gallery: [
      "/images/projets/Application-teams/accueillereservbureau.png",
      "/images/projets/Application-teams/menuereservation.png",
      "/images/projets/Application-teams/reservationsalle.png",
    ],
  },
  {
    id: 4,
    title: "Apprentissage de Langues IA",
    description:
      "Application innovante d'apprentissage de langues etrangeres propulsee par l'intelligence artificielle Gemini de Google. L'outil analyse le niveau de l'utilisateur puis genere des exercices sur mesure : traduction, comprehension orale, grammaire, vocabulaire et expression ecrite. L'IA corrige chaque reponse en temps reel avec des explications detaillees et des suggestions d'amelioration. Le systeme adapte progressivement la difficulte en fonction des performances, en insistant sur les points faibles identifies. L'utilisateur peut choisir parmi plusieurs langues et suivre sa progression via un tableau de bord personnalise avec des statistiques detaillees sur ses performances.",
    image: "/images/projets/conge-chartrettes/image-mon-compte.png",
    importance: 3,
    technologies: ["Next.js", "API Gemini", "TailwindCSS"],
    client: "Projet personnel",
    year: "2024",
    link: null,
    linkLabel: "Voir sur GitHub",
    challenge:
      "Exploiter l'API Gemini pour generer des exercices de langue pertinents et personnalises, avec une correction intelligente et un suivi de progression.",
    solution:
      "Integration de l'API Gemini dans une application Next.js avec un systeme de prompts optimises pour generer des exercices adaptes et fournir des corrections detaillees.",
    results:
      "Application d'apprentissage fonctionnelle avec generation d'exercices IA, correction automatique et adaptation du niveau en temps reel.",
    gallery: ["/images/projets/conge-chartrettes/image-mon-compte.png"],
  },
  {
    id: 5,
    title: "Conge Chartrettes",
    description:
      "Projet complet melant hardware et software realise pour la mairie de Chartrettes. L'application web Next.js permet aux agents municipaux de poser leurs conges, de consulter leur solde de jours restants et de visualiser le planning de l'equipe sur un calendrier partage. Les responsables valident ou refusent les demandes depuis un back-office dedie avec notifications automatiques. En parallele, un dispositif physique de badgeage base sur un microcontroleur ESP32 programme en C++ permet aux agents de pointer a leur arrivee et leur depart. Le boitier du badge a ete entierement modelise en 3D sur Fusion 360 puis imprime. Les donnees de badgeage sont synchronisees avec l'application web pour un suivi complet des presences et des absences.",
    image: "/images/projets/conge-chartrettes/accueil-reservationmairie.png",
    importance: 4,
    technologies: ["Next.js", "TailwindCSS", "C++", "ESP32", "Fusion 360"],
    client: "Mairie de Chartrettes",
    year: "2024",
    link: null,
    linkLabel: "Voir sur GitHub",
    challenge:
      "Concevoir un systeme hybride combinant application web et dispositif IoT pour digitaliser la gestion des conges d'une collectivite locale avec des contraintes de fiabilite et de simplicite d'utilisation.",
    solution:
      "Developpement d'une application Next.js pour la partie web, programmation en C++ d'un ESP32 pour le badgeage et conception 3D du boitier sur Fusion 360 pour l'installation physique.",
    results:
      "Systeme de gestion des conges entierement operationnel, utilise par les agents de la mairie avec un suivi en temps reel des presences et des conges.",
    gallery: [
      "/images/projets/conge-chartrettes/accueil-reservationmairie.png",
      "/images/projets/conge-chartrettes/image-mon-compte.png",
      "/images/projets/conge-chartrettes/imagemesreservation.png",
    ],
  },
  {
    id: 6,
    title: "PokemonBattleDetector",
    description:
      "Extension Twitch originale qui utilise la vision par ordinateur en Python pour analyser le flux video d'un stream en direct et detecter automatiquement quand un combat Pokemon demarre a l'ecran. Lorsqu'un combat est identifie, l'extension capture les informations visibles (Pokemon en jeu, barres de vie) et les affiche aux spectateurs via un overlay web integre au stream. Le projet combine un backend Python pour l'analyse d'images avec un frontend HTML/CSS/JS pour l'interface de l'extension Twitch, le tout communiquant en temps reel. L'algorithme a ete entraine pour reconnaitre les ecrans de combat specifiques aux differentes generations de jeux Pokemon.",
    image: "/images/projets/IA-recconaissance-objet/reconaissance-telephone.png",
    importance: 1,
    technologies: ["Python", "HTML", "CSS", "JS", "Extension Twitch"],
    client: "Projet personnel",
    year: "2023",
    link: null,
    linkLabel: "Voir sur GitHub",
    challenge:
      "Detecter en temps reel les sequences de combat Pokemon dans un flux video Twitch et afficher les informations pertinentes aux spectateurs.",
    solution:
      "Algorithme de detection d'image en Python couple a une extension Twitch avec une interface web pour l'affichage des resultats en overlay sur le stream.",
    results:
      "Extension fonctionnelle capable de detecter les combats Pokemon en temps reel avec un affichage overlay pour les viewers Twitch.",
    gallery: [
      "/images/projets/IA-recconaissance-objet/reconaissance-telephone.png",
    ],
  },
  {
    id: 7,
    title: "IA Detection d'objets",
    description:
      "Programme d'intelligence artificielle capable de detecter et d'identifier des objets en temps reel dans un flux video. Le systeme utilise le modele de deep learning YOLOv3 (You Only Look Once) combine avec la librairie OpenCV pour traiter les images provenant d'une webcam ou d'un fichier video. Il peut reconnaitre plus de 80 categories d'objets differents (personnes, vehicules, animaux, objets du quotidien) et les encadrer a l'ecran avec leur label et leur score de confiance. Le programme est optimise pour fonctionner en temps reel sur du materiel grand public, avec un affichage fluide des boites de detection et la possibilite de filtrer les objets par categorie.",
    image: "/images/projets/IA-recconaissance-objet/reconaissance-telephone.png",
    importance: 1,
    technologies: ["Python", "YOLOv3", "OpenCV"],
    client: "Projet personnel",
    year: "2023",
    link: null,
    linkLabel: "Voir sur GitHub",
    challenge:
      "Implementer un systeme de detection d'objets performant en temps reel avec une precision suffisante pour identifier plusieurs categories d'objets simultanement.",
    solution:
      "Utilisation du modele pre-entraine YOLOv3 avec OpenCV pour le traitement video en temps reel, optimise pour fonctionner sur du materiel grand public.",
    results:
      "Systeme de detection fonctionnel capable d'identifier plus de 80 categories d'objets en temps reel avec un framerate acceptable.",
    gallery: [
      "/images/projets/IA-recconaissance-objet/reconaissance-telephone.png",
      "/images/projets/IA-recconaissance-objet/reconaissance-fourchettte.png",
      "/images/projets/IA-recconaissance-objet/reconnaisance-gateau.png",
    ],
  },
  {
    id: 8,
    title: "IA Langue des signes",
    description:
      "Application d'accessibilite utilisant l'intelligence artificielle pour reconnaitre la langue des signes en temps reel. Le systeme capture le flux video de la webcam, detecte les mains et les gestes de l'utilisateur grace a un modele YOLO entraine specifiquement sur un dataset de la langue des signes, puis traduit chaque signe en lettre ou mot affiche a l'ecran. L'objectif est de faciliter la communication entre les personnes sourdes ou malentendantes et celles qui ne connaissent pas la langue des signes. OpenCV assure le traitement video et l'affichage des resultats en surimposition. Le modele a ete entraine sur un dataset personnalise de gestes pour maximiser la precision de la reconnaissance.",
    image: "/images/projets/IA-reconnaissancelanguedessignes/montrelettre.png",
    importance: 1,
    technologies: ["Python", "YOLO", "OpenCV"],
    client: "Projet personnel",
    year: "2023",
    link: null,
    linkLabel: "Voir sur GitHub",
    challenge:
      "Reconnaitre les gestes de la langue des signes en temps reel avec une precision suffisante pour permettre une communication fluide.",
    solution:
      "Entrainement d'un modele YOLO personnalise sur un dataset de gestes de la langue des signes, couple a OpenCV pour le traitement video en temps reel.",
    results:
      "Application fonctionnelle capable de reconnaitre les lettres et gestes courants de la langue des signes en temps reel via webcam.",
    gallery: [
      "/images/projets/IA-reconnaissancelanguedessignes/montrelettre.png",
      "/images/projets/IA-reconnaissancelanguedessignes/ecritlettre.png",
    ],
  },
  {
    id: 9,
    title: "MousequetaireShop",
    description:
      "Boutique en ligne e-commerce complete construite sur l'ecosysteme PrestaShop avec des modules personnalises developpes en Laravel/PHP. Le site propose un catalogue de produits riche avec fiches detaillees, images haute qualite et variantes de produits. Un systeme de filtres et de recherche permet de trouver rapidement le bon produit. Le panier d'achat intuitif et le tunnel de paiement securise assurent une experience d'achat fluide. Le back-office permet de gerer les produits, les stocks, les commandes et les clients. Des fonctionnalites avancees comme les codes promo, les avis clients et le suivi de livraison ont ete integrees pour offrir une experience e-commerce professionnelle.",
    image: "/images/projets/pizzeria/accueil pizzeria.png",
    importance: 3,
    technologies: ["Laravel", "PrestaShop", "PHP"],
    client: "Projet personnel",
    year: "2023",
    link: null,
    linkLabel: "Voir sur GitHub",
    challenge:
      "Creer une boutique en ligne complete et performante en combinant la puissance de Laravel avec les fonctionnalites e-commerce de PrestaShop.",
    solution:
      "Architecture hybride utilisant PrestaShop pour la gestion du catalogue et du panier, avec des modules personnalises developpes en Laravel/PHP pour les fonctionnalites specifiques.",
    results:
      "Boutique en ligne fonctionnelle avec catalogue produits, gestion du panier, paiement securise et interface d'administration complete.",
    gallery: ["/images/projets/pizzeria/accueil pizzeria.png"],
  },
  {
    id: 10,
    title: "Pizzeria Chartrettes",
    description:
      "Site vitrine professionnel realise pour la pizzeria de Chartrettes, conçu pour attirer de nouveaux clients via le referencement local. Le site presente l'ensemble du menu avec les prix, les ingredients et les photos des plats, ainsi que les horaires d'ouverture, l'adresse avec integration Google Maps et un numero de telephone en click-to-call. Un formulaire de commande en ligne permet aux clients de passer commande pour la livraison ou le retrait sur place. L'optimisation SEO cible les recherches locales (pizzeria Chartrettes, pizza livraison 77) pour maximiser la visibilite sur Google. Le design responsive s'adapte parfaitement aux smartphones, support principal de recherche des clients locaux.",
    image: "/images/projets/pizzeria/accueil pizzeria.png",
    importance: 4,
    technologies: ["HTML", "CSS", "JavaScript", "SEO"],
    client: "Pizzeria de Chartrettes",
    year: "2023",
    link: null,
    linkLabel: "Visiter le site",
    challenge:
      "Creer un site vitrine attractif et optimise pour le referencement local afin d'augmenter la visibilite de la pizzeria et faciliter les commandes en ligne.",
    solution:
      "Developpement d'un site responsive avec optimisation SEO locale, integration de Google Maps, menu interactif et formulaire de commande en ligne.",
    results:
      "Amelioration significative de la visibilite en ligne de la pizzeria avec un bon positionnement sur les recherches locales et une augmentation des commandes.",
    gallery: [
      "/images/projets/pizzeria/accueil pizzeria.png",
      "/images/projets/pizzeria/infopizza.png",
      "/images/projets/pizzeria/menue-pizza.png",
    ],
  },
  {
    id: 11,
    title: "Reservation Salles Chartrettes",
    description:
      "Application web de reservation de salles municipales developpee pour la mairie de Chartrettes. Les habitants peuvent consulter les salles disponibles (salle des fetes, salle de reunion, gymnase), visualiser les creneaux libres sur un calendrier interactif et soumettre une demande de reservation en ligne. Cote administration, le personnel municipal dispose d'un tableau de bord pour valider ou refuser les demandes, gerer les tarifs selon le type de salle et d'evenement, et consulter l'historique des reservations. Le systeme envoie des notifications automatiques a chaque etape du processus (confirmation, rappel, annulation).",
    image: "/images/projets/reservation-chartrettes/ecran-acueille.png",
    importance: 3,
    technologies: ["Next.js", "TailwindCSS"],
    client: "Mairie de Chartrettes",
    year: "2024",
    link: null,
    linkLabel: "Voir sur GitHub",
    challenge:
      "Digitaliser le processus de reservation des salles municipales avec un systeme simple pour les administres et un outil de gestion efficace pour l'administration.",
    solution:
      "Application Next.js avec calendrier interactif, systeme de roles (administre/administrateur) et workflow de validation des demandes de reservation.",
    results:
      "Systeme de reservation en ligne operationnel, simplifiant le processus pour les habitants et l'equipe municipale de Chartrettes.",
    gallery: [
      "/images/projets/reservation-chartrettes/ecran-acueille.png",
      "/images/projets/reservation-chartrettes/ecrancalendrier.png",
      "/images/projets/reservation-chartrettes/selectionbatiment.png",
      "/images/projets/reservation-chartrettes/selectionsalle.png",
    ],
  },
  {
    id: 12,
    title: "Yodea - Maison d'edition",
    description:
      "Site vitrine elegant conçu pour la maison d'edition Yodea. Le site met en valeur le catalogue complet des ouvrages publies avec pour chaque livre une fiche detaillee comprenant resume, extrait, informations sur l'auteur et prix. Une section dediee presente les auteurs de la maison avec leur biographie et leur bibliographie complete. La page d'actualites relaie les evenements litteraires, seances de dedicaces et nouvelles parutions. Le design a ete pense pour refleter l'identite editoriale de Yodea : soigne, sobre et centre sur le contenu textuel, avec une typographie choisie pour le confort de lecture.",
    image: "/images/projets/sitevitrine-yodea/ecran-accueil.png",
    importance: 1,
    technologies: ["HTML", "CSS", "JavaScript"],
    client: "Yodea",
    year: "2023",
    link: null,
    linkLabel: "Visiter le site",
    challenge:
      "Concevoir un site vitrine qui reflete l'elegance et le serieux d'une maison d'edition tout en mettant en valeur son catalogue et ses auteurs.",
    solution:
      "Design epure et typographie soignee avec une navigation intuitive pour explorer le catalogue, les fiches auteurs et les actualites de la maison d'edition.",
    results:
      "Site vitrine professionnel renforçant la presence en ligne de Yodea et facilitant la decouverte de son catalogue par les lecteurs et les libraires.",
    gallery: [
      "/images/projets/sitevitrine-yodea/ecran-accueil.png",
      "/images/projets/sitevitrine-yodea/livre1.png",
      "/images/projets/sitevitrine-yodea/livre2.png",
      "/images/projets/sitevitrine-yodea/livre3.png",
    ],
  },
  {
    id: 13,
    title: "Wizzelek - Experience Vektroid",
    description:
      "Experience web artistique et immersive qui plonge l'utilisateur dans un univers 3D interactif inspire de l'esthetique vaporwave de Vektroid. Grace a Three.js, le site propose une navigation libre dans un espace tridimensionnel peuple de formes geometriques, de textures retro et d'effets visuels reactifs aux actions de l'utilisateur. L'ambiance sonore interactive accompagne l'exploration et change selon la zone visitee. Le projet explore les possibilites creatives du web 3D en fusionnant art numerique, musique electronique et interaction utilisateur dans une experience sensorielle unique qui repousse les limites du web traditionnel.",
    image: "/images/projets/vektroid/vektroid-accueil.png",
    importance: 4,
    technologies: ["HTML", "CSS", "Three.js"],
    client: "Projet artistique",
    year: "2023",
    link: null,
    linkLabel: "Visiter le site",
    challenge:
      "Creer une experience web 3D immersive et performante qui capture l'esthetique unique de Vektroid tout en restant accessible sur differents navigateurs et appareils.",
    solution:
      "Utilisation de Three.js pour le rendu 3D temps reel avec des shaders personnalises, des animations procedurale et une interaction utilisateur intuitive dans l'espace 3D.",
    results:
      "Experience artistique immersive avec un univers 3D navigable, des effets visuels reactifs et une ambiance sonore interactive.",
    gallery: [
      "/images/projets/vektroid/vektroid-accueil.png",
      "/images/projets/vektroid/lecteurvektroid.png",
      "/images/projets/vektroid/creationdesign.png",
    ],
  },
  {
    id: 14,
    title: "Site Marchand Amazon Disjoncteurs",
    description:
      "Site e-commerce specialise pour un vendeur professionnel Amazon de disjoncteurs et materiel electrique. Le site propose des fiches produits techniques detaillees avec specifications, normes de conformite, schemas de branchement et guides de choix pour aider les clients (electriciens, particuliers) a trouver le bon disjoncteur. Des tableaux comparatifs permettent de comparer les caracteristiques entre modeles. Le design est pense pour la conversion avec des elements de rassurance (garantie, livraison rapide, service client) et un parcours d'achat simplifie redirigeant vers la page Amazon du produit.",
    image: "/images/projets/sitevitrine-yodea/ecran-accueil.png",
    importance: 1,
    technologies: ["HTML", "CSS", "JavaScript"],
    client: "Marchand Amazon",
    year: "2023",
    link: null,
    linkLabel: "Visiter le site",
    challenge:
      "Creer une page produit convaincante pour des articles techniques, en rendant les specifications accessibles tout en maximisant le taux de conversion.",
    solution:
      "Design centre sur la conversion avec des fiches produits detaillees, des comparatifs visuels, des guides d'achat et des elements de rassurance pour les acheteurs.",
    results:
      "Page produit optimisee avec une presentation claire des specifications techniques et un parcours d'achat simplifie pour les clients Amazon.",
    gallery: ["/images/projets/sitevitrine-yodea/ecran-accueil.png"],
  },
  {
    id: 15,
    title: "Site Mousequetaire",
    description:
      "Site portfolio officiel de l'agence Mousequetaire, conçu pour etre lui-meme une demonstration du savoir-faire de l'equipe. Le site utilise des animations GSAP sophistiquees pour les transitions de pages, les effets de parallaxe au scroll et les micro-interactions. Il presente les services de l'agence (developpement web, design, IA), le portfolio complet des realisations avec modales interactives, les profils de l'equipe et un formulaire de contact. Le design sombre et moderne avec des accents bleus cree une identite visuelle forte et memorable. L'optimisation des performances garantit des temps de chargement rapides malgre la richesse des animations.",
    image: "/images/projets/vektroid/vektroid-accueil.png",
    importance: 4,
    technologies: ["Next.js", "TailwindCSS", "GSAP"],
    client: "Mousequetaire",
    year: "2024",
    link: null,
    linkLabel: "Visiter le site",
    challenge:
      "Concevoir un site d'agence qui soit lui-meme une vitrine du savoir-faire de Mousequetaire, avec des animations fluides et un design qui se demarque.",
    solution:
      "Developpement Next.js avec animations GSAP pour les transitions et les effets de scroll, design systeme personnalise avec TailwindCSS et optimisation des performances.",
    results:
      "Site d'agence moderne et performant servant de vitrine aux competences de Mousequetaire, avec des animations fluides et une experience utilisateur memorisable.",
    gallery: ["/images/projets/vektroid/vektroid-accueil.png"],
  },
];

export default function ProjectDetails() {
  const params = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    // Find the project based on the ID from the URL
    const projectId = parseInt(params.id);
    const foundProject = portfolioItems.find((item) => item.id === projectId);

    if (foundProject) {
      setProject(foundProject);
      // Set document title
      document.title = `${foundProject.title} | Portfolio`;
    }

    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="bg-[#050610] min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-white">
          Loading project details...
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-[#050610] min-h-screen p-8 text-white">
        <div className="max-w-4xl mx-auto mt-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
          <p className="mb-8">
            Sorry, we couldn&apos;t find the project you&apos;re looking for.
          </p>
          <Link
            href="/portfolio"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors"
          >
            Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#050610] min-h-screen text-white font-sans">
      {/* Hero section with project image */}
      <div className="relative h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh]">
        <Image
          src={project.gallery ? project.gallery[activeImage] : project.image}
          alt={project.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black to-transparent"></div>

        <div className="absolute bottom-0 left-0 w-full p-4 sm:p-6 md:p-8 lg:p-16">
          <div className="max-w-6xl mx-auto">
            <Link
              href="/portfolio"
              className="inline-block mb-4 sm:mb-6 text-blue-300 hover:text-blue-100 transition-colors"
            >
              ← Back to Portfolio
            </Link>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-2">
              {project.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
              <span className="bg-blue-900/50 px-2 sm:px-3 py-1 rounded-full">
                {project.client}
              </span>
              <span className="bg-gray-800/80 px-2 sm:px-3 py-1 rounded-full">
                {project.year}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
          {/* Left column - Project details */}
          <div className="md:col-span-2">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
              Project Overview
            </h2>
            <p className="text-gray-300 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
              {project.description}
            </p>

            {project.challenge && (
              <>
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                  The Challenge
                </h2>
                <p className="text-gray-300 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                  {project.challenge}
                </p>
              </>
            )}

            {project.solution && (
              <>
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                  The Solution
                </h2>
                <p className="text-gray-300 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                  {project.solution}
                </p>
              </>
            )}

            {project.results && (
              <>
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                  The Results
                </h2>
                <p className="text-gray-300 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                  {project.results}
                </p>
              </>
            )}

            {/* Project gallery */}
            {project.gallery && project.gallery.length > 1 && (
              <div className="mt-6 sm:mt-8 md:mt-12">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                  Project Gallery
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                  {project.gallery.map((img, index) => (
                    <div
                      key={index}
                      className={`relative aspect-video cursor-pointer overflow-hidden rounded-lg ${
                        activeImage === index ? "ring-2 ring-blue-500" : ""
                      }`}
                      onClick={() => setActiveImage(index)}
                    >
                      <Image
                        src={img}
                        alt={`${project.title} - Gallery ${index + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column - Project meta */}
          <div className="md:col-span-1 mt-6 md:mt-0">
            <div className="bg-gray-900 rounded-lg p-4 sm:p-6 sticky top-8">
              <h3 className="text-lg sm:text-xl font-bold mb-4">
                Project Details
              </h3>

              <div className="mb-4 sm:mb-6">
                <h4 className="text-xs sm:text-sm uppercase text-gray-400">
                  Client
                </h4>
                <p className="text-base sm:text-lg">{project.client}</p>
              </div>

              <div className="mb-4 sm:mb-6">
                <h4 className="text-xs sm:text-sm uppercase text-gray-400">
                  Year
                </h4>
                <p className="text-base sm:text-lg">{project.year}</p>
              </div>

              {project.technologies && project.technologies.length > 0 && (
                <div className="mb-4 sm:mb-6">
                  <h4 className="text-xs sm:text-sm uppercase text-gray-400">
                    Technologies
                  </h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="bg-blue-900/30 text-blue-200 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 px-4 py-2 sm:py-3 rounded-lg transition-colors mt-6 sm:mt-8 text-sm sm:text-base"
                >
                  {project.linkLabel || "Voir le projet"}
                </a>
              )}

              <Link
                href="/contact"
                className={`block w-full text-center bg-gray-700 hover:bg-gray-600 px-4 py-2 sm:py-3 rounded-lg transition-colors ${project.link ? "mt-3" : "mt-6 sm:mt-8"} text-sm sm:text-base`}
              >
                Discuter d'un projet similaire
              </Link>
            </div>
          </div>
        </div>

        {/* Next/Previous Project navigation */}
        <div className="mt-8 sm:mt-12 md:mt-16 pt-6 sm:pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            {project.id > 1 && (
              <Link
                href={`/portfolio/${project.id - 1}`}
                className="flex items-center text-blue-300 hover:text-blue-100 mb-4 sm:mb-0 group"
              >
                <span className="transform group-hover:-translate-x-1 transition-transform">
                  ←
                </span>
                <span className="ml-2">Previous Project</span>
              </Link>
            )}

            <Link
              href="/portfolio"
              className="text-gray-400 hover:text-white transition-colors"
            >
              All Projects
            </Link>

            {project.id < portfolioItems.length && (
              <Link
                href={`/portfolio/${project.id + 1}`}
                className="flex items-center text-blue-300 hover:text-blue-100 mt-4 sm:mt-0 group"
              >
                <span className="mr-2">Next Project</span>
                <span className="transform group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
