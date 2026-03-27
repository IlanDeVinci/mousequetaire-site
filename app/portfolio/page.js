import PortfolioGrid from "../../components/portfolio/PortfolioGrid";
import PortfolioStyles from "../../components/portfolio/PortfolioStyles";

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
  return (
    <div className="bg-[#050610] min-h-screen p-4 text-white font-sans">
      <PortfolioStyles />

      <h1 className="text-center text-2xl md:text-3xl lg:text-4xl mb-6 md:mb-8 mt-8 md:mt-12">
        Quelques unes de nos créations
      </h1>

      <PortfolioGrid portfolioItems={portfolioItems} />
    </div>
  );
}
