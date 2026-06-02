
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users, Calendar, Globe, ExternalLink } from "lucide-react";

interface StartupProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  startup: {
    id: number;
    name: string;
    description: string;
    sector: string;
    stage: string;
    location: string;
    founded: string;
    employees: string;
    website: string;
    logo: string;
    tags: string[];
  };
  onConnect: () => void;
}

const StartupProfileDialog = ({ open, onOpenChange, startup, onConnect }: StartupProfileDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-4">
            <span className="text-4xl">{startup.logo}</span>
            <div>
              <h2 className="text-2xl font-bold">{startup.name}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline">{startup.stage}</Badge>
                <Badge variant="secondary">{startup.sector}</Badge>
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>
            {startup.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Company Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{startup.location}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Founded</p>
                    <p className="font-medium">{startup.founded}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Team Size</p>
                    <p className="font-medium">{startup.employees}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Website</p>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto font-medium"
                      onClick={() => window.open(`https://${startup.website}`, '_blank')}
                    >
                      {startup.website}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">Focus Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {startup.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">About the Company</h4>
                  <p className="text-sm text-muted-foreground">
                    {startup.description} This startup is part of the Xi Combinator portfolio, 
                    working on innovative solutions in the {startup.sector} space.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex space-x-4">
            <Button onClick={onConnect} className="flex-1">
              Connect with Team
            </Button>
            <Button variant="outline" onClick={() => window.open(`https://${startup.website}`, '_blank')}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit Website
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StartupProfileDialog;
