import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-4">
            Terms & Conditions
          </h1>
          <p className="text-muted-foreground">Last updated: December 21, 2024</p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                By accessing and using Inc Combinator's platform and services, you accept and agree to be bound by 
                the terms and provision of this agreement. If you do not agree to these terms, you should not use 
                our services.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Description of Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Inc Combinator provides an accelerator platform that offers:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Startup incubation and acceleration programs</li>
                <li>Mentorship and advisory services</li>
                <li>Networking opportunities with investors and entrepreneurs</li>
                <li>Educational resources and workshops</li>
                <li>Co-founder matching services</li>
                <li>Access to exclusive deals and partnerships</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. User Responsibilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">As a user of our platform, you agree to:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Provide accurate and truthful information</li>
                  <li>Maintain the confidentiality of your account credentials</li>
                  <li>Respect intellectual property rights</li>
                  <li>Not engage in fraudulent or illegal activities</li>
                  <li>Follow community guidelines and professional conduct</li>
                  <li>Not spam or harass other users</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Application Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Participation in Inc Combinator programs is subject to an application and selection process:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Applications must be complete and accurate</li>
                <li>Selection decisions are at Inc Combinator's sole discretion</li>
                <li>No guarantee of acceptance into any program</li>
                <li>Application materials become property of Inc Combinator</li>
                <li>We reserve the right to verify all information provided</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Our Content:</h4>
                <p className="text-muted-foreground mb-4">
                  All content on our platform, including text, graphics, logos, and software, is owned by 
                  Inc Combinator and protected by copyright and trademark laws.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Your Content:</h4>
                <p className="text-muted-foreground">
                  You retain ownership of content you submit, but grant us a license to use, modify, and 
                  distribute it for platform operations and program purposes.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Program Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">Participation in Inc Combinator programs involves:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Commitment to program duration and requirements</li>
                  <li>Participation in mentorship sessions and workshops</li>
                  <li>Potential equity arrangements as per program terms</li>
                  <li>Compliance with program guidelines and deadlines</li>
                  <li>Regular reporting and progress updates</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Privacy and Confidentiality</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We respect your privacy and handle personal information according to our Privacy Policy. 
                Confidential information shared during programs will be protected, but public presentations 
                and demo days may be recorded and shared.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Payment Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">For paid services:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Fees are due as specified in program agreements</li>
                  <li>Refunds are subject to specific program terms</li>
                  <li>Late payments may result in program suspension</li>
                  <li>All fees are in Indian Rupees unless otherwise stated</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Inc Combinator provides services "as is" without warranties. We are not liable for any 
                indirect, incidental, or consequential damages arising from your use of our services. 
                Our total liability is limited to the amount paid for services.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Termination</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">We may terminate or suspend access to our services:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>For violation of these terms</li>
                  <li>For fraudulent or illegal activity</li>
                  <li>For non-payment of fees</li>
                  <li>At our discretion with reasonable notice</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Dispute Resolution</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Any disputes arising from these terms will be resolved through arbitration in Bangalore, 
                Karnataka, India, under Indian law. You agree to attempt mediation before pursuing 
                formal legal action.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>12. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We reserve the right to modify these terms at any time. Material changes will be 
                communicated via email or platform notifications. Continued use after changes 
                constitutes acceptance of new terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>13. Governing Law</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                These terms are governed by the laws of India and the courts of Bangalore, Karnataka 
                shall have exclusive jurisdiction over any disputes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-muted-foreground">
                <p>For questions about these Terms & Conditions, contact us:</p>
                <p><strong>Email:</strong> legal@inccombinator.com</p>
                <p><strong>Address:</strong> Inc Combinator, 123 Innovation Street, Bangalore, Karnataka 560001</p>
                <p><strong>Phone:</strong> +91 80 1234 5678</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsConditions;