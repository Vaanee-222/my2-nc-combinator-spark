import React from "react";
import { Img, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { C } from "../theme";

type Props = {
  src: string;
  width: number;
  delay?: number;
  tilt?: number;
  /** ken-burns zoom amount */
  zoom?: number;
  panY?: number;
};

/** A browser-chrome framed screenshot with a slow ken-burns move. */
export const Screen: React.FC<Props> = ({ src, width, delay = 0, tilt = 0, zoom = 0.06, panY = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - delay, fps, config: { damping: 26, stiffness: 90, mass: 1.1 } });
  const y = interpolate(enter, [0, 1], [70, 0]);
  const o = interpolate(enter, [0, 1], [0, 1]);
  const s = interpolate(enter, [0, 1], [0.94, 1]);

  const kb = interpolate(frame, [0, 200], [1, 1 + zoom], { extrapolateRight: "clamp" });
  const kbY = interpolate(frame, [0, 200], [0, panY], { extrapolateRight: "clamp" });

  const height = (width * 900) / 1440;

  return (
    <div
      style={{
        width,
        height: height + 38,
        opacity: o,
        transform: `perspective(2000px) rotateY(${tilt}deg) translateY(${y}px) scale(${s})`,
        borderRadius: 18,
        overflow: "hidden",
        background: C.bgSoft,
        border: `1px solid ${C.line}`,
        boxShadow: "0 60px 120px rgba(0,0,0,0.65), 0 0 0 1px rgba(249,115,22,0.10)",
      }}
    >
      <div
        style={{
          height: 38,
          display: "flex",
          alignItems: "center",
          gap: 9,
          paddingLeft: 18,
          background: "#171B24",
          borderBottom: `1px solid ${C.line}`,
        }}
      >
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <div key={c} style={{ width: 11, height: 11, borderRadius: 99, background: c }} />
        ))}
      </div>
      <div style={{ height, overflow: "hidden" }}>
        <Img
          src={staticFile(src)}
          style={{
            width: "100%",
            display: "block",
            transform: `scale(${kb}) translateY(${kbY}px)`,
            transformOrigin: "center top",
          }}
        />
      </div>
    </div>
  );
};
