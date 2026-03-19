import { ImageResponse } from "next/og";

export const alt = "Chayut's Playground — Interactive design explorations and interface craft";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  const [ralewayRes, frauncesRes] = await Promise.all([
    fetch("https://fonts.googleapis.com/css2?family=Raleway:wght@300&display=swap").then((r) =>
      r.text(),
    ),
    fetch("https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@1,300&display=swap").then(
      (r) => r.text(),
    ),
  ]);

  const ralewayUrl = ralewayRes.match(/src:\s*url\(([^)]+)\)/)?.[1];
  const frauncesUrl = frauncesRes.match(/src:\s*url\(([^)]+)\)/)?.[1];

  const [ralewayFont, frauncesFont] = await Promise.all([
    ralewayUrl ? fetch(ralewayUrl).then((r) => r.arrayBuffer()) : Promise.resolve(null),
    frauncesUrl ? fetch(frauncesUrl).then((r) => r.arrayBuffer()) : Promise.resolve(null),
  ]);

  const fonts: { name: string; data: ArrayBuffer; style: "normal" | "italic"; weight: 300 }[] = [];
  if (ralewayFont) fonts.push({ name: "Raleway", data: ralewayFont, style: "normal", weight: 300 });
  if (frauncesFont)
    fonts.push({ name: "Fraunces", data: frauncesFont, style: "italic", weight: 300 });

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
      {/* Accent circle — echoing the favicon */}
      <div
        style={{
          position: "absolute",
          top: "-120px",
          right: "-120px",
          width: "460px",
          height: "460px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 40% 40%, rgba(162, 191, 210, 0.25), rgba(162, 191, 210, 0.06))",
          display: "flex",
        }}
      />

      {/* Small solid accent circle */}
      <div
        style={{
          position: "absolute",
          bottom: "80px",
          right: "100px",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          backgroundColor: "rgba(162, 191, 210, 0.15)",
          display: "flex",
        }}
      />

      {/* Subtle border line */}
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

      {/* Name */}
      <div
        style={{
          fontFamily: "Raleway",
          fontSize: "18px",
          fontWeight: 300,
          color: "#72716d",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: "28px",
          display: "flex",
        }}
      >
        CHAYUT CHUNSAMPHRAN
      </div>

      {/* Title */}
      <div
        style={{
          fontFamily: "Raleway",
          fontSize: "64px",
          fontWeight: 300,
          color: "#e8e7e3",
          lineHeight: 1.15,
          display: "flex",
        }}
      >
        Playground
      </div>

      {/* Tagline */}
      <div
        style={{
          fontFamily: "Fraunces",
          fontStyle: "italic",
          fontSize: "30px",
          fontWeight: 300,
          color: "#a2bfd2",
          marginTop: "20px",
          lineHeight: 1.4,
          display: "flex",
        }}
      >
        Interactive design explorations & interface craft
      </div>

      {/* URL */}
      <div
        style={{
          fontFamily: "Raleway",
          fontSize: "16px",
          fontWeight: 300,
          color: "#3d3c39",
          position: "absolute",
          bottom: "32px",
          left: "80px",
          display: "flex",
        }}
      >
        chayut.me
      </div>
    </div>,
    {
      ...size,
      fonts,
    },
  );
}
