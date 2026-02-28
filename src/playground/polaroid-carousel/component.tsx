"use client";

import { cn } from "@/lib/cn";
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from "motion/react";
import Image, { type StaticImageData } from "next/image";
import { Dialog } from "radix-ui";
import { useEffect, useState } from "react";

import boutiqueImg from "./assets/Charming Boutique Storefront.webp";
import meshGradientImg from "./assets/mesh-gradient.webp";
import clothesPileImg from "./assets/Person Under Clothes Pile.webp";
import telephoneImg from "./assets/Retro Pink Telephone Scene.webp";

const PHOTOS: { src: StaticImageData; alt: string }[] = [
  { src: boutiqueImg, alt: "Charming boutique storefront" },
  { src: telephoneImg, alt: "Retro pink telephone scene" },
  { src: clothesPileImg, alt: "Person under clothes pile" },
];

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

export default function PolaroidStack() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isSmallScreen = useMediaQuery("(max-width: 999px)");

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % 3);
  };

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + 3) % 3);
  };

  const getCardStyles = (position: "left" | "center" | "right") => {
    const baseWidth = "14rem";
    const baseHeight = "16rem";
    const openWidth = "21rem";
    const openHeight = "24rem";

    const closed = {
      scale: 1,
      width: baseWidth,
      height: baseHeight,
      rotate: position === "left" ? "8deg" : position === "right" ? "-8deg" : "0deg",
      left: position === "left" ? "10%" : position === "right" ? "-10%" : 0,
    };
    const open = {
      scale: 1,
      width: openWidth,
      height: openHeight,
      rotate: position === "left" ? "2deg" : position === "right" ? "-2deg" : "0deg",
      left:
        position === "left"
          ? isSmallScreen
            ? "60%"
            : "90%"
          : position === "right"
            ? isSmallScreen
              ? "-60%"
              : "-90%"
            : 0,
    };

    return {
      className:
        position === "center"
          ? "relative bg-white shadow-lg p-3 pb-12 z-[1]"
          : "absolute cursor-pointer top-0 left-0 bg-white shadow-lg p-3 pb-12",
      initial:
        position === "center"
          ? {
              scale: 0.8,
              width: baseWidth,
              height: baseHeight,
              rotate: "0deg",
              left: 0,
            }
          : {
              scale: 0.5,
              width: baseWidth,
              height: baseHeight,
              rotate: "0deg",
              left: 0,
            },
      animate: isOpen ? open : closed,
      exit: closed,
    };
  };

  const getCardPosition = (cardIndex: number): "left" | "center" | "right" => {
    const relativeIndex = (cardIndex - currentIndex + PHOTOS.length) % PHOTOS.length;

    if (relativeIndex === 0) return "center";
    if (relativeIndex === 1) return "right";
    return "left";
  };

  const cards = (
    <>
      {PHOTOS.map((photo, index) => {
        const position = getCardPosition(index);
        const styles = getCardStyles(position);

        const handleCardClick = () => {
          if (!isOpen) {
            setIsOpen(true);
            return;
          }
          if (position !== "center") {
            setCurrentIndex(index);
          }
        };

        return (
          <motion.div
            key={photo.alt}
            layoutId={`polaroid-card-${photo.alt}`}
            className={cn(
              styles.className,
              isOpen ? "cursor-grab active:z-[2] active:cursor-grabbing" : "cursor-pointer",
            )}
            initial={styles.initial}
            animate={styles.animate}
            exit={styles.exit}
            onClick={handleCardClick}
            drag={isOpen}
            dragMomentum={false}
            dragSnapToOrigin={true}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
            onDragEnd={(_, info) => {
              const { offset } = info;
              const threshold = 50;
              const pos = getCardPosition(index);

              if (pos === "center") {
                if (offset.x > threshold) {
                  nextPhoto();
                } else if (offset.x < -threshold) {
                  prevPhoto();
                }
              } else if (pos === "left") {
                if (offset.x > threshold) {
                  setCurrentIndex(index);
                }
              } else if (pos === "right") {
                if (offset.x < -threshold) {
                  setCurrentIndex(index);
                }
              }
            }}
            whileDrag={{ scale: 1.05 }}
          >
            <div className="relative h-full w-full">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 999px) 14rem, 21rem"
                className="object-cover select-none"
                draggable={false}
              />
            </div>
          </motion.div>
        );
      })}
    </>
  );

  return (
    <MotionConfig transition={{ type: "spring", duration: 0.6, bounce: 0.2 }}>
      <LayoutGroup>
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl">
            <Image
              src={meshGradientImg}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <motion.div layoutId="polaroid-stack" className={cn("relative", isOpen && "invisible")}>
              {cards}
            </motion.div>
          </div>
          <AnimatePresence mode="popLayout">
            {isOpen && (
              <Dialog.Portal forceMount>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                  onClick={() => setIsOpen(false)}
                />
                <Dialog.Content
                  aria-describedby={undefined}
                  className="fixed top-1/2 left-1/2 z-50 flex max-w-none -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-transparent p-0 shadow-none ring-0 outline-none focus:ring-0 focus:outline-none"
                  onPointerDownOutside={() => setIsOpen(false)}
                  onEscapeKeyDown={() => setIsOpen(false)}
                >
                  <Dialog.Title className="sr-only">Photo stack viewer</Dialog.Title>
                  <motion.div
                    layoutId="polaroid-stack"
                    className="relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {cards}
                  </motion.div>
                </Dialog.Content>
              </Dialog.Portal>
            )}
          </AnimatePresence>
        </Dialog.Root>
      </LayoutGroup>
    </MotionConfig>
  );
}
