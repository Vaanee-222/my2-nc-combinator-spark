import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Trophy, Users, Code, Zap, Target, CheckCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import HackathonRegistrationForm from "@/components/HackathonRegistrationForm";

const HackathonDetail = () => {
  const { id } = useParams();
  
  // Mock data - in a real app, this would come from an API
  const hackathonData = {
    id: id || "1",
    title: "AI Innovation Challenge 2025",
    date: "Feb 15-17, 2025",
    location: "Bangalore, India",
    venue: "Indian Institute of Science (IISc)",
    theme: "Artificial Intelligence & Machine Learning",
    prizePool: "$12Kakhs",
    participants: "500+",
    status: "Registration Open",
    description: "Build AI solutions for real-world problems in healthcare, education, and sustainability.",
    registrationDeadline: "Feb 10, 2025",
    longDescription: "The AI Innovation Challenge 2025 is a premier hackathon bringing together the brightest minds in technology to solve pressing challenges using artificial intelligence and machine learning. Over 48 hours, participants will collaborate, innovate, and build solutions that can make a real impact in healthcare, education, and sustainability.",
    schedule: [
      { time: "9:00 AM", activity: "Registration & Breakfast", day: "Day 1" },
      { time: "10:00 AM", activity: "Opening Ceremony", day: "Day 1" },
      { time: "11:00 AM", activity: "Problem Statements Released", day: "Day 1" },
      { time: "12:00 PM", activity: "Team Formation & Lunch", day: "Day 1" },
      { time: "1:00 PM", activity: "Hacking Begins", day: "Day 1" },
      { time: "6:00 PM", activity: "Dinner & Networking", day: "Day 1" },
      { time: "9:00 AM", activity: "Breakfast & Mentor Sessions", day: "Day 2" },
      { time: "12:00 PM", activity: "Lunch & Tech Talks", day: "Day 2" },
      { time: "6:00 PM", activity: "Dinner & Demo Preparation", day: "Day 2" },
      { time: "9:00 AM", activity: "Final Presentations", day: "Day 3" },
      { time: "12:00 PM", activity: "Judging & Awards", day: "Day 3" },
      { time: "3:00 PM", activity: "Closing Ceremony", day: "Day 3" },
    ],
    tracks: [
      { name: "Healthcare AI", description: "AI solutions for medical diagnosis and treatment" },
      { name: "Education Technology", description: "AI-powered learning and assessment tools" },
      { name: "Sustainability", description: "Environmental solutions using AI and IoT" },
      { name: "Open Innovation", description: "Creative AI applications in any domain" },
    ],
    prizes: [
      { position: "1st Place", amount: "$5,00,000", benefits: ["Cash Prize", "Incubation Program", "Mentorship"] },
      { position: "2nd Place", amount: "$3,00,000", benefits: ["Cash Prize", "Mentorship Program", "Co-working Space"] },
      { position: "3rd Place", amount: "$2,00,000", benefits: ["Cash Prize", "Online Courses", "Startup Resources"] },
    ],
    judges: [
      { name: "Dr. Priya Sharma", title: "AI Research Director, Microsoft India" },
      { name: "Rajesh Kumar", title: "Founder & CEO, TechStartup Inc." },
      { name: "Anita Patel", title: "VP Engineering, Google India" },
    ],
    sponsors: ["Microsoft", "Google", "Amazon", "TCS", "Infosys"],
    requirements: [
      "Teams of 2-4 members",
      "At least one team member should be a student",
      "Laptop and development tools",
      "Original ideas and code",
      "Working prototype by submission deadline",
    ],
    perks: [
      "Free meals and accommodation",
      "Mentorship from industry experts",
      "Networking opportunities",
      "Workshop sessions",
      "Certificate of participation",
      "Goodies and swag",
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <Breadcrumbs />
        
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="bg-primary/10 text-primary text-lg px-4 py-2 mb-4">
            {hackathonData.status}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {hackathonData.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {hackathonData.longDescription}
          </p>
          <div className="flex justify-center space-x-4">
            <HackathonRegistrationForm>
              <Button size="lg" className="bg-gradient-to-r from-primary to-orange-400 hover:shadow-orange-glow">
                Register Now
              </Button>
            </HackathonRegistrationForm>
            <Button variant="outline" size="lg">
              Download Brochure
            </Button>
          </div>
        </div>

        {/* Key Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-card-gradient border-border">
            <CardContent className="pt-6 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Date</h3>
              <p className="text-sm text-muted-foreground">{hackathonData.date}</p>
            </CardContent>
          </Card>
          <Card className="bg-card-gradient border-border">
            <CardContent className="pt-6 text-center">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Location</h3>
              <p className="text-sm text-muted-foreground">{hackathonData.location}</p>
            </CardContent>
          </Card>
          <Card className="bg-card-gradient border-border">
            <CardContent className="pt-6 text-center">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Prize Pool</h3>
              <p className="text-sm text-muted-foreground">{hackathonData.prizePool}</p>
            </CardContent>
          </Card>
          <Card className="bg-card-gradient border-border">
            <CardContent className="pt-6 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Participants</h3>
              <p className="text-sm text-muted-foreground">{hackathonData.participants}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tracks */}
            <Card className="bg-card-gradient border-border">
              <CardHeader>
                <CardTitle>Competition Tracks</CardTitle>
                <CardDescription>Choose your track and start building</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hackathonData.tracks.map((track, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-muted/5">
                      <h4 className="font-semibold mb-2">{track.name}</h4>
                      <p className="text-sm text-muted-foreground">{track.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Schedule */}
            <Card className="bg-card-gradient border-border">
              <CardHeader>
                <CardTitle>Event Schedule</CardTitle>
                <CardDescription>48 hours of intense coding and innovation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hackathonData.schedule.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <Badge variant="outline" className="text-xs">
                          {item.day}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="font-medium">{item.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{item.activity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Prizes */}
            <Card className="bg-card-gradient border-border">
              <CardHeader>
                <CardTitle>Prizes & Rewards</CardTitle>
                <CardDescription>Compete for amazing prizes and opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {hackathonData.prizes.map((prize, index) => (
                    <div key={index} className={`p-4 border rounded-lg text-center ${
                      index === 0 ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-950' : 'bg-muted/5'
                    }`}>
                      <div className="text-2xl mb-2">
                        {index === 0 ? '' : index === 1 ? '' : ''}
                      </div>
                      <h4 className="font-semibold">{prize.position}</h4>
                      <p className="text-lg font-bold text-primary mb-2">{prize.amount}</p>
                      <div className="space-y-1">
                        {prize.benefits.map((benefit, idx) => (
                          <p key={idx} className="text-xs text-muted-foreground">{benefit}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Info */}
            <Card className="bg-card-gradient border-border">
              <CardHeader>
                <CardTitle>Registration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Deadline</span>
                  <Badge variant="secondary">{hackathonData.registrationDeadline}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Fee</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Free</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Team Size</span>
                  <Badge variant="outline">2-4 members</Badge>
                </div>
                <HackathonRegistrationForm>
                  <Button className="w-full">Register Your Team</Button>
                </HackathonRegistrationForm>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card className="bg-card-gradient border-border">
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {hackathonData.requirements.map((req, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                      <span className="text-sm">{req}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Perks */}
            <Card className="bg-card-gradient border-border">
              <CardHeader>
                <CardTitle>What You Get</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {hackathonData.perks.map((perk, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Zap className="h-4 w-4 text-primary mt-0.5" />
                      <span className="text-sm">{perk}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Judges */}
            <Card className="bg-card-gradient border-border">
              <CardHeader>
                <CardTitle>Judges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {hackathonData.judges.map((judge, index) => (
                    <div key={index}>
                      <h4 className="font-medium text-sm">{judge.name}</h4>
                      <p className="text-xs text-muted-foreground">{judge.title}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HackathonDetail;
