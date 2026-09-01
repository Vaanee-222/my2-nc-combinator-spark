import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { C } from "../theme";

/** Persistent background: drifting ember glows + faint grid. Spans the whole video. */
export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();

  const drift = (speed: number, amp: number, phase = 0) =>
    Math.sin((frame / speed) + phase) * amp;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(1200px 800px at 78% 12%, rgba(249,115,22,0.16), transparent 65%), radial-gradient(1000px 900px at 8% 88%, rgba(249,115,22,0.08), transparent 60%)",
          transform: `translate(${drift(140, 40)}px, ${drift(190, 26, 1.2)}px)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          transform: `translateY(${(frame * 0.18) % 80}px)`,
          opacity: 0.7,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(11,13,17,0.55) 0%, transparent 35%, transparent 65%, rgba(11,13,17,0.75) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: 6,
          width: "100%",
          background: `linear-gradient(90deg, ${C.ember}, rgba(249,115,22,0))`,
          opacity: interpolate(frame, [0, 20], [0, 0.9], { extrapolateRight: "clamp" }),
        }}
      />
    </AbsoluteFill>
  );
};
