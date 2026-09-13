import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { C, FONT_BODY, FONT_DISPLAY } from "../theme";
import { Kicker } from "../components/Type";
import { PLATFORM_STAT_LABELS } from "../../../src/lib/platformStats";

const STATS = [
  { value: PLATFORM_STAT_LABELS.startupsAccelerated, label: "Startups accelerated" },
  { value: PLATFORM_STAT_LABELS.totalFundingRaised, label: "Total funding raised" },
  { value: PLATFORM_STAT_LABELS.activeMentors, label: "Active mentors" },
  { value: PLATFORM_STAT_LABELS.countriesRepresented, label: "Countries represented" },
];

export const Stats: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 150, paddingRight: 150 }}>
      <Kicker delay={4}>By the numbers</Kicker>
      <h2
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: 76,
          fontWeight: 700,
          color: C.ink,
          letterSpacing: -2,
          margin: "28px 0 60px",
          opacity: interpolate(frame, [8, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        A community that compounds
      </h2>

      <div style={{ display: "flex", gap: 30 }}>
        {STATS.map((s, i) => {
          const sp = spring({ frame: frame - 22 - i * 7, fps, config: { damping: 20, stiffness: 110 } });
          return (
            <div
              key={s.label}
              style={{
                flex: 1,
                padding: "42px 34px",
                borderRadius: 20,
                background: "rgba(255,255,255,0.035)",
                border: `1px solid ${C.line}`,
                borderTop: `3px solid ${C.ember}`,
                opacity: sp,
                transform: `translateY(${interpolate(sp, [0, 1], [56, 0])}px)`,
              }}
            >
              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: s.value.length > 4 ? 66 : 78,
                  fontWeight: 700,
                  color: C.ink,
                  letterSpacing: -2,
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                }}
              >
                {s.value}
              </div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 24, color: C.muted, marginTop: 16 }}>{s.label}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
