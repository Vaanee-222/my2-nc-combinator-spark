
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

interface PersonalInfoSectionProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

const PersonalInfoSection = ({ formData, onInputChange }: PersonalInfoSectionProps) => {
  return (
    <Card className="p-6 bg-card-gradient border-border">
      <h3 className="text-xl font-semibold mb-4 text-primary">Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => onInputChange("fullName", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onInputChange("email", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => onInputChange("phone", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="age">Age *</Label>
          <Input
            id="age"
            type="number"
            value={formData.age}
            onChange={(e) => onInputChange("age", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => onInputChange("city", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="college">College/University</Label>
          <Input
            id="college"
            value={formData.college}
            onChange={(e) => onInputChange("college", e.target.value)}
          />
        </div>
      </div>
      <div className="mt-4">
        <Label htmlFor="graduation">Graduation Year</Label>
        <Select onValueChange={(value) => onInputChange("graduation", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select graduation year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2026">2026</SelectItem>
            <SelectItem value="2026">2026</SelectItem>
            <SelectItem value="2026">2026</SelectItem>
            <SelectItem value="2027">2027</SelectItem>
            <SelectItem value="working">Working Professional</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
};

export default PersonalInfoSection;
