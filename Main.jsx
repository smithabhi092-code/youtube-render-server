import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const Main = ({ title, subtitle, background = "#111111" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  return (
    <AbsoluteFill
      style={{
        background,
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
        fontFamily: "Arial, sans-serif",
        textAlign: "center"
      }}
    >
      <div style={{ opacity, maxWidth: 900 }}>
        <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.1 }}>
          {title}
        </div>
        <div style={{ marginTop: 36, fontSize: 38, opacity: 0.85 }}>
          {subtitle}
        </div>
        <div style={{ marginTop: 60, fontSize: 24, opacity: 0.55 }}>
          {Math.floor(frame / fps)}s
        </div>
      </div>
    </AbsoluteFill>
  );
};
