"use client";
import { useState, useRef, useEffect } from "react";
import { useGSAP } from "../../context/GSAPContext";

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

export default TypewriterAnimation;
