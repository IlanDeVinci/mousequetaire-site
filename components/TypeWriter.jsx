"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";

export default function TypeWriter({ text, className, speed = 50 }) {
  const textRef = useRef(null);
  const cursorRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [currentText, setCurrentText] = useState("");

  // Handle the typing animation with GSAP
  useEffect(() => {
    if (!textRef.current) return;

    const startDelay = 1.0;
    setIsTyping(false);
    setCurrentText("");

    // Use GSAP for smoother performance
    const tl = gsap.timeline();

    // Initial delay
    tl.to(
      {},
      {
        duration: startDelay,
        onComplete: () => {
          setIsTyping(true);
        },
      }
    );

    // Optimized typing animation
    tl.to(
      {},
      {
        duration: text.length * (speed / 1000),
        ease: "none",
        onUpdate: function () {
          const progress = this.progress();
          const charIndex = Math.floor(text.length * progress);
          const newText = text.slice(0, charIndex);

          // Use requestAnimationFrame for better performance
          requestAnimationFrame(() => {
            setCurrentText(newText);
          });
        },
        onComplete: function () {
          setIsTyping(false);
          setCurrentText(text);
        },
      }
    );

    return () => {
      tl.kill();
    };
  }, [text, speed]);

  // Optimized cursor blinking with GSAP
  useEffect(() => {
    if (!cursorRef.current) return;

    gsap.set(cursorRef.current, { opacity: 1 });

    const createBlinkAnimation = () => {
      return gsap
        .timeline({ repeat: -1 })
        .to(cursorRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
        })
        .to(cursorRef.current, {
          opacity: 1,
          duration: 0.5,
          ease: "power2.inOut",
        });
    };

    if (isTyping) {
      gsap.killTweensOf(cursorRef.current);
      gsap.set(cursorRef.current, { opacity: 1 });
    } else {
      createBlinkAnimation();
    }

    return () => {
      gsap.killTweensOf(cursorRef.current);
    };
  }, [isTyping]);

  return (
    <p className={className}>
      <span ref={textRef}>{currentText}</span>
      <span ref={cursorRef} className="cursor-blink">
        |
      </span>
    </p>
  );
}
