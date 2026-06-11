import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, AlertCircle, FileText, Users, DollarSign } from "lucide-react";
import ApplicationDialog from "@/components/ApplicationDialog";

const RequirementsDetail = () => {
  const navigate = useNavigate();

  const requirements = {
    eligibility: [
      {
        title: "Business Stage",
        description: "Pre-seed to Series A stage startups",
        required: true
      },
      {
        title: "Team Size",
        description: "Minimum 2 co-founders with complementary skills",
        required: true
      },
      {
        title: "Market Validation",
        description: "Evidence of product-market fit or strong validation signals",
        required: true
      },
      {
        title: "Traction",
        description: "Revenue, users, or significant pilot programs",
        required: false
      }
    ],
    documentation: [
      {
        title: "Business Plan",
        description: "Comprehensive business plan (10-15 pages)",
        format: "PDF",
        required: true
      },
      {
        title: "Pitch Deck",
        description: "Investor-ready presentation (10-12 slides)",
        format: "PDF/PPT",
        required: true
      },
      {
        title: "Video Pitch",
        description: "2-minute founder introduction video",
        format: "MP4/MOV",
        required: true
      },
      {
        title: "Financial Projections",
        description: "3-year financial model with assumptions",
        format: "Excel/PDF",
        required: true
      },
      {
        title: "Legal Documents",
        description: "Company registration, shareholder agreements",
        format: "PDF",
        required: false
      }
    ],
    evaluation: [
      {
        criteria: "Market Opportunity",
        weight: "25%",
        description: "Size, growth potential, and market timing"
      },
      {
        criteria: "Team Strength",
        weight: "25%",
        description: "Founder experience, domain expertise, execution capability"
      },
      {
        criteria: "Product Innovation",
        weight: "20%",
        description: "Uniqueness, technical feasibility, competitive advantage"
      },
      {
        criteria: "Business Model",
        weight: "15%",
        description: "Revenue model, scalability, unit economics"
      },
      {
        criteria: "Traction & Validation",
        weight: "15%",
        description: "Customer validation, revenue, partnerships"
      }
    ],
    timeline: [
      {
        stage: "Application Submission",
        duration: "5 minutes",
        description: "Complete online application form"
      },
      {
        stage: "Initial Review",
        duration: "1-2 weeks",
        description: "Team evaluates application and documents"
      },
      {
        stage: "Founder Interview",
        duration: "1 week",
        description: "Deep-dive discussion with founding team"
      },
      {
        stage: "Final Decision",
        duration: "1 week",
        description: "Final selection and program onboarding"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => navigate('/inclab')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Xi Lab
          </Button>

          {/* Header */}
          <div className="text-center space-y-6 mb-12">
            <Badge variant="secondary" className="bg-primary/10 text-primary text-lg px-4 py-2">
               Application Requirements
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold">
              Xi Lab Application{" "}
              <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                Requirements
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to know before applying to India's most selective startup accelerator program.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card className="p-6 bg-card-gradient border-border text-center">
              <div className="text-3xl font-bold text-primary mb-2">3%</div>
              <div className="text-muted-foreground">Acceptance Rate</div>
            </Card>
            <Card className="p-6 bg-card-gradient border-border text-center">
              <div className="text-3xl font-bold text-primary mb-2">15</div>
              <div className="text-muted-foreground">Spots per Cohort</div>
            </Card>
            <Card className="p-6 bg-card-gradient border-border text-center">
              <div className="text-3xl font-bold text-primary mb-2">6</div>
              <div className="text-muted-foreground">Month Program</div>
            </Card>
            <Card className="p-6 bg-card-gradient border-border text-center">
              <div className="text-3xl font-bold text-primary mb-2">$1Cr+</div>
              <div className="text-muted-foreground">Value per Startup</div>
            </Card>
          </div>

          {/* Eligibility Criteria */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center space-x-2">
                <CheckCircle className="h-6 w-6 text-primary" />
                <span>Eligibility Criteria</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {requirements.eligibility.map((req, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${req.required ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {req.required ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{req.title}</h3>
                      <p className="text-sm text-muted-foreground">{req.description}</p>
                      <Badge variant={req.required ? "destructive" : "secondary"} className="text-xs mt-2">
                        {req.required ? "Required" : "Preferred"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Required Documentation */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center space-x-2">
                <FileText className="h-6 w-6 text-primary" />
                <span>Required Documentation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requirements.documentation.map((doc, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${doc.required ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{doc.title}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">{doc.format}</Badge>
                          <Badge variant={doc.required ? "destructive" : "secondary"} className="text-xs">
                            {doc.required ? "Required" : "Optional"}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{doc.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Evaluation Criteria */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center space-x-2">
                <Users className="h-6 w-6 text-primary" />
                <span>Evaluation Criteria</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requirements.evaluation.map((criteria, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-primary/5 to-orange-400/5 rounded-lg">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="font-bold text-primary">{criteria.weight}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{criteria.criteria}</h3>
                      <p className="text-muted-foreground">{criteria.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Application Timeline */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center space-x-2">
                <DollarSign className="h-6 w-6 text-primary" />
                <span>Application Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {requirements.timeline.map((stage, index) => (
                  <div key={index} className="text-center space-y-4">
                    <div className="w-12 h-12 bg-primary rounded-full mx-auto flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold">{stage.stage}</h3>
                      <Badge variant="secondary" className="text-xs">{stage.duration}</Badge>
                      <p className="text-sm text-muted-foreground">{stage.description}</p>
                    </div>
                    {index < requirements.timeline.length - 1 && (
                      <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-border transform translate-x-1/2"></div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-primary/10 to-orange-400/10 text-center">
            <CardContent className="pt-8 pb-8">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Ready to Apply?</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Make sure you have all the required documents ready before starting your application. 
                  The application process takes about 5 minutes to complete.
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <Button variant="hero" size="lg" className="text-lg px-8 py-6" onClick={() => navigate('/inclab')}>
                    Start Application
                  </Button>
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                    Download Checklist
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Questions? Email us at applications@xicombinator.com
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="bg-card border-t border-border py-12 mt-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">IC</span>
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                    Xi Combinator
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">
                  Empowering crazy founders to build scalable solutions for India's biggest challenges.
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">Programs</h4>
                <div className="space-y-2 text-sm">
                  <a href="/mvp-lab" className="block text-muted-foreground hover:text-primary cursor-pointer">MVP Lab</a>
                  <a href="/incubation" className="block text-muted-foreground hover:text-primary cursor-pointer">Incubation</a>
                  <a href="/hackathon" className="block text-muted-foreground hover:text-primary cursor-pointer">Hackathon Track</a>
                  <a href="/inclab" className="block text-muted-foreground hover:text-primary cursor-pointer">Xi Lab</a>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">Resources</h4>
                <div className="space-y-2 text-sm">
                  <a href="/resources" className="block text-muted-foreground hover:text-primary cursor-pointer">Resources</a>
                  <a href="/partnership" className="block text-muted-foreground hover:text-primary cursor-pointer">Partnership</a>
                  <a href="/deals" className="block text-muted-foreground hover:text-primary cursor-pointer">Deals & Offers</a>
                  <a href="/startup-directory" className="block text-muted-foreground hover:text-primary cursor-pointer">Startup Directory</a>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">Connect</h4>
                <div className="space-y-2 text-sm">
                  <a href="/about" className="block text-muted-foreground hover:text-primary cursor-pointer">About Us</a>
                  <a href="/contact" className="block text-muted-foreground hover:text-primary cursor-pointer">Contact</a>
                  <a href="/meet-cofounder" className="block text-muted-foreground hover:text-primary cursor-pointer">Meet Co-founder</a>
                  <a href="/investor-centre" className="block text-muted-foreground hover:text-primary cursor-pointer">Investor Centre</a>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">Community</h4>
                <div className="space-y-2 text-sm">
                  <a href="/blogs" className="block text-muted-foreground hover:text-primary cursor-pointer">Blogs</a>
                  <a href="/news" className="block text-muted-foreground hover:text-primary cursor-pointer">News</a>
                  <a href="/privacy-policy" className="block text-muted-foreground hover:text-primary cursor-pointer">Privacy Policy</a>
                  <a href="/terms-conditions" className="block text-muted-foreground hover:text-primary cursor-pointer">Terms & Conditions</a>
                </div>
              </div>
            </div>
            
            <div className="border-t border-border mt-8 pt-8 text-center">
              <p className="text-sm text-muted-foreground">
                © 2024 Xi Combinator. Inspired by the vision of transforming India through innovation.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default RequirementsDetail;