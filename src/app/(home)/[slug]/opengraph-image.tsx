import { getAllItems } from "@/lib/content";
import { ImageResponse } from "next/og";

export const alt = "Playground article";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateImageMetadata({ params }: { params: { slug: string } }) {
  return [{ id: "og", alt: `${params.slug} — Playground`, contentType: "image/png", size }];
}

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const items = await getAllItems();
  const item = items.find((i) => i.slug === slug);

  const title = item?.title ?? slug;

  const [ralewayRes, frauncesRes] = await Promise.all([
    fetch("https://fonts.googleapis.com/css2?family=Raleway:wght@300&display=swap").then((r) =>
      r.text(),
    ),
    fetch(
      "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300&display=swap",
    ).then((r) => r.text()),
  ]);

  const ralewayUrl = ralewayRes.match(/src:\s*url\(([^)]+)\)/)?.[1];
  const frauncesUrl = frauncesRes.match(/src:\s*url\(([^)]+)\)/)?.[1];

  const [ralewayFont, frauncesFont] = await Promise.all([
    ralewayUrl ? fetch(ralewayUrl).then((r) => r.arrayBuffer()) : Promise.resolve(null),
    frauncesUrl ? fetch(frauncesUrl).then((r) => r.arrayBuffer()) : Promise.resolve(null),
  ]);

  const fonts: { name: string; data: ArrayBuffer; style: "normal"; weight: 300 }[] = [];
  if (ralewayFont) fonts.push({ name: "Raleway", data: ralewayFont, style: "normal", weight: 300 });
  if (frauncesFont)
    fonts.push({ name: "Fraunces", data: frauncesFont, style: "normal", weight: 300 });

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        backgroundColor: "#141312",
        padding: "80px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Accent circle — top right */}
      <div
        style={{
          position: "absolute",
          top: "-80px",
          right: "-80px",
          width: "360px",
          height: "360px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 40% 40%, rgba(162, 191, 210, 0.20), rgba(162, 191, 210, 0.04))",
          display: "flex",
        }}
      />

      {/* Bottom accent bar */}
      <div
        style={{
          position: "absolute",
          bottom: "0",
          left: "0",
          width: "100%",
          height: "4px",
          background: "linear-gradient(to right, #a2bfd2, rgba(162, 191, 210, 0.1))",
          display: "flex",
        }}
      />

      {/* Title */}
      <div
        style={{
          fontFamily: "Fraunces",
          fontSize: "56px",
          fontWeight: 300,
          color: "#e8e7e3",
          lineHeight: 1.2,
          maxWidth: "900px",
          display: "flex",
        }}
      >
        {title}
      </div>

      {/* Footer with site name */}
      <div
        style={{
          position: "absolute",
          bottom: "32px",
          left: "80px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        {/* Tiny accent dot */}
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "#a2bfd2",
            display: "flex",
          }}
        />
        <div
          style={{
            fontFamily: "Raleway",
            fontSize: "16px",
            fontWeight: 300,
            color: "#72716d",
            display: "flex",
          }}
        >
          chayut.me
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts,
    },
  );
}
