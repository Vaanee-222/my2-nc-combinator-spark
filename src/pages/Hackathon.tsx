import Navigation from "@/components/Navigation";
import HackathonRegistrationForm from "@/components/HackathonRegistrationForm";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar, Clock, MapPin, Trophy, Users, Code, Zap, Target,
  Brain, Globe, Smartphone, Link2, Cpu, Lightbulb, Award,
} from "lucide-react";
import { Money } from "@/components/Money";
import { Link } from "react-router-dom";

const Hackathon = () => {
  const upcomingHackathons = [
    {
      id: 1,
      title: "AI Agents Challenge 2026",
      date: "Feb 14-16, 2026",
      location: "San Francisco + Virtual",
      theme: "Autonomous Agents & Tool Use",
      prizePoolUsd: 120_000,
      participants: "800+",
      status: "Registration Open",
      description: "Build production-grade autonomous agents that take real actions across SaaS, payments, and code.",
      registrationDeadline: "Feb 10, 2026",
    },
    {
      id: 2,
      title: "Climate Tech Sprint 2026",
      date: "Apr 18-20, 2026",
      location: "Berlin + Virtual",
      theme: "Energy, Carbon, and Hard Tech",
      prizePoolUsd: 100_000,
      participants: "600+",
      status: "Coming Soon",
      description: "Tackle measurable carbon-impact challenges with founders, scientists, and infrastructure investors.",
      registrationDeadline: "Apr 12, 2026",
    },
    {
      id: 3,
      title: "Global FinTech Build 2026",
      date: "Jun 6-8, 2026",
      location: "Singapore + Bangalore + Virtual",
      theme: "Embedded Finance & Cross-Border",
      prizePoolUsd: 150_000,
      participants: "1,000+",
      status: "Coming Soon",
      description: "Ship a working financial product across three regional regulatory contexts in 48 hours.",
      registrationDeadline: "Jun 1, 2026",
    },
  ];

  const tracks = [
    { name: "AI / Agents", icon: Brain, description: "Build autonomous agents, retrieval stacks, and multimodal apps.", technologies: ["Python", "LangGraph", "OpenAI", "Anthropic"] },
    { name: "Web & Cloud", icon: Globe, description: "Ship modern web platforms with edge compute and real-time data.", technologies: ["React", "Node.js", "Vercel", "Supabase"] },
    { name: "Mobile", icon: Smartphone, description: "Native and cross-platform mobile apps with delightful UX.", technologies: ["React Native", "Flutter", "Swift", "Kotlin"] },
    { name: "Blockchain / Web3", icon: Link2, description: "Smart contracts, on-chain identity, and stablecoin rails.", technologies: ["Solidity", "Ethereum", "Solana", "Base"] },
    { name: "IoT & DeepTech", icon: Cpu, description: "Hardware-software hybrids, edge inference, and robotics.", technologies: ["Arduino", "Raspberry Pi", "ESP32", "Jetson"] },
    { name: "Open Innovation", icon: Lightbulb, description: "Anything that breaks the rules in a useful way.", technologies: ["Any stack"] },
  ];

  const prizes = [
    { position: "1st Place", amountUsd: 60_000, benefits: ["Cash Prize", "Xi Lab Fast Track", "Founder Mentorship", "Cloud Credits"] },
    { position: "2nd Place", amountUsd: 35_000, benefits: ["Cash Prize", "Mentorship Program", "Co-working Space", "Tooling Credits"] },
    { position: "3rd Place", amountUsd: 25_000, benefits: ["Cash Prize", "Online Courses", "Startup Resources", "Networking"] },
  ];

  const pastWinners = [
    { year: "2025", winner: "AgentMesh", project: "Orchestration runtime for autonomous business agents", prizeUsd: 60_000 },
    { year: "2024", winner: "HealthAI", project: "AI-powered diagnostic assistant for community clinics", prizeUsd: 55_000 },
    { year: "2023", winner: "EcoTrack", project: "IoT-based waste-management network for smart cities", prizeUsd: 45_000 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        {/* Hero */}
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-6">
            Xi Combinator Hackathons
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-8">
            Global hackathons where founders, engineers, and designers ship breakthrough products in 48 hours.
            Build, compete, and get fast-tracked into Xi Lab.
          </p>
          <div className="flex justify-center space-x-4 flex-wrap gap-2">
            <HackathonRegistrationForm>
              <Button size="lg" className="bg-gradient-to-r from-primary to-orange-400 hover:shadow-orange-glow">
                Register for Next Hackathon
              </Button>
            </HackathonRegistrationForm>
            <Link to="/past-events"><Button variant="outline" size="lg">View Past Events</Button></Link>
          </div>
        </section>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {[
            { title: "Total Participants", value: "12,000+", sub: "Across all events", Icon: Users },
            { title: "Prize Money", value: <Money usd={1_200_000} compact />, sub: "Total distributed", Icon: Trophy },
            { title: "Projects Built", value: "2,400+", sub: "Innovative solutions", Icon: Code },
            { title: "Become Startups", value: "28%", sub: "Project-to-startup rate", Icon: Target },
          ].map((s, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{s.title}</CardTitle>
                <s.Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{s.value}</div>
                <p className="text-xs text-muted-foreground">{s.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upcoming */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Upcoming Hackathons</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {upcomingHackathons.map((h) => (
              <Card key={h.id} className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant={h.status === "Registration Open" ? "default" : "secondary"}>{h.status}</Badge>
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{h.title}</CardTitle>
                  <CardDescription className="text-sm font-medium text-primary">{h.theme}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{h.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2"><Calendar className="h-4 w-4 text-muted-foreground" /><span>{h.date}</span></div>
                    <div className="flex items-center space-x-2"><MapPin className="h-4 w-4 text-muted-foreground" /><span>{h.location}</span></div>
                    <div className="flex items-center space-x-2"><Trophy className="h-4 w-4 text-muted-foreground" /><span>Prize Pool: <Money usd={h.prizePoolUsd} /></span></div>
                    <div className="flex items-center space-x-2"><Users className="h-4 w-4 text-muted-foreground" /><span>{h.participants} participants expected</span></div>
                    <div className="flex items-center space-x-2"><Clock className="h-4 w-4 text-muted-foreground" /><span>Register by: {h.registrationDeadline}</span></div>
                  </div>
                  <div className="pt-4 space-y-2">
                    {h.status === "Registration Open" ? (
                      <HackathonRegistrationForm><Button className="w-full">Register Now</Button></HackathonRegistrationForm>
                    ) : (
                      <Button className="w-full" disabled>Registration Opens Soon</Button>
                    )}
                    <Link to={`/hackathon-detail/${h.id}`}><Button variant="outline" className="w-full">Learn More</Button></Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Tracks */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Competition Tracks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tracks.map((t, i) => (
              <Card key={i} className="hover:shadow-md transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <t.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{t.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{t.description}</p>
                  <div>
                    <p className="text-sm font-medium mb-2">Popular Technologies:</p>
                    <div className="flex flex-wrap gap-1">
                      {t.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Prizes — consistent color */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Prizes & Rewards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {prizes.map((p, index) => (
              <Card key={index} className="border-primary/30 bg-primary/5 hover:shadow-orange-glow transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
                    <Award className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{p.position}</CardTitle>
                  <CardDescription className="text-2xl font-bold text-primary">
                    <Money usd={p.amountUsd} />
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {p.benefits.map((b, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <Zap className="h-4 w-4 text-primary" />
                        <span className="text-sm">{b}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Past Winners */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Past Winners</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pastWinners.map((w, i) => (
              <Card key={i} className="hover:shadow-md transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{w.winner}</CardTitle>
                    <Badge variant="outline">{w.year}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{w.project}</p>
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-4 w-4 text-primary" />
                    <span className="font-medium text-primary"><Money usd={w.prizeUsd} /></span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-16 bg-gradient-to-r from-primary/10 to-orange-400/10 rounded-3xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Build Your Way Into Xi Lab?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Win a Xi Combinator hackathon and get fast-tracked into our flagship accelerator program.
          </p>
          <div className="flex justify-center space-x-4 flex-wrap gap-2">
            <HackathonRegistrationForm>
              <Button size="lg" className="bg-gradient-to-r from-primary to-orange-400 hover:shadow-orange-glow">Register Now</Button>
            </HackathonRegistrationForm>
            <Link to="/program-details"><Button variant="outline" size="lg">Learn More</Button></Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Hackathon;
