import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { C, FONT_BODY, FONT_DISPLAY } from "../theme";

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame, fps, config: { damping: 22, stiffness: 110 } });
  const pill = spring({ frame: frame - 34, fps, config: { damping: 16, stiffness: 130 } });
  const urlO = interpolate(frame, [56, 78], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const breathe = 1 + Math.sin(frame / 22) * 0.012;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 40 }}>
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: 26,
          background: C.ember,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${sp * breathe})`,
          boxShadow: "0 24px 80px rgba(249,115,22,0.4)",
        }}
      >
        <span style={{ fontFamily: FONT_DISPLAY, fontSize: 46, fontWeight: 700, color: "#140A02" }}>Xi</span>
      </div>

      <h2
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: 90,
          fontWeight: 700,
          color: C.ink,
          letterSpacing: -3,
          margin: 0,
          textAlign: "center",
          opacity: sp,
          transform: `translateY(${interpolate(sp, [0, 1], [40, 0])}px)`,
        }}
      >
        Build the improbable.
        <br />
        <span style={{ color: C.ember }}>Ship the inevitable.</span>
      </h2>

      <div
        style={{
          padding: "20px 44px",
          borderRadius: 999,
          border: `2px solid ${C.ember}`,
          fontFamily: FONT_BODY,
          fontSize: 30,
          fontWeight: 600,
          color: C.ink,
          opacity: pill,
          transform: `scale(${interpolate(pill, [0, 1], [0.85, 1])})`,
          whiteSpace: "nowrap",
        }}
      >
        Apply to the next Xi Lab cohort
      </div>

      <div style={{ fontFamily: FONT_BODY, fontSize: 28, color: C.muted, opacity: urlO, letterSpacing: 1 }}>
        xicombinator.lovable.app
      </div>
    </AbsoluteFill>
  );
};
