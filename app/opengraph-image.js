import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt =
  "Mousequetaire - Agence de Développement Web & Design en Île-de-France";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #001a28 0%, #002132 40%, #003a5c 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(0, 106, 158, 0.15)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-60px",
            left: "-60px",
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            background: "rgba(0, 106, 158, 0.1)",
            display: "flex",
          }}
        />

        {/* Mouse icon */}
        <div
          style={{
            display: "flex",
            fontSize: "72px",
            marginBottom: "20px",
          }}
        >
          🖱️
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            fontSize: "64px",
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-1px",
            marginBottom: "12px",
          }}
        >
          Mousequetaire
        </div>

        {/* Accent line */}
        <div
          style={{
            width: "80px",
            height: "4px",
            background: "#006a9e",
            borderRadius: "2px",
            marginBottom: "20px",
            display: "flex",
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            display: "flex",
            fontSize: "26px",
            color: "#87cefa",
            fontWeight: 600,
            marginBottom: "8px",
          }}
        >
          Agence de Développement Web & Design
        </div>

        {/* Location */}
        <div
          style={{
            display: "flex",
            fontSize: "20px",
            color: "rgba(255, 255, 255, 0.6)",
            fontWeight: 400,
          }}
        >
          Île-de-France · Sites web · Applications · E-commerce
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
