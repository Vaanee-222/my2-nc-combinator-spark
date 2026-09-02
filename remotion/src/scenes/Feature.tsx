import React from "react";
import { AbsoluteFill } from "remotion";
import { Screen } from "../components/Screen";
import { Bullet, Kicker, Headline } from "../components/Type";

export type FeatureProps = {
  kicker: string;
  title: string;
  accentFrom?: number;
  bullets: string[];
  shot: string;
  flip?: boolean;
  panY?: number;
};

export const Feature: React.FC<FeatureProps> = ({ kicker, title, accentFrom, bullets, shot, flip, panY = -60 }) => {
  const text = (
    <div style={{ width: 690, display: "flex", flexDirection: "column", gap: 26 }}>
      <Kicker delay={4}>{kicker}</Kicker>
      <Headline text={title} delay={10} size={62} accentFrom={accentFrom} />
      <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 8 }}>
        {bullets.map((b, i) => (
          <Bullet key={b} delay={30 + i * 8}>
            {b}
          </Bullet>
        ))}
      </div>
    </div>
  );

  const visual = (
    <div style={{ flex: 1, display: "flex", justifyContent: flip ? "flex-start" : "flex-end" }}>
      <Screen src={shot} width={950} delay={12} tilt={flip ? 8 : -8} panY={panY} />
    </div>
  );

  return (
    <AbsoluteFill
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 60,
        padding: "0 100px",
      }}
    >
      {flip ? (
        <>
          {visual}
          {text}
        </>
      ) : (
        <>
          {text}
          {visual}
        </>
      )}
    </AbsoluteFill>
  );
};
