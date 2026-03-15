"use client";

export default function PreviewVideo({
  src,
  fit = "cover",
  position,
}: {
  src: string;
  fit?: "cover" | "contain";
  position?: string;
}) {
  return (
    <video
      src={src}
      autoPlay
      loop
      muted
      playsInline
      className={`h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"}`}
      style={position ? { objectPosition: position } : undefined}
    />
  );
}
