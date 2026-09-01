import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { wipe } from "@remotion/transitions/wipe";
import { fade } from "@remotion/transitions/fade";
import { Backdrop } from "./components/Backdrop";
import { Intro } from "./scenes/Intro";
import { Stats } from "./scenes/Stats";
import { Outro } from "./scenes/Outro";
import { Feature, FeatureProps } from "./scenes/Feature";

export const FEATURES: FeatureProps[] = [
  {
    kicker: "Programs",
    title: "One application. Every program.",
    accentFrom: 2,
    bullets: ["Xi Lab, MVP Lab, Incubation & Hackathons", "Guided multi-step application forms", "Live status: submitted to accepted"],
    shot: "shots/xi-lab.png",
  },
  {
    kicker: "Cohorts",
    title: "Follow every cohort in real time",
    accentFrom: 3,
    bullets: ["Current and past batch lineups", "Monthly Top 10 and Quarterly Top 5", "Founder stories and traction updates"],
    shot: "shots/cohort.png",
    flip: true,
  },
  {
    kicker: "Directory",
    title: "A searchable global startup directory",
    accentFrom: 3,
    bullets: ["Filter by stage, sector and geography", "Rich, verified startup profiles", "Instant portal-wide search"],
    shot: "shots/directory.png",
  },
  {
    kicker: "Capital",
    title: "Where investors meet dealflow",
    accentFrom: 2,
    bullets: ["Curated dealflow and pipeline board", "Warm introduction requests", "Portfolio and market insights"],
    shot: "shots/investor.png",
    flip: true,
  },
  {
    kicker: "Community",
    title: "Find your co-founder and your mentor",
    accentFrom: 2,
    bullets: ["Co-founder listings and applications", "250+ mentors with booking flows", "In-app messaging across roles"],
    shot: "shots/cofounder.png",
  },
  {
    kicker: "Momentum",
    title: "Progress you can actually see",
    accentFrom: 3,
    bullets: ["XP, badges, streaks and quests", "Monthly leaderboards by role", "Perks unlocked as you level up"],
    shot: "shots/leaderboard.png",
    flip: true,
  },
];

const SCENE = 110;

export const TOTAL =
  105 + 110 + FEATURES.length * SCENE + 120 - 8 * 20;

const spring20 = springTiming({ config: { damping: 200 }, durationInFrames: 20 });

export const MainVideo: React.FC = () => (
  <AbsoluteFill>
    <Backdrop />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={105}>
        <Intro />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-left" })} timing={spring20} />

      <TransitionSeries.Sequence durationInFrames={110}>
        <Stats />
      </TransitionSeries.Sequence>

      {FEATURES.map((f, i) => (
        <React.Fragment key={f.shot}>
          <TransitionSeries.Transition
            presentation={i % 2 === 0 ? wipe({ direction: "from-right" }) : wipe({ direction: "from-left" })}
            timing={spring20}
          />
          <TransitionSeries.Sequence durationInFrames={SCENE}>
            <Feature {...f} />
          </TransitionSeries.Sequence>
        </React.Fragment>
      ))}

      <TransitionSeries.Transition presentation={fade()} timing={spring20} />
      <TransitionSeries.Sequence durationInFrames={120}>
        <Outro />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
