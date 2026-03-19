"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export type StorySlide =
  | { kind: "image"; src: StaticImageData | string }
  | { kind: "video"; src: string };

const slideKey = (slide: StorySlide) =>
  slide.kind === "video" ? slide.src : typeof slide.src === "string" ? slide.src : slide.src.src;

export default function StoryCarousel({
  slides,
  imageDuration = 3500,
  videoMaxDuration = 10,
}: {
  slides: StorySlide[];
  imageDuration?: number;
  videoMaxDuration?: number;
}) {
  const [index, setIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const progressFillRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const advance = useCallback(() => {
    setIndex((i) => (i + 1) % slides.length);
  }, [slides.length]);

  // Auto-advance images
  useEffect(() => {
    if (slides[index].kind !== "image") return;
    const timer = setTimeout(advance, imageDuration);
    return () => clearTimeout(timer);
  }, [index, advance, imageDuration, slides]);

  // Play video and drive progress via rAF for perfectly smooth indicator
  useEffect(() => {
    if (slides[index].kind !== "video") return;

    // Pause/reset all other videos
    videoRefs.current.forEach((v, i) => {
      if (v && i !== index) {
        v.pause();
        v.currentTime = 0;
      }
    });

    const video = videoRefs.current[index];
    if (!video) return;

    video.currentTime = 0;
    video.play().catch(() => {});

    const tick = () => {
      if (!video.duration || !isFinite(video.duration)) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const effectiveDuration = Math.min(video.duration, videoMaxDuration);
      const progress = Math.min(video.currentTime / effectiveDuration, 1);

      if (progressFillRef.current) {
        progressFillRef.current.style.transform = `scaleX(${progress})`;
      }

      if (video.currentTime >= effectiveDuration) {
        video.pause();
        advance();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [index, advance, videoMaxDuration, slides]);

  return (
    <>
      <style>{`
        @keyframes story-carousel-fill {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
      <div className="relative h-full w-full overflow-hidden bg-black">
        {/* Slides */}
        {slides.map((slide, i) => (
          <div
            key={slideKey(slide)}
            className="absolute inset-0 transition-opacity duration-500"
            style={{ opacity: i === index ? 1 : 0 }}
          >
            {slide.kind === "image" ? (
              <Image
                src={slide.src}
                alt=""
                fill
                sizes="(max-width: 744px) 100vw, 680px"
                className="object-cover"
                priority={i === 0}
              />
            ) : (
              <video
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                src={slide.src}
                className="h-full w-full object-cover"
                muted
                playsInline
                preload="metadata"
              />
            )}
          </div>
        ))}

        {/* Bottom vignette for progress bar readability */}
        <div
          className="pointer-events-none absolute right-0 bottom-0 left-0 h-16"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)",
          }}
        />

        {/* Progress segments */}
        <div className="pointer-events-none absolute right-3 bottom-3 left-3 flex gap-[3px]">
          {slides.map((slide, i) => {
            const isPast = i < index;
            const isCurrent = i === index;
            const isCurrentImage = isCurrent && slide.kind === "image";
            const isCurrentVideo = isCurrent && slide.kind === "video";

            return (
              <div
                key={slideKey(slide)}
                className="h-[2px] flex-1 overflow-hidden rounded-full"
                style={{ background: "rgba(255,255,255,0.28)" }}
              >
                {isPast && <div className="h-full w-full rounded-full bg-white" />}
                {isCurrentImage && (
                  <div
                    className="h-full origin-left rounded-full bg-white"
                    style={{
                      animation: `story-carousel-fill ${imageDuration}ms linear forwards`,
                    }}
                  />
                )}
                {isCurrentVideo && (
                  <div
                    ref={progressFillRef}
                    className="h-full rounded-full bg-white"
                    style={{ transform: "scaleX(0)", transformOrigin: "left" }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
