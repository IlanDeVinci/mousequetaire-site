"use client";
import Image from "next/image";
import { useState, useCallback, useRef, useEffect } from "react";
import ScrollReveal from "../../components/ScrollReveal";
import { useGSAP } from "../../context/GSAPContext";

const services = [
  {
    icon: "/bulbe.svg",
    title: "Développement Web",
    description:
      "Création de sites web modernes et compatibles sur tous type d'appareils",
    bgColor: "#004165",
  },
  {
    icon: "/supporttechnique.svg",
    title: "Support Technique",
    description: "Assistance et maintenance professionnelle",
    bgColor: "#005180",
  },
  {
    icon: "/internetpicto.svg",
    title: "Conseil",
    description:
      "Solutions digitales sur mesure, communication, community management, rdv de mises au point professionnelles régulières, ...",
    bgColor: "#006A9E",
  },
];

const sections = [
  {
    title: "Expertise Technique",
    description:
      "Notre équipe possède une expertise approfondie dans les dernières technologies web et mobile.",
    animationType: "svg-bubbles",
    isReversed: false,
  },
  {
    title: "Support ultra réactif",
    description:
      "Un hébergement assuré par nos propres serveurs et une équipe ultra réactive pour intervenir en cas de problème technique",
    animationType: "typewriter",
    isReversed: true,
  },
  {
    title: "Solutions Innovantes",
    description:
      "Des solutions créatives et innovantes pour répondre à vos défis numériques.",
    animationType: "grid-elements",
    isReversed: false,
  },
];

