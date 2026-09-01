import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { C, FONT_BODY, FONT_DISPLAY } from "../theme";

export const Kicker: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame - delay, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const x = interpolate(frame - delay, [0, 22], [-26, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, opacity: o, transform: `translateX(${x}px)` }}>
      <div style={{ width: 54, height: 3, background: C.ember, borderRadius: 2 }} />
      <span
        style={{
          fontFamily: FONT_BODY,
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: 5,
          textTransform: "uppercase",
          color: C.ember,
        }}
      >
        {children}
      </span>
    </div>
  );
};

/** Word-by-word display headline. */
export const Headline: React.FC<{ text: string; delay?: number; size?: number; accentFrom?: number }> = ({
  text,
  delay = 0,
  size = 92,
  accentFrom,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0 22px", maxWidth: 1120 }}>
      {words.map((w, i) => {
        const d = delay + i * 4;
        const sp = spring({ frame: frame - d, fps, config: { damping: 22, stiffness: 130 } });
        return (
          <span
            key={`${w}-${i}`}
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: size,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: -2,
              color: accentFrom !== undefined && i >= accentFrom ? C.ember : C.ink,
              opacity: sp,
              transform: `translateY(${interpolate(sp, [0, 1], [46, 0])}px)`,
              filter: `blur(${interpolate(sp, [0, 1], [10, 0])}px)`,
              display: "inline-block",
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

export const Body: React.FC<{ children: React.ReactNode; delay?: number; width?: number }> = ({
  children,
  delay = 0,
  width = 780,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame - delay, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(frame - delay, [0, 24], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <p
      style={{
        fontFamily: FONT_BODY,
        fontSize: 30,
        lineHeight: 1.45,
        color: C.muted,
        maxWidth: width,
        margin: 0,
        opacity: o,
        transform: `translateY(${y}px)`,
      }}
    >
      {children}
    </p>
  );
};

export const Bullet: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: frame - delay, fps, config: { damping: 24, stiffness: 120 } });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        opacity: sp,
        transform: `translateX(${interpolate(sp, [0, 1], [-30, 0])}px)`,
      }}
    >
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: 3,
          background: C.ember,
          transform: "rotate(45deg)",
          flexShrink: 0,
        }}
      />
      <span style={{ fontFamily: FONT_BODY, fontSize: 30, color: C.ink, fontWeight: 500 }}>{children}</span>
    </div>
  );
};
