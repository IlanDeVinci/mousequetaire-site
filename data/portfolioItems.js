export const portfolioItems = [
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
