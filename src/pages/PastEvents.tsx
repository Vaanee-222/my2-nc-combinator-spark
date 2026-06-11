
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Trophy, Award, Download, ExternalLink } from "lucide-react";

const PastEvents = () => {
  const pastEvents = [
    {
      id: 1,
      title: "AI Innovation Challenge 2026",
      date: "March 15-17, 2026",
      location: "IIT Bangalore",
      participants: 450,
      teams: 112,
      theme: "Artificial Intelligence & Machine Learning",
      prizePool: "$8 Lakhs",
      winner: "MediAI - Smart Diagnostic Platform",
      status: "completed",
      highlights: [
        "48-hour intensive coding marathon",
        "Mentorship from industry experts",
        "$8L+ in prizes and awards",
        "Partnership opportunities with tech giants"
      ],
      winners: [
        { position: "1st", team: "MediAI", prize: "$3L", solution: "AI-powered medical diagnosis" },
        { position: "2nd", team: "EcoTrack", prize: "$2L", solution: "Environmental monitoring system" },
        { position: "3rd", team: "FinBot", prize: "$1.5L", solution: "Personal finance AI assistant" }
      ],
      sponsors: ["Microsoft", "Google", "AWS"],
      mediaLinks: {
        photos: "#",
        videos: "#",
        report: "#"
      }
    },
    {
      id: 2,
      title: "FinTech Revolution 2026",
      date: "January 20-22, 2026",
      location: "IIIT Hyderabad",
      participants: 380,
      teams: 95,
      theme: "Financial Technology & Blockchain",
      prizePool: "$12Kakhs",
      winner: "CryptoSecure - Blockchain Security Platform",
      status: "completed",
      highlights: [
        "Focus on financial inclusion",
        "Blockchain workshops",
        "Regulatory compliance sessions",
        "Investor pitch opportunities"
      ],
      winners: [
        { position: "1st", team: "CryptoSecure", prize: "$4L", solution: "Blockchain security platform" },
        { position: "2nd", team: "PayEasy", prize: "$3L", solution: "Digital payment solution" },
        { position: "3rd", team: "LoanBot", prize: "$2L", solution: "AI loan processing system" }
      ],
      sponsors: ["HDFC Bank", "Paytm", "Razorpay"],
      mediaLinks: {
        photos: "#",
        videos: "#",
        report: "#"
      }
    },
    {
      id: 3,
      title: "Sustainable Tech Hackathon 2023",
      date: "November 10-12, 2023",
      location: "NIT Trichy",
      participants: 320,
      teams: 80,
      theme: "Sustainability & Clean Technology",
      prizePool: "$6 Lakhs",
      winner: "GreenEnergy - Solar Optimization System",
      status: "completed",
      highlights: [
        "Environmental impact focus",
        "Clean tech innovations",
        "Industry expert judging panel",
        "Sustainability workshops"
      ],
      winners: [
        { position: "1st", team: "GreenEnergy", prize: "$2.5L", solution: "Solar panel optimization" },
        { position: "2nd", team: "WaterPure", prize: "$2L", solution: "Water purification tech" },
        { position: "3rd", team: "AirClean", prize: "$1.5L", solution: "Air pollution monitoring" }
      ],
      sponsors: ["Tata Power", "Mahindra", "Suzlon"],
      mediaLinks: {
        photos: "#",
        videos: "#",
        report: "#"
      }
    },
    {
      id: 4,
      title: "HealthTech Innovation 2023",
      date: "September 8-10, 2023",
      location: "AIIMS Delhi",
      participants: 280,
      teams: 70,
      theme: "Healthcare Technology & Telemedicine",
      prizePool: "$7 Lakhs",
      winner: "TeleMed Pro - Remote Healthcare Platform",
      status: "completed",
      highlights: [
        "Healthcare professionals as mentors",
        "Medical device prototyping",
        "Telemedicine solutions",
        "Regulatory guidance sessions"
      ],
      winners: [
        { position: "1st", team: "TeleMed Pro", prize: "$3L", solution: "Telemedicine platform" },
        { position: "2nd", team: "DiagnoAI", prize: "$2.5L", solution: "AI diagnostic tool" },
        { position: "3rd", team: "HealthTrack", prize: "$1.5L", solution: "Patient monitoring system" }
      ],
      sponsors: ["Apollo Hospitals", "Fortis", "Medanta"],
      mediaLinks: {
        photos: "#",
        videos: "#",
        report: "#"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <Breadcrumbs />
        
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-6">
            Past Events
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our history of successful hackathons and the amazing innovations that emerged from them.
          </p>
        </section>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">25+</div>
              <p className="text-xs text-muted-foreground">Since 2020</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Participants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">5,000+</div>
              <p className="text-xs text-muted-foreground">Total participants</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prize Money</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">$250K+</div>
              <p className="text-xs text-muted-foreground">Total distributed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Startups Launched</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">150+</div>
              <p className="text-xs text-muted-foreground">From hackathons</p>
            </CardContent>
          </Card>
        </div>

        {/* Past Events Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Recent Hackathons</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {pastEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Completed
                    </Badge>
                    <div className="text-2xl"></div>
                  </div>
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  <CardDescription className="space-y-2">
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{event.date}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{event.location}</span>
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-xs">{event.theme}</Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Event Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold text-primary">{event.participants}</div>
                      <div className="text-xs text-muted-foreground">Participants</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-primary">{event.teams}</div>
                      <div className="text-xs text-muted-foreground">Teams</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-primary">{event.prizePool}</div>
                      <div className="text-xs text-muted-foreground">Prize Pool</div>
                    </div>
                  </div>

                  {/* Winners */}
                  <div>
                    <h4 className="font-semibold mb-3"> Winners</h4>
                    <div className="space-y-2">
                      {event.winners.map((winner, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted/5 rounded">
                          <div>
                            <span className="font-medium">{winner.position} - {winner.team}</span>
                            <p className="text-xs text-muted-foreground">{winner.solution}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">{winner.prize}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Highlights */}
                  <div>
                    <h4 className="font-semibold mb-2"> Highlights</h4>
                    <div className="space-y-1">
                      {event.highlights.slice(0, 3).map((highlight, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                          <span className="text-xs text-muted-foreground">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sponsors */}
                  <div>
                    <h4 className="font-semibold mb-2"> Sponsors</h4>
                    <div className="flex flex-wrap gap-2">
                      {event.sponsors.map((sponsor, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {sponsor}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Media Links */}
                  <div className="flex space-x-2 pt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="h-3 w-3 mr-1" />
                      Report
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Photos
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Videos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-16 bg-gradient-to-r from-primary/10 to-orange-400/10 rounded-3xl">
          <h2 className="text-3xl font-bold mb-4">Ready for the Next Challenge?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Don't miss out on our upcoming hackathons. Register now and be part of the next innovation wave.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="bg-gradient-to-r from-primary to-orange-400 hover:shadow-orange-glow">
              View Upcoming Events
            </Button>
            <Button variant="outline" size="lg">
              Join Our Community
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PastEvents;
