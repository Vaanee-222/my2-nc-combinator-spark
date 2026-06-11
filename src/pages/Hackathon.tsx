import Navigation from "@/components/Navigation";
import HackathonRegistrationForm from "@/components/HackathonRegistrationForm";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Trophy, Users, Code, Zap, Target } from "lucide-react";
import { Link } from "react-router-dom";

const Hackathon = () => {
  const upcomingHackathons = [
    {
      id: 1,
      title: "AI Innovation Challenge 2025",
      date: "Feb 15-17, 2025",
      location: "Bangalore, India",
      theme: "Artificial Intelligence & Machine Learning",
      prizePool: "$10 Lakhs",
      participants: "500+",
      status: "Registration Open",
      description: "Build AI solutions for real-world problems in healthcare, education, and sustainability.",
      registrationDeadline: "Feb 10, 2025"
    },
    {
      id: 2,
      title: "FinTech Revolution Hackathon",
      date: "Mar 22-24, 2025",
      location: "Mumbai, India",
      theme: "Financial Technology",
      prizePool: "$8 Lakhs",
      participants: "400+",
      status: "Coming Soon",
      description: "Create innovative fintech solutions for banking, payments, and financial inclusion.",
      registrationDeadline: "Mar 15, 2025"
    },
    {
      id: 3,
      title: "Green Tech Challenge",
      date: "Apr 5-7, 2025",
      location: "Hyderabad, India",
      theme: "Sustainability & Clean Technology",
      prizePool: "$12 Lakhs",
      participants: "600+",
      status: "Coming Soon",
      description: "Develop solutions for environmental challenges and sustainable development.",
      registrationDeadline: "Mar 30, 2025"
    }
  ];

  const tracks = [
    {
      name: "AI/ML Track",
      icon: "",
      description: "Build intelligent solutions using artificial intelligence and machine learning",
      technologies: ["Python", "TensorFlow", "PyTorch", "OpenAI APIs"]
    },
    {
      name: "Web Development",
      icon: "",
      description: "Create innovative web applications and platforms",
      technologies: ["React", "Node.js", "MongoDB", "AWS"]
    },
    {
      name: "Mobile Apps",
      icon: "",
      description: "Develop mobile applications for iOS and Android",
      technologies: ["React Native", "Flutter", "Swift", "Kotlin"]
    },
    {
      name: "Blockchain/Web3",
      icon: "",
      description: "Build decentralized applications and blockchain solutions",
      technologies: ["Solidity", "Ethereum", "Web3.js", "IPFS"]
    },
    {
      name: "IoT & Hardware",
      icon: "",
      description: "Create IoT devices and hardware-based solutions",
      technologies: ["Arduino", "Raspberry Pi", "ESP32", "Sensors"]
    },
    {
      name: "Open Innovation",
      icon: "",
      description: "Think outside the box with creative and unique solutions",
      technologies: ["Any technology stack"]
    }
  ];

  const prizes = [
    {
      position: "1st Place",
      amount: "$5,00,000",
      benefits: ["Cash Prize", "Incubation Program", "Mentorship", "AWS Credits"]
    },
    {
      position: "2nd Place",
      amount: "$3,00,000",
      benefits: ["Cash Prize", "Mentorship Program", "Co-working Space", "GitHub Credits"]
    },
    {
      position: "3rd Place",
      amount: "$2,00,000",
      benefits: ["Cash Prize", "Online Courses", "Startup Resources", "Networking"]
    }
  ];

  const pastWinners = [
    {
      year: "2024",
      winner: "HealthAI",
      project: "AI-powered diagnostic assistant for rural healthcare",
      prize: "$5,00,000"
    },
    {
      year: "2023",
      winner: "EcoTrack",
      project: "IoT-based waste management system for smart cities",
      prize: "$4,00,000"
    },
    {
      year: "2022",
      winner: "FinanceBot",
      project: "AI chatbot for financial literacy and investment guidance",
      prize: "$3,50,000"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-6">
            Xi Combinator Hackathons
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-8">
            Join India's most exciting hackathons where innovation meets opportunity. Code, compete, and create solutions that matter.
          </p>
          <div className="flex justify-center space-x-4">
            <HackathonRegistrationForm>
              <Button size="lg" className="bg-gradient-to-r from-primary to-orange-400 hover:shadow-orange-glow">
                Register for Next Hackathon
              </Button>
            </HackathonRegistrationForm>
            <Button variant="outline" size="lg">
              View Past Events
            </Button>
          </div>
        </section>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">5,000+</div>
              <p className="text-xs text-muted-foreground">Across all events</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prize Money</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">$50L+</div>
              <p className="text-xs text-muted-foreground">Total distributed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projects Built</CardTitle>
              <Code className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">1,200+</div>
              <p className="text-xs text-muted-foreground">Innovative solutions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">25%</div>
              <p className="text-xs text-muted-foreground">Become startups</p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Hackathons */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Upcoming Hackathons</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {upcomingHackathons.map((hackathon) => (
              <Card key={hackathon.id} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant={hackathon.status === "Registration Open" ? "default" : "secondary"}>
                      {hackathon.status}
                    </Badge>
                    <div className="text-2xl">🏆</div>
                  </div>
                  <CardTitle className="text-xl">{hackathon.title}</CardTitle>
                  <CardDescription className="text-sm font-medium text-primary">
                    {hackathon.theme}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{hackathon.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{hackathon.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{hackathon.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-4 w-4 text-muted-foreground" />
                      <span>Prize Pool: {hackathon.prizePool}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{hackathon.participants} participants expected</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Register by: {hackathon.registrationDeadline}</span>
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    {hackathon.status === "Registration Open" ? (
                      <HackathonRegistrationForm>
                        <Button className="w-full">
                          Register Now
                        </Button>
                      </HackathonRegistrationForm>
                    ) : (
                      <Button className="w-full" disabled>
                        Registration Opens Soon
                      </Button>
                    )}
                    <Link to={`/hackathon-detail/${hackathon.id}`}>
                      <Button variant="outline" className="w-full">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Competition Tracks */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Competition Tracks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tracks.map((track, index) => (
              <Card key={index} className="hover:shadow-md transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{track.icon}</div>
                    <CardTitle className="text-lg">{track.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{track.description}</p>
                  <div>
                    <p className="text-sm font-medium mb-2">Popular Technologies:</p>
                    <div className="flex flex-wrap gap-1">
                      {track.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Prizes */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Prizes & Rewards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {prizes.map((prize, index) => (
              <Card key={index} className={`hover:shadow-lg transition-all duration-300 ${index === 0 ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900' : ''}`}>
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </div>
                  <CardTitle className="text-xl">{prize.position}</CardTitle>
                  <CardDescription className="text-2xl font-bold text-primary">
                    {prize.amount}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {prize.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <Zap className="h-4 w-4 text-primary" />
                        <span className="text-sm">{benefit}</span>
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
            {pastWinners.map((winner, index) => (
              <Card key={index} className="hover:shadow-md transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{winner.winner}</CardTitle>
                    <Badge variant="outline">{winner.year}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{winner.project}</p>
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-4 w-4 text-primary" />
                    <span className="font-medium text-primary">{winner.prize}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-16 bg-gradient-to-r from-primary/10 to-orange-400/10 rounded-3xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Code Your Way to Success?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of developers, designers, and innovators in creating solutions that can change the world. 
            Register now and be part of India's premier hackathon experience.
          </p>
          <div className="flex justify-center space-x-4">
            <HackathonRegistrationForm>
              <Button size="lg" className="bg-gradient-to-r from-primary to-orange-400 hover:shadow-orange-glow">
                Register Now
              </Button>
            </HackathonRegistrationForm>
            <Link to="/program-details">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Hackathon;
