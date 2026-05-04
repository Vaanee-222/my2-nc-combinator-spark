
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Video, BookOpen, Users, Lightbulb, Target, TrendingUp, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Resources = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDownload = (resourceName: string, downloadUrl?: string) => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    } else {
      toast({
        title: "Download Started",
        description: `${resourceName} is being downloaded to your device.`,
      });
    }
  };

  const handleAccessGuide = () => {
    toast({
      title: "Access Guide",
      description: "The comprehensive resource access guide has been sent to your email.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-4">
            Startup Resources
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Access our comprehensive collection of tools, guides, and resources to accelerate your startup journey.
          </p>
        </section>

        {/* Quick Access Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-all duration-300">
            <CardContent className="pt-6">
              <Download className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Download Center</h3>
              <p className="text-muted-foreground mb-4">Access all our startup tools and templates</p>
              <Button onClick={() => handleDownload("Startup Toolkit", "#toolkit")}>
                Get Toolkit
              </Button>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-lg transition-all duration-300">
            <CardContent className="pt-6">
              <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Learning Hub</h3>
              <p className="text-muted-foreground mb-4">Educational content and guides</p>
              <Button onClick={handleAccessGuide}>
                Access Resources
              </Button>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-lg transition-all duration-300">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-muted-foreground mb-4">Connect with fellow entrepreneurs</p>
              <Button onClick={() => navigate('/meet-cofounder')}>
                Join Community
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Resource Categories */}
        <div className="space-y-12">
          {/* Startup Essentials */}
          <section>
            <h2 className="text-3xl font-bold mb-6 flex items-center space-x-2">
              <Lightbulb className="h-8 w-8 text-primary" />
              <span>Startup Essentials</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Business Plan Template</span>
                  </CardTitle>
                  <CardDescription>
                    Comprehensive template to create your business plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">PDF</Badge>
                    <Button size="sm" onClick={() => handleDownload("Business Plan Template")}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Pitch Deck Template</span>
                  </CardTitle>
                  <CardDescription>
                    Investor-ready pitch deck template with examples
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">PPTX</Badge>
                    <Button size="sm" onClick={() => handleDownload("Pitch Deck Template")}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Financial Model</span>
                  </CardTitle>
                  <CardDescription>
                    3-year financial projection template
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">XLSX</Badge>
                    <Button size="sm" onClick={() => handleDownload("Financial Model Template")}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Legal & Compliance */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Legal & Compliance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle>Incorporation Guide</CardTitle>
                  <CardDescription>
                    Step-by-step guide to incorporate your startup in India
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Private Limited</Badge>
                    <Badge variant="outline">LLP</Badge>
                    <Badge variant="outline">One Person Company</Badge>
                  </div>
                  <Button onClick={() => handleDownload("Incorporation Guide")}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Guide
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle>Legal Templates</CardTitle>
                  <CardDescription>
                    Essential legal documents and agreements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Co-founder Agreement</Badge>
                    <Badge variant="outline">Employee Contracts</Badge>
                    <Badge variant="outline">NDA Templates</Badge>
                  </div>
                  <Button onClick={() => handleDownload("Legal Templates Pack")}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Pack
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Video Resources */}
          <section>
            <h2 className="text-3xl font-bold mb-6 flex items-center space-x-2">
              <Video className="h-8 w-8 text-primary" />
              <span>Video Library</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle>Fundraising Masterclass</CardTitle>
                  <CardDescription>
                    Learn from successful founders about raising capital
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">2 hrs</Badge>
                    <Button size="sm" onClick={() => window.open('https://youtube.com/watch?v=example', '_blank')}>
                      <Video className="h-4 w-4 mr-2" />
                      Watch
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle>Product Development</CardTitle>
                  <CardDescription>
                    Building products that customers love
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">1.5 hrs</Badge>
                    <Button size="sm" onClick={() => window.open('https://youtube.com/watch?v=example2', '_blank')}>
                      <Video className="h-4 w-4 mr-2" />
                      Watch
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle>Scaling Your Startup</CardTitle>
                  <CardDescription>
                    Growth strategies and operational excellence
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">3 hrs</Badge>
                    <Button size="sm" onClick={() => window.open('https://youtube.com/watch?v=example3', '_blank')}>
                      <Video className="h-4 w-4 mr-2" />
                      Watch
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Application Guides */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Application Support</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle>How to Access Resources</CardTitle>
                  <CardDescription>
                    Complete guide on accessing and utilizing our resource library
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="text-sm space-y-2">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Register on our platform</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Browse resource categories</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Download templates and guides</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Join our community for support</span>
                    </li>
                  </ul>
                  <Button onClick={handleAccessGuide}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Get Access Guide
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle>Start Your Application</CardTitle>
                  <CardDescription>
                    Ready to join IC Combinator? Start your application process here
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Application Process:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Complete online application</li>
                      <li>• Submit required documents</li>
                      <li>• Interview with our team</li>
                      <li>• Final selection</li>
                    </ul>
                  </div>
                  <Button onClick={() => navigate('/incubation')} className="w-full">
                    Start Application
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>

        {/* CTA Section */}
        <section className="text-center py-16 mt-16 bg-gradient-to-r from-primary/10 to-orange-400/10 rounded-3xl">
          <h2 className="text-3xl font-bold mb-4">Need More Resources?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our community and get access to exclusive content, mentorship, and networking opportunities.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="bg-gradient-to-r from-primary to-orange-400 hover:shadow-orange-glow" onClick={() => navigate('/incubation')}>
              Join IC Combinator
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/contact')}>
              Contact Support
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Resources;
