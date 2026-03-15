"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";

export default function PreviewImage({
  src,
  fit = "cover",
  position,
  padding,
}: {
  src: StaticImageData | string;
  fit?: "cover" | "contain";
  position?: string;
  padding?: number;
}) {
  return (
    <Image
      src={src}
      alt=""
      fill
      sizes="(max-width: 744px) 100vw, 680px"
      className={fit === "contain" ? "object-contain" : "object-cover"}
      style={{
        ...(position ? { objectPosition: position } : {}),
        ...(padding ? { padding: `${padding}%` } : {}),
      }}
    />
  );
}