// SVG Bubbles Animation Component with GSAP
const SvgBubblesAnimation = () => {
  const { gsap, contextReady } = useGSAP();
  const [visibleBubble, setVisibleBubble] = useState(null);
  const bubble1Ref = useRef(null);
  const bubble2Ref = useRef(null);
  const bubble3Ref = useRef(null);
  const timelineRef = useRef(null);

  useEffect(() => {
    if (!gsap || !contextReady) return;

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const bubbles = [
      bubble1Ref.current,
      bubble2Ref.current,
      bubble3Ref.current,
    ];

    // Set initial states - all bubbles start below and invisible
    bubbles.forEach((bubble) => {
      if (bubble) {
        gsap.set(bubble, {
          opacity: 0,
          y: 80,
          transformOrigin: "center center",
        });
      }
    });

    // Create timeline for bubble animations
    const tl = gsap.timeline({ repeat: -1 });
    const yoffset = -120;
    // Bubble 1 animation sequence
    tl.add(() => setVisibleBubble(1))
      .to(bubble1Ref.current, {
        opacity: 1,
        y: yoffset,
        duration: 0.8,
        ease: "power2.out",
      })
      .to({}, { duration: 1.5 }) // Pause for 1.5 seconds
      .to(bubble1Ref.current, {
        opacity: 0,
        y: yoffset - 40,
        duration: 0.6,
        ease: "power2.in",
      })
      .to({}, { duration: 0.3 }) // Small delay before next bubble

      // Bubble 2 animation sequence
      .add(() => setVisibleBubble(2))
      .to(bubble2Ref.current, {
        opacity: 1,
        y: yoffset,
        duration: 0.8,
        ease: "power2.out",
      })
      .to({}, { duration: 1.5 }) // Pause for 1.5 seconds
      .to(bubble2Ref.current, {
        opacity: 0,
        y: yoffset - 40,
        duration: 0.6,
        ease: "power2.in",
      })
      .to({}, { duration: 0.3 }) // Small delay before next bubble

      // Bubble 3 animation sequence
      .add(() => setVisibleBubble(3))
      .to(bubble3Ref.current, {
        opacity: 1,
        y: yoffset,
        duration: 0.8,
        ease: "power2.out",
      })
      .to({}, { duration: 1.5 }) // Pause for 1.5 seconds
      .to(bubble3Ref.current, {
        opacity: 0,
        y: yoffset - 40,
        duration: 0.6,
        ease: "power2.in",
      })

      // Reset all bubbles to starting position
      .add(() => setVisibleBubble(null))
      .set([bubble1Ref.current, bubble2Ref.current, bubble3Ref.current], {
        y: 80,
        opacity: 0,
      })
      .to({}, { duration: 1 }); // Wait before restarting

    timelineRef.current = tl;

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [gsap, contextReady]);

  return (
    <div className="relative h-full w-full flex items-center justify-center overflow-visible">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full">
          <Image
            src="/images/papotte.svg"
            alt="Communication"
            fill
            className="object-contain p-4"
            style={{ marginTop: "80px" }}
          />

          {/* Bubble 1 - Left side */}
          <div
            ref={bubble1Ref}
            className="absolute"
            style={{
              width: "clamp(120px, 20vw, 200px)",
              height: "clamp(67px, 11.2vw, 112px)",
              left: "clamp(5%, 8vw, 60px)",
              top: "clamp(25%, 35%, 45%)",
              transform: "scaleX(-1)",
            }}
          >
            <Image
              src="/images/bulle1.svg"
              alt="Message"
              fill
              className="object-contain"
            />
          </div>

          {/* Bubble 2 - Right side */}
          <div
            ref={bubble2Ref}
            className="absolute"
            style={{
              width: "clamp(120px, 20vw, 200px)",
              height: "clamp(74px, 12.4vw, 124px)",
              right: "clamp(5%, 8vw, 60px)",
              top: "clamp(20%, 30%, 40%)",
              transform: "scaleX(-1)",
            }}
          >
            <Image
              src="/images/bulle2.svg"
              alt="Message"
              fill
              className="object-contain"
            />
          </div>

          {/* Bubble 3 - Center right */}
          <div
            ref={bubble3Ref}
            className="absolute"
            style={{
              width: "clamp(110px, 18vw, 180px)",
              height: "clamp(66px, 11vw, 110px)",
              right: "clamp(15%, 20vw, 120px)",
              top: "clamp(35%, 45%, 55%)",
            }}
          >
            <Image
              src="/images/bulle3.svg"
              alt="Message"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Typewriter Animation Component with GSAP
const TypewriterAnimation = () => {
  const { gsap, contextReady } = useGSAP();
  const [text, setText] = useState("");
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [snippetOrder, setSnippetOrder] = useState([]);
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  const cursorRef = useRef(null);
  const typingTimelineRef = useRef(null);

  const codeSnippets = [
    `// Support monitoring
function support24_7() {
  const status = checkStatus();
  if (status !== 'operational') {
    notifyTeam();
    return initiateRecovery();
  }
  return "Systems operational";
}`,
    `// Web application
class WebSolution {
  constructor(clientReqs) {
    this.requirements = clientReqs;
    this.tech = this.selectTech();
  }
  
  selectTech() {
    return ['React', 'Node'];
  }
}`,
    `async function deploy() {
  try {
    await runTests();
    const build = await buildProject();
    return { 
      url: 'app.example.com',
      status: 'success' 
    };
  } catch (error) {
    logError(error);
  }
}`,
    `<!-- Responsive HTML -->
<section class="hero">
  <div class="container">
    <h1>Welcome</h1>
    <p>Modern web solutions</p>
    <button class="cta">Get Started</button>
  </div>
</section>`,
    `/* Tailwind CSS */
.card {
  @apply rounded-lg shadow-lg;
  @apply bg-white dark:bg-gray-800;
  @apply p-6 m-4;
  @apply transition-all duration-300;
}
.card:hover {
  @apply transform -translate-y-2;
}`,
    `const ServiceCard = ({ title,desc }) => {
  const [expanded, setExpanded] = 
    useState(false);
  return (
    <div className="service-card" 
      onClick={() => setExpanded(!expanded)}>
      <h3>{title}</h3>
      {expanded && <p>{desc}</p>}
    </div>
  );
}`,
  ];
  const fullText = codeSnippets[snippetIndex];

  // Process text for syntax highlighting with improved colors
  const processedText = () => {
    if (!text) return null;

    const keywords = [
      "function",
      "const",
      "let",
      "var",
      "if",
      "return",
      "await",
      "async",
      "try",
      "catch",
      "class",
      "constructor",
      "this",
      "import",
      "from",
      "export",
      "default",
      "new",
      "extends",
    ];

    const reactKeywords = [
      "useState",
      "useEffect",
      "useCallback",
      "useRef",
      "useMemo",
      "useContext",
    ];

    const types = [
      "string",
      "number",
      "boolean",
      "object",
      "array",
      "null",
      "undefined",
    ];

    const comment = /\/\/.*$/gm;
    const htmlComment = /<!--[\s\S]*?-->/gm;
    const cssComment = /\/\*[\s\S]*?\*\//gm;

    const cssProperties = [
      "@apply",
      "rounded",
      "shadow",
      "bg-white",
      "dark:",
      "p-",
      "m-",
      "transition-",
      "duration-",
      "transform",
      "shadow-xl",
      "translate-y-",
    ];

    const htmlTags = [
      "section",
      "div",
      "container",
      "h1",
      "p",
      "button",
      "img",
      "h3",
      "cta",
      "span",
      "header",
      "footer",
      "nav",
      "main",
    ];

    const htmlAttributes = [
      "class",
      "id",
      "src",
      "alt",
      "href",
      "type",
      "value",
      "onClick",
      "onChange",
      "style",
      "placeholder",
      "title",
      "aria-",
      "data-",
    ];

    const reactAttributes = [
      "className",
      "onClick",
      "onChange",
      "onSubmit",
      "onFocus",
      "onBlur",
      "onMouseEnter",
      "onMouseLeave",
    ];

    const builtInFunctions = [
      "checkStatus",
      "notifyTeam",
      "initiateRecovery",
      "selectTech",
      "runTests",
      "buildProject",
      "logError",
      "setExpanded",
      "useState",
      "setInterval",
      "clearInterval",
    ];

    const lines = text.split("\n");
    const lastLineIndex = lines.length - 1;

    const isHTML =
      text.includes("</") ||
      text.includes("/>") ||
      text.includes("<div") ||
      text.includes("<!--");
    const isCSS =
      text.includes("@apply") ||
      text.includes(".card {") ||
      (text.includes("{") && text.includes(";}")) ||
      text.includes("/*");
    const isReact =
      text.includes("useState") ||
      text.includes("className=") ||
      text.includes("props") ||
      text.includes("=>") ||
      text.includes("&&");

    return lines.map((line, lineIndex) => {
      const commentMatch =
        line.match(comment) ||
        (isHTML && line.match(htmlComment)) ||
        (isCSS && line.match(cssComment));
      const isLastLine = lineIndex === lastLineIndex;

      if (commentMatch) {
        const commentIndex = line.indexOf("//");
        const htmlCommentIndex = line.indexOf("<!--");
        const cssCommentIndex = line.indexOf("/*");

        let actualIndex = -1;
        if (commentIndex !== -1) actualIndex = commentIndex;
        if (
          htmlCommentIndex !== -1 &&
          (htmlCommentIndex < actualIndex || actualIndex === -1)
        )
          actualIndex = htmlCommentIndex;
        if (
          cssCommentIndex !== -1 &&
          (cssCommentIndex < actualIndex || actualIndex === -1)
        )
          actualIndex = cssCommentIndex;

        const beforeComment = line.substring(0, actualIndex);
        const commentText = line.substring(actualIndex);

        return (
          <div key={`line-${lineIndex}`} className="whitespace-pre">
            {processLine(beforeComment)}
            <span className={isCSS ? "text-gray-500" : "text-gray-400"}>
              {commentText}
              {isLastLine && (
                <span
                  ref={isLastLine ? cursorRef : null}
                  className="inline-block w-2 h-4 md:h-5 bg-white ml-0.5 align-middle"
                ></span>
              )}
            </span>
          </div>
        );
      }

      return (
        <div key={`line-${lineIndex}`} className="whitespace-pre">
          {processLine(line)}
          {isLastLine && (
            <span
              ref={cursorRef}
              className="inline-block w-2 h-4 md:h-5 bg-white ml-0.5 align-middle"
            ></span>
          )}
        </div>
      );
    });

    function processLine(line) {
      let result = [];
      let currentWord = "";
      let inString = false;
      let stringDelimiter = "";
      let inTag = false;
      let inAttribute = false;
      let inAttributeValue = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        // Handle HTML/JSX tags
        if (isHTML || isReact) {
          if (char === "<" && !inString) {
            if (currentWord) {
              result.push(getColoredSpan(currentWord, i));
              currentWord = "";
            }
            inTag = true;
            currentWord += char;
            continue;
          } else if (char === ">" && inTag && !inString) {
            currentWord += char;
            result.push(
              <span key={`tag-${i}`} className="text-blue-400">
                {currentWord}
              </span>
            );
            currentWord = "";
            inTag = false;
            inAttribute = false;
            inAttributeValue = false;
            continue;
          } else if (
            inTag &&
            /\s/.test(char) &&
            !inString &&
            !inAttributeValue
          ) {
            if (currentWord) {
              result.push(
                <span key={`tagname-${i}`} className="text-cyan-400">
                  {currentWord}
                </span>
              );
              currentWord = "";
            }
            result.push(<span key={`space-${i}`}> </span>);
            inAttribute = true;
            continue;
          } else if (inTag && inAttribute && char === "=" && !inString) {
            if (currentWord) {
              result.push(
                <span key={`attr-${i}`} className="text-yellow-300">
                  {currentWord}
                </span>
              );
              currentWord = "";
            }
            result.push(
              <span key={`equals-${i}`} className="text-white">
                =
              </span>
            );
            inAttributeValue = true;
            continue;
          } else if (inTag) {
            currentWord += char;
            continue;
          }
        }

        // Handle string literals
        if (
          (char === '"' || char === "'") &&
          (i === 0 || line[i - 1] !== "\\")
        ) {
          if (!inString) {
            if (currentWord) {
              result.push(getColoredSpan(currentWord, i));
              currentWord = "";
            }
            inString = true;
            stringDelimiter = char;
            currentWord += char;
          } else if (char === stringDelimiter) {
            currentWord += char;
            // Use different colors for strings based on the language
            const stringColor = isHTML
              ? "text-green-400"
              : isReact
              ? "text-green-300"
              : isCSS
              ? "text-yellow-200"
              : "text-amber-300";

            result.push(
              <span key={`string-${i}`} className={stringColor}>
                {currentWord}
              </span>
            );
            currentWord = "";
            inString = false;
            inAttributeValue = false;
          } else {
            currentWord += char;
          }
        } else if (inString) {
          currentWord += char;
        }
        // Handle special characters and separators
        else if (/[\s\(\)\{\};:,\[\].]/.test(char)) {
          if (currentWord) {
            result.push(getColoredSpan(currentWord, i));
            currentWord = "";
          }

          // Style different characters based on the language context
          if (
            char === "{" ||
            char === "}" ||
            char === "(" ||
            char === ")" ||
            char === "[" ||
            char === "]"
          ) {
            // Use different bracket colors for different languages
            let bracketColor = "text-gray-300"; // default

            if (isCSS) bracketColor = "text-pink-300";
            else if (isReact && (char === "{" || char === "}"))
              bracketColor = "text-orange-300";

            result.push(
              <span key={`bracket-${i}`} className={bracketColor}>
                {char}
              </span>
            );
          } else if (char === ":" && isCSS) {
            result.push(
              <span key={`colon-${i}`} className="text-pink-300">
                {char}
              </span>
            );
          } else if (char === ";" && isCSS) {
            result.push(
              <span key={`semicolon-${i}`} className="text-pink-300">
                {char}
              </span>
            );
          } else if (char === ".") {
            result.push(
              <span key={`dot-${i}`} className="text-white">
                {char}
              </span>
            );
          } else {
            result.push(
              <span key={`punct-${i}`} className="text-white">
                {char}
              </span>
            );
          }
        } else {
          currentWord += char;
        }
      }

      if (currentWord) {
        result.push(getColoredSpan(currentWord, line.length));
      }

      return result;
    }

    function getColoredSpan(word, position) {
      // HTML tags
      if (
        (isHTML || isReact) &&
        word.startsWith("<") &&
        !word.includes(">") &&
        !word.includes(" ")
      ) {
        return (
          <span key={`jsx-tag-${position}`} className="text-blue-400">
            {word}
          </span>
        );
      }

      // HTML tag name after <
      if (
        (isHTML || isReact) &&
        htmlTags.some((tag) => word === tag || word === tag + ">")
      ) {
        return (
          <span key={`html-${position}`} className="text-cyan-400">
            {word}
          </span>
        );
      }

      // HTML closing tags
      if (
        (isHTML || isReact) &&
        word.startsWith("</") &&
        htmlTags.some((tag) => word === `</${tag}>`)
      ) {
        return (
          <span key={`html-closing-${position}`} className="text-blue-400">
            {word}
          </span>
        );
      }

      // HTML/React attributes
      if (
        (isHTML || isReact) &&
        (htmlAttributes.some((attr) => word === attr) ||
          reactAttributes.some((attr) => word === attr))
      ) {
        return (
          <span key={`attr-${position}`} className="text-yellow-300">
            {word}
          </span>
        );
      }

      // CSS properties
      if (isCSS && cssProperties.some((prop) => word.includes(prop))) {
        return (
          <span key={`css-prop-${position}`} className="text-cyan-300">
            {word}
          </span>
        );
      }

      // CSS selectors
      if (isCSS && word.startsWith(".")) {
        return (
          <span key={`css-selector-${position}`} className="text-yellow-300">
            {word}
          </span>
        );
      }

      // React/JS keywords
      if (reactKeywords.includes(word)) {
        return (
          <span key={`react-kw-${position}`} className="text-purple-500">
            {word}
          </span>
        );
      }

      // General keywords
      if (keywords.includes(word)) {
        return (
          <span key={`kw-${position}`} className="text-purple-400">
            {word}
          </span>
        );
      } else if (types.includes(word)) {
        return (
          <span key={`type-${position}`} className="text-blue-300">
            {word}
          </span>
        );
      } else if (builtInFunctions.includes(word)) {
        return (
          <span key={`func-${position}`} className="text-yellow-200">
            {word}
          </span>
        );
      } else if (
        word.startsWith("const ") ||
        word.startsWith("let ") ||
        word.startsWith("var ") ||
        word.startsWith("function ")
      ) {
        const parts = word.split(" ");
        return (
          <span key={`var-decl-${position}`}>
            <span className="text-purple-400">{parts[0]} </span>
            <span className="text-cyan-400">{parts.slice(1).join(" ")}</span>
          </span>
        );
      } else if (
        word === "true" ||
        word === "false" ||
        /^-?\d+(\.\d+)?$/.test(word)
      ) {
        return (
          <span key={`literal-${position}`} className="text-orange-400">
            {word}
          </span>
        );
      } else if (word.startsWith(".")) {
        return (
          <span key={`property-${position}`} className="text-cyan-300">
            {word}
          </span>
        );
      } else if (isReact && /^[A-Z][a-zA-Z0-9]*$/.test(word)) {
        return (
          <span key={`component-${position}`} className="text-yellow-400">
            {word}
          </span>
        );
      } else if (word === "=>" || word.includes("=>")) {
        if (word === "=>") {
          return (
            <span key={`arrow-${position}`} className="text-purple-400">
              {word}
            </span>
          );
        } else {
          const parts = word.split("=>");
          return (
            <span key={`arrow-fn-${position}`}>
              <span className="text-green-300">{parts[0]}</span>
              <span className="text-purple-400">&rArr;</span>
              <span className="text-green-300">
                {parts.slice(1).join("=>")}
              </span>
            </span>
          );
        }
      } else {
        if (isCSS)
          return (
            <span key={`css-word-${position}`} className="text-pink-200">
              {word}
            </span>
          );
        else if (isHTML)
          return (
            <span key={`html-word-${position}`} className="text-white">
              {word}
            </span>
          );
        else
          return (
            <span key={`word-${position}`} className="text-green-300">
              {word}
            </span>
          );
      }
    }
  };

  // Generate a randomized order on component mount
  useEffect(() => {
    // Create an array of indices and shuffle it
    const indices = Array.from({ length: codeSnippets.length }, (_, i) => i);
    const shuffled = [...indices];

    // Fisher-Yates shuffle algorithm
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setSnippetOrder(shuffled);
    setSnippetIndex(shuffled[0]); // Set initial snippet from the shuffled order
  }, [codeSnippets.length]);

  // GSAP cursor blinking animation
  useEffect(() => {
    if (!gsap || !contextReady || !cursorRef.current) return;

    const cursor = cursorRef.current;

    if (isTypingComplete) {
      gsap.to(cursor, {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      });
    } else {
      gsap.set(cursor, { opacity: 0.7 });
    }

    return () => {
      gsap.killTweensOf(cursor);
    };
  }, [gsap, contextReady, isTypingComplete]);

  // GSAP typing effect
  useEffect(() => {
    if (!gsap || !contextReady || !fullText || snippetOrder.length === 0)
      return;

    if (typingTimelineRef.current) {
      typingTimelineRef.current.kill();
    }

    let currentIndex = 0;
    setIsTypingComplete(false);
    setText("");

    const shouldSkipWhitespace = (index) => {
      if (fullText[index] && /\s/.test(fullText[index])) {
        const isPrevNewline = index === 0 || fullText[index - 1] === "\n";
        return isPrevNewline;
      }
      return false;
    };

    const tl = gsap.timeline({
      onComplete: () => {
        setIsTypingComplete(true);

        gsap.delayedCall(3, () => {
          setText("");
          setIsTypingComplete(false);

          const nextOrderIndex = (currentOrderIndex + 1) % snippetOrder.length;
          setCurrentOrderIndex(nextOrderIndex);
          setSnippetIndex(snippetOrder[nextOrderIndex]);
        });
      },
    });

    // Create typing animation
    const typeChar = () => {
      if (currentIndex < fullText.length) {
        while (
          shouldSkipWhitespace(currentIndex) &&
          currentIndex < fullText.length
        ) {
          currentIndex++;
        }

        if (currentIndex < fullText.length) {
          setText(fullText.slice(0, currentIndex + 1));
          currentIndex++;

          // Variable speed based on character type
          let delay = 0.02;
          if (fullText[currentIndex - 1] === "\n") delay = 0.1;
          else if (/[.!?]/.test(fullText[currentIndex - 1])) delay = 0.05;
          else if (/[,;]/.test(fullText[currentIndex - 1])) delay = 0.03;

          tl.call(typeChar, null, `+=${delay}`);
        }
      }
    };

    tl.call(typeChar);
    typingTimelineRef.current = tl;

    return () => {
      if (typingTimelineRef.current) {
        typingTimelineRef.current.kill();
      }
    };
  }, [gsap, contextReady, fullText, snippetOrder, currentOrderIndex]);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-transparent rounded-xl overflow-hidden">
      <div className="bg-transparent p-4 rounded-lg shadow-lg w-full max-w-lg h-full flex items-center justify-center">
        <div className="w-full h-full overflow-hidden flex items-center justify-center">
          <pre className="text-xs sm:text-sm md:text-base lg:text-lg p-2 sm:p-4 font-mono bg-transparent max-h-full w-full">
            <div className="h-full overflow-hidden flex flex-col justify-center">
              <code className="block max-w-full h-[400px] text-[12px] xs:text-xs sm:text-sm md:text-base">
                {processedText()}
              </code>
            </div>
          </pre>
        </div>
      </div>
    </div>
  );
};

// Grid Elements Animation Component with GSAP
const GridElementsAnimation = () => {
  const { gsap, contextReady } = useGSAP();
  const [positions, setPositions] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const gridRefs = useRef([]);
  const pseudoRefs = useRef([]);
  const colorTimelineRef = useRef(null);
  const positionTimelineRef = useRef(null);
  const rotationTimelineRef = useRef(null);

  const elements = [
    { id: 1, rounded: "rounded-tl-[69px] rounded-br-[69px]", hasLetter: false },
    { id: 2, rounded: "rounded-lg", hasLetter: false },
    { id: 3, rounded: "rounded-tr-full", hasLetter: false },
    { id: 4, rounded: "rounded-full", hasLetter: false },
    { id: 5, rounded: "", hasLetter: true },
    { id: 6, rounded: "rounded-3xl", hasLetter: false },
    { id: 7, rounded: "rounded-bl-full", hasLetter: false },
    { id: 8, rounded: "rounded-xl", hasLetter: false },
    { id: 9, rounded: "rounded-br-full", hasLetter: false },
  ];

  const availableGradients = [
    { from: "rgb(96, 165, 250)", to: "rgb(168, 85, 247)" },
    { from: "rgb(74, 222, 128)", to: "rgb(96, 165, 250)" },
    { from: "rgb(250, 204, 21)", to: "rgb(249, 115, 22)" },
    { from: "rgb(248, 113, 113)", to: "rgb(236, 72, 153)" },
    { from: "rgb(168, 85, 247)", to: "rgb(99, 102, 241)" },
    { from: "rgb(99, 102, 241)", to: "rgb(96, 165, 250)" },
    { from: "rgb(236, 72, 153)", to: "rgb(248, 113, 113)" },
    { from: "rgb(96, 165, 250)", to: "rgb(45, 212, 191)" },
    { from: "rgb(45, 212, 191)", to: "rgb(74, 222, 128)" },
    { from: "rgb(249, 115, 22)", to: "rgb(250, 204, 21)" },
    { from: "rgb(34, 211, 238)", to: "rgb(96, 165, 250)" },
  ];

  const calculatePosition = (index) => {
    const pos = positions[index];
    const col = pos % 3;
    const row = Math.floor(pos / 3);
    return {
      col,
      row,
      left: `${col * 33.333 + 1.2}%`,
      top: `${row * 33.333 + 1.2}%`,
    };
  };

  // Initialize GSAP animations and set initial positions
  useEffect(() => {
    if (!gsap || !contextReady) return;

    // Kill existing timelines
    if (colorTimelineRef.current) colorTimelineRef.current.kill();
    if (positionTimelineRef.current) positionTimelineRef.current.kill();
    if (rotationTimelineRef.current) rotationTimelineRef.current.kill();

    // Set initial positions for all elements
    gridRefs.current.forEach((el, index) => {
      if (el) {
        const { left, top } = calculatePosition(index);
        gsap.set(el, {
          left,
          top,
          rotation: 0,
        });
      }
    });

    // Set initial pseudo element opacity for shapes only
    pseudoRefs.current.forEach((el, index) => {
      if (el && !elements[index].hasLetter) {
        gsap.set(el, { opacity: 0 });
      }
    });

    // Color change animation timeline
    const createColorTimeline = () => {
      const tl = gsap.timeline({ repeat: -1 });

      tl.add(() => {
        const randomIndex = Math.floor(Math.random() * 9);
        const randomGradient =
          availableGradients[
            Math.floor(Math.random() * availableGradients.length)
          ];

        if (gridRefs.current[randomIndex]) {
          const mainEl = gridRefs.current[randomIndex];

          // Handle letter A differently (text gradient) vs shapes (background gradient)
          if (elements[randomIndex].hasLetter) {
            // For letter A, animate the text gradient directly on both spans
            const mainSpan = mainEl.querySelector(".main-letter");
            const pseudoSpan = mainEl.querySelector(".pseudo-letter");

            if (mainSpan && pseudoSpan) {
              // Set new gradient on pseudo span and animate it in
              gsap.set(pseudoSpan, {
                backgroundImage: `linear-gradient(135deg, ${randomGradient.from}, ${randomGradient.to})`,
                webkitBackgroundClip: "text",
                backgroundClip: "text",
                webkitTextFillColor: "transparent",
                color: "transparent",
              });

              gsap
                .timeline()
                .to(pseudoSpan, {
                  opacity: 1,
                  duration: 1,
                  ease: "power2.inOut",
                })
                .call(() => {
                  // Update main span gradient while preserving background-clip
                  gsap.set(mainSpan, {
                    backgroundImage: `linear-gradient(135deg, ${randomGradient.from}, ${randomGradient.to})`,
                    webkitBackgroundClip: "text",
                    backgroundClip: "text",
                    webkitTextFillColor: "transparent",
                    color: "transparent",
                  });
                })
                .to(pseudoSpan, {
                  opacity: 0,
                  duration: 0.5,
                  ease: "power2.inOut",
                });
            }
          } else {
            // For shapes, use pseudo element for smooth background transition
            const pseudoEl = pseudoRefs.current[randomIndex];

            if (pseudoEl) {
              gsap.set(pseudoEl, {
                background: `linear-gradient(135deg, ${randomGradient.from}, ${randomGradient.to})`,
              });

              gsap
                .timeline()
                .to(pseudoEl, {
                  opacity: 1,
                  duration: 1,
                  ease: "power2.inOut",
                })
                .call(() => {
                  gsap.set(mainEl, {
                    background: `linear-gradient(135deg, ${randomGradient.from}, ${randomGradient.to})`,
                  });
                })
                .to(pseudoEl, {
                  opacity: 0,
                  duration: 0.5,
                  ease: "power2.inOut",
                });
            }
          }
        }
      }, 0).to({}, { duration: 2 });

      return tl;
    };

    // Position swap animation timeline
    const createPositionTimeline = () => {
      const tl = gsap.timeline({ repeat: -1 });

      tl.add(() => {
        const idx1 = Math.floor(Math.random() * 9);
        let idx2 = Math.floor(Math.random() * 9);
        while (idx2 === idx1) {
          idx2 = Math.floor(Math.random() * 9);
        }

        // Update positions state for React tracking
        setPositions((prev) => {
          const newPositions = [...prev];
          const temp = newPositions[idx1];
          newPositions[idx1] = newPositions[idx2];
          newPositions[idx2] = temp;
          return newPositions;
        });

        // Animate the actual position swap with GSAP
        if (gridRefs.current[idx1] && gridRefs.current[idx2]) {
          const pos1 = calculatePosition(idx1);
          const pos2 = calculatePosition(idx2);

          gsap.to(gridRefs.current[idx1], {
            left: pos2.left,
            top: pos2.top,
            duration: 1.5,
            ease: "power2.inOut",
          });

          gsap.to(gridRefs.current[idx2], {
            left: pos1.left,
            top: pos1.top,
            duration: 1.5,
            ease: "power2.inOut",
          });
        }
      }, 0).to({}, { duration: 3 });

      return tl;
    };

    // Rotation animation timeline
    const createRotationTimeline = () => {
      const tl = gsap.timeline({ repeat: -1 });

      tl.add(() => {
        const elementIndex = Math.floor(Math.random() * 9);

        // Skip rotation for the letter 'A'
        if (elements[elementIndex].hasLetter) return;

        if (gridRefs.current[elementIndex]) {
          const rotationOptions = [90, 180, 360];
          const rotationAmount =
            rotationOptions[Math.floor(Math.random() * rotationOptions.length)];

          gsap.to(gridRefs.current[elementIndex], {
            rotation: `+=${rotationAmount}`,
            duration: 1.5,
            ease: "power2.inOut",
          });
        }
      }, 0).to({}, { duration: 4 });

      return tl;
    };

    // Create and start all timelines with different delays
    colorTimelineRef.current = createColorTimeline();
    positionTimelineRef.current = createPositionTimeline();
    rotationTimelineRef.current = createRotationTimeline();

    // Stagger the start times
    colorTimelineRef.current.delay(0);
    positionTimelineRef.current.delay(1);
    rotationTimelineRef.current.delay(2);

    return () => {
      if (colorTimelineRef.current) colorTimelineRef.current.kill();
      if (positionTimelineRef.current) positionTimelineRef.current.kill();
      if (rotationTimelineRef.current) rotationTimelineRef.current.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gsap, contextReady]);

  // Update positions when state changes (for any non-GSAP initiated changes)
  useEffect(() => {
    if (!gsap || !contextReady) return;

    gridRefs.current.forEach((el, index) => {
      if (el) {
        const { left, top } = calculatePosition(index);
        // Only animate if position is significantly different (avoid redundant animations)
        const currentLeft = gsap.getProperty(el, "left");
        const currentTop = gsap.getProperty(el, "top");

        if (currentLeft !== left || currentTop !== top) {
          gsap.to(el, {
            left,
            top,
            duration: 1.5,
            ease: "power2.inOut",
          });
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gsap, contextReady, positions]);

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 overflow-visible">
      <div className="relative w-full max-w-[400px] aspect-square">
        {elements.map((element, index) => {
          const initialPos = calculatePosition(index);
          const initialGradient =
            availableGradients[index % availableGradients.length];

          if (element.hasLetter) {
            return (
              <div
                key={element.id}
                ref={(el) => (gridRefs.current[index] = el)}
                className="absolute flex items-center justify-center"
                style={{
                  width: "calc(33.333% - 8px)",
                  height: "calc(33.333% - 8px)",
                  left: initialPos.left,
                  top: initialPos.top,
                  position: "absolute",
                }}
              >
                <span
                  className="main-letter text-7xl md:text-9xl font-bold relative"
                  style={{
                    background: `linear-gradient(135deg, ${initialGradient.from}, ${initialGradient.to})`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    color: "transparent",
                    zIndex: 1,
                  }}
                >
                  A
                  <span
                    className="pseudo-letter absolute inset-0 text-7xl md:text-9xl font-bold"
                    style={{
                      background: `linear-gradient(135deg, ${initialGradient.from}, ${initialGradient.to})`,
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      color: "transparent",
                      opacity: 0,
                      zIndex: 2,
                    }}
                  >
                    A
                  </span>
                </span>
              </div>
            );
          }

          return (
            <div
              key={element.id}
              ref={(el) => (gridRefs.current[index] = el)}
              className={`absolute ${element.rounded} flex items-center justify-center overflow-hidden`}
              style={{
                width: "calc(33.333% - 8px)",
                height: "calc(33.333% - 8px)",
                left: initialPos.left,
                top: initialPos.top,
                position: "absolute",
                background: `linear-gradient(135deg, ${initialGradient.from}, ${initialGradient.to})`,
                zIndex: 1,
              }}
            >
              <div
                ref={(el) => (pseudoRefs.current[index] = el)}
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${initialGradient.from}, ${initialGradient.to})`,
                  opacity: 0,
                  zIndex: 0,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function Services() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const lastIndex = useRef(null);

  const handleMouseEnter = useCallback(
    (index) => {
      if (!isAnimating || lastIndex.current !== index) {
        setIsAnimating(true);
        setActiveIndex(index);
        lastIndex.current = index;
        setTimeout(() => {
          setIsAnimating(false);
        }, 750);
      }
    },
    [isAnimating]
  );

  const handleClick = useCallback(
    (index) => {
      if (activeIndex === index) {
        setActiveIndex(null);
      } else {
        setActiveIndex(index);
      }
    },
    [activeIndex]
  );

  const handleMouseLeave = useCallback(() => {
    lastIndex.current = null;
    setActiveIndex(null);
  }, []);

  // Helper function to render the appropriate animation
  const renderAnimation = (type) => {
    switch (type) {
      case "svg-bubbles":
        return <SvgBubblesAnimation />;
      case "typewriter":
        return <TypewriterAnimation />;
      case "grid-elements":
        return <GridElementsAnimation />;
      default:
        return null;
    }
  };

  return (
    <>
      <main className="pt-24 pb-16 bg-[#050610] min-h-screen px-3 sm:px-4 md:px-8 lg:px-12 xl:px-48">
        <div className="container mx-auto">
          {/* Header Section */}
          <ScrollReveal animation="fade-down">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-8 sm:mt-12 md:mt-16 mb-4 sm:mb-6 text-center text-[#7DD4FF]">
              Nos Services
            </h1>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={200}>
            <p className="text-white text-center max-w-2xl mx-auto mb-8 sm:mb-12 md:mb-16 text-sm sm:text-base md:text-lg px-3 sm:px-4">
              Découvrez notre gamme complète de services numériques conçus pour
              propulser votre entreprise vers le succès.
            </p>
          </ScrollReveal>

          {/* Tablet Interactive Circles (Vertical Layout) */}
          <ScrollReveal animation="fade-up" delay={400}>
            <div className="flex md:hidden flex-col items-center mb-16 px-4 relative min-h-[900px]">
              {services.map((service, index) => (
                <div
                  className="absolute transition-all duration-500 ease-in-out w-full flex justify-center"
                  style={{
                    top:
                      activeIndex === index
                        ? `${index * 140}px`
                        : `${index * 300}px`,
                    zIndex: activeIndex === index ? 10 : 1,
                  }}
                  key={index}
                >
                  <div
                    className="w-full max-w-[280px]"
                    onClick={() => handleClick(index)}
                  >
                    <div
                      className={`rounded-full transition-all duration-500 ease-in-out overflow-hidden relative mx-auto
                      ${
                        activeIndex === index
                          ? "h-[600px] w-full max-w-[600px]"
                          : "h-[280px] w-[280px]"
                      }`}
                      style={{
                        backgroundColor: service.bgColor,
                      }}
                    >
                      <div
                        className={`flex ${
                          activeIndex === index ? "flex-col" : "flex-col"
                        } items-center p-4`}
                      >
                        <div
                          className={`relative ${
                            activeIndex === index ? "h-40 w-40" : "h-32 w-32"
                          } mt-4 mb-2`}
                        >
                          <Image
                            src={service.icon}
                            alt={service.title}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                        <h3 className="text-xl text-white font-bold text-center mb-2">
                          {service.title}
                        </h3>
                        <div
                          className={`transition-all duration-300 text-white text-center px-4 mt-2
                          ${
                            activeIndex === index
                              ? "opacity-100 delay-200"
                              : "opacity-0"
                          }`}
                        >
                          <p className="whitespace-normal text-base">
                            {service.description}
                          </p>
                          <p className="mt-3 text-base">
                            Notre équipe d&apos;experts est prête à vous
                            accompagner dans vos projets numériques avec des
                            solutions innovantes et personnalisées.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Desktop Interactive Circles */}
          <ScrollReveal animation="zoom-in">
            <div className="hidden md:flex justify-center mb-16 lg:mb-24 relative h-72 w-full mx-auto">
              <div className="w-[1000px] relative">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="absolute top-0 transition-all duration-700 ease-in-out"
                    style={{
                      left:
                        activeIndex === index
                          ? index === 2
                            ? window.innerWidth >= 1024
                              ? "calc(102.5% - 1012px)"
                              : "calc(102.5% - 930px)"
                            : "2.5%"
                          : `${index * 33 + 2.5}%`,
                      zIndex: activeIndex === index ? 10 : 1,
                      width: "288px",
                    }}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div
                      className={`h-72 rounded-full flex items-center justify-center transition-all duration-700 ease-in-out relative overflow-hidden ${
                        activeIndex === index
                          ? "lg:w-[960px] w-[890px]"
                          : "w-72"
                      }`}
                      style={{
                        backgroundColor: service.bgColor,
                        transformOrigin: index === 2 ? "right" : "left",
                      }}
                    >
                      <div
                        className={`absolute transition-all duration-700 ease-in-out flex items-center gap-6 md:gap-8 lg:gap-12 ${
                          index === 2 ? "right-3 flex-row-reverse" : "left-3"
                        }`}
                      >
                        <span className="text-5xl md:text-6xl text-white shrink-0 w-56 md:w-64 h-56 md:h-64 relative">
                          <Image
                            src={service.icon}
                            alt={service.title}
                            fill
                            className="object-contain p-4"
                          />
                        </span>
                        <div
                          className={`transition-all duration-300 text-white ${
                            activeIndex === index
                              ? "opacity-100 delay-200"
                              : "opacity-0 delay-0"
                          }`}
                        >
                          <h3 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">
                            {service.title}
                          </h3>
                          <p className="whitespace-normal min-w-[450px] max-w-[500px] md:max-w-[600px] text-lg md:text-xl">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Alternating Sections - Responsive */}
          {sections.map((section, index) => (
            <ScrollReveal
              key={index}
              animation={section.isReversed ? "fade-left" : "fade-right"}
              delay={index * 200}
            >
              <div
                className={`flex flex-col ${
                  section.isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
                } items-center gap-6 sm:gap-8 md:gap-12 mb-12 sm:mb-16 md:mb-24`}
              >
                <div className="flex-1 w-full">
                  <div className="relative h-[400px] w-full rounded-xl overflow-visible">
                    {renderAnimation(section.animationType)}
                  </div>
                </div>
                <div className="flex-1 text-white px-2 sm:px-4">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 md:mb-6 text-[#7DD4FF]">
                    {section.title}
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg leading-relaxed">
                    {section.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </main>
    </>
  );
}
