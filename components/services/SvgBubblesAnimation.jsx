"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useGSAP } from "../../context/GSAPContext";

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

export default SvgBubblesAnimation;
