"use client";

import { cn } from "@/lib/cn";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useRef, useState } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

interface Work {
  title: string;
  description: string;
  image: string;
}

const WORKS: Work[] = [
  {
    title: "Fluid Grid",
    description: "Responsive editorial layout",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Spring Physics",
    description: "Natural motion curves",
    image:
      "https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Color Space",
    description: "Perceptual color theory",
    image:
      "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Type Scale",
    description: "Harmonic typography system",
    image:
      "https://images.unsplash.com/photo-1618172193622-10b5a4b0a4a0?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Motion Design",
    description: "Choreographed transitions",
    image:
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Depth Mapping",
    description: "Layered spatial interfaces",
    image:
      "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=600&auto=format&fit=crop",
  },
];

export default function ParallaxList() {
  const listRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const overlayRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const prevActiveRef = useRef<number | null>(null);

  useGSAP(
    (_, contextSafe) => {
      if (!listRef.current) return;
      const handleMouseMove = contextSafe!((e: Event) => {
        const me = e as MouseEvent;
        const listEl = listRef.current;
        const container = listEl?.parentElement;
        if (!listEl || !container) return;

        const padding = 96;
        const scrollable = listEl.scrollHeight - container.clientHeight + padding;
        if (scrollable > 0) {
          const rect = container.getBoundingClientRect();
          const ratio = (me.clientY - rect.top) / container.clientHeight;
          gsap.to(listEl, {
            y: -scrollable * ratio,
            ease: "power2.out",
            duration: 0.4,
          });
        }

        const img = imageRefs.current[activeIndex];
        if (img) {
          const imgH = img.clientHeight;
          if (imgH > 0) {
            const rect = container.getBoundingClientRect();
            const imgPad = 32;
            const maxY = container.clientHeight - imgH - imgPad * 2;
            if (maxY > 0) {
              const ratio = (me.clientY - rect.top) / container.clientHeight;
              gsap.to(img, {
                y: maxY * ratio,
                ease: "power2.out",
                duration: 0.4,
              });
            }
          }
        }
      });

      const container = listRef.current?.parentElement;
      container?.addEventListener("mousemove", handleMouseMove);
      return () => container?.removeEventListener("mousemove", handleMouseMove);
    },
    { scope: listRef, dependencies: [activeIndex] },
  );

  useGSAP(
    () => {
      const el = imageRefs.current[activeIndex];
      if (el) {
        gsap.fromTo(
          el,
          { opacity: 0, scale: 0.96 },
          { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" },
        );
      }
    },
    { dependencies: [activeIndex] },
  );

  useGSAP(
    () => {
      const prev = prevActiveRef.current;
      const current = activeIndex;
      const dir = prev !== null && current < prev ? "up" : "down";
      const revealClip = dir === "down" ? "inset(0% 0% 100% 0%)" : "inset(100% 0% 0% 0%)";
      const exitClip = dir === "down" ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)";

      if (prev !== null && prev !== current) {
        const prevEl = overlayRefs.current[prev];
        if (prevEl) {
          gsap.killTweensOf(prevEl);
          gsap.to(prevEl, {
            clipPath: exitClip,
            duration: 0.4,
            ease: "power2.out",
            onComplete: () => {
              gsap.set(prevEl, { clipPath: revealClip });
            },
          });
        }
      }

      const currentEl = overlayRefs.current[current];
      if (currentEl) {
        gsap.killTweensOf(currentEl);
        gsap.fromTo(
          currentEl,
          { clipPath: revealClip },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.4,
            ease: "power2.out",
          },
        );
      }

      prevActiveRef.current = current;
    },
    { dependencies: [activeIndex], scope: listRef },
  );

  return (
    <div className="relative flex h-full w-full bg-ink select-none">
      <div className="pointer-events-none absolute top-8 right-8 z-10 w-[30%] max-w-[30%]">
        {WORKS.map((work, i) => (
          <img
            key={work.title}
            ref={(el) => {
              imageRefs.current[i] = el;
            }}
            src={work.image}
            alt={work.title}
            loading="eager"
            decoding="async"
            aria-hidden={activeIndex === i ? undefined : true}
            className={cn(
              "absolute inset-0 h-auto w-full object-cover select-none",
              activeIndex === i ? "visible opacity-100" : "invisible opacity-0",
            )}
          />
        ))}
      </div>

      <div ref={listRef} className="ml-8 flex max-w-[60%] flex-1 flex-col gap-2 py-24">
        {WORKS.map((work, i) => (
          <div
            key={work.title}
            className="relative select-none"
            onMouseEnter={() => setActiveIndex(i)}
          >
            <h3 className="relative inline-block text-3xl leading-none font-medium">
              <span className="text-muted">{work.title}</span>
              <span
                className="pointer-events-none absolute inset-0 block text-ink-inv"
                ref={(el) => {
                  overlayRefs.current[i] = el;
                }}
                style={{ clipPath: "inset(0% 0% 100% 0%)" }}
              >
                {work.title}
              </span>
            </h3>
            <p
              className={cn(
                "absolute font-mono text-xs text-mid transition-opacity duration-400",
                activeIndex === i ? "opacity-100" : "opacity-0",
              )}
            >
              {work.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
