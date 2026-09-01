import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { C, FONT_BODY, FONT_DISPLAY } from "../theme";
import { Headline } from "../components/Type";

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mark = spring({ frame, fps, config: { damping: 14, stiffness: 140 } });
  const lineW = interpolate(frame, [30, 70], [0, 620], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subO = interpolate(frame, [52, 74], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 150, paddingRight: 120 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 46 }}>
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: 22,
            background: C.ember,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${mark}) rotate(${interpolate(mark, [0, 1], [-25, 0])}deg)`,
            boxShadow: "0 20px 60px rgba(249,115,22,0.35)",
          }}
        >
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 40, fontWeight: 700, color: "#140A02" }}>Xi</span>
        </div>
        <span
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 44,
            fontWeight: 600,
            color: C.ink,
            opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            letterSpacing: -1,
          }}
        >
          Xi Combinator
        </span>
      </div>

      <Headline text="We need crazy founders" delay={26} size={104} accentFrom={2} />

      <div style={{ height: 3, width: lineW, background: `linear-gradient(90deg, ${C.ember}, transparent)`, marginTop: 40 }} />

      <p
        style={{
          fontFamily: FONT_BODY,
          fontSize: 32,
          color: C.muted,
          marginTop: 34,
          maxWidth: 900,
          opacity: subO,
          transform: `translateY(${interpolate(subO, [0, 1], [18, 0])}px)`,
        }}
      >
        The global accelerator platform — from application to funding, in one place.
      </p>
    </AbsoluteFill>
  );
};
