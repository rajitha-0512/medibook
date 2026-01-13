import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, User, Calendar, Phone, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Hospital {
  id: string;
  name: string;
  location: string;
  status: "open" | "closed";
  rating: number;
  image: string;
  specialties: string[];
}

interface BookingFormProps {
  hospital: Hospital;
  onBack: () => void;
  onSubmit: (success: boolean) => void;
}

const BookingForm = ({ hospital, onBack, onSubmit }: BookingFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    problem: "",
  });
  const [showPayment, setShowPayment] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(formData).every((val) => val.trim() !== "")) {
      setShowPayment(true);
    }
  };

  const handlePayment = (success: boolean) => {
    onSubmit(success);
  };

  if (showPayment) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <motion.header
          className="bg-card px-6 pt-12 pb-6 border-b border-border"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setShowPayment(false)}>
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h2 className="text-xl font-bold text-foreground">Payment</h2>
          </div>
        </motion.header>

        <motion.div
          className="flex-1 flex flex-col items-center justify-center px-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="bg-card rounded-2xl p-8 shadow-card border border-border text-center max-w-sm w-full">
            <div className="w-48 h-48 mx-auto mb-6 bg-secondary rounded-xl flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground text-sm mb-2">Scan QR to Pay</p>
                <div className="w-32 h-32 bg-foreground/5 rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">QR Code</span>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-foreground mb-2">{hospital.name}</h3>
            <p className="text-2xl font-bold text-primary mb-6">₹800</p>
            
            <p className="text-sm text-muted-foreground mb-6">
              Complete payment using any UPI app
            </p>

            <div className="flex gap-4">
              <Button
                variant="destructive"
                size="lg"
                className="flex-1"
                onClick={() => handlePayment(false)}
              >
                Cancel
              </Button>
              <Button
                variant="success"
                size="lg"
                className="flex-1"
                onClick={() => handlePayment(true)}
              >
                I've Paid
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <motion.header
        className="bg-card px-6 pt-12 pb-6 border-b border-border"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-foreground">Book Appointment</h2>
            <p className="text-sm text-muted-foreground">{hospital.name}</p>
          </div>
        </div>
      </motion.header>

      <motion.form
        className="px-6 py-6 space-y-5"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="space-y-2">
          <Label htmlFor="name" className="text-foreground font-medium">
            Full Name
          </Label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              className="pl-12 h-12 bg-card border-border"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age" className="text-foreground font-medium">
              Age
            </Label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="age"
                name="age"
                type="number"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                className="pl-12 h-12 bg-card border-border"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground font-medium">Gender</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
            >
              <SelectTrigger className="h-12 bg-card border-border">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-foreground font-medium">
            Phone Number
          </Label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
              className="pl-12 h-12 bg-card border-border"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="problem" className="text-foreground font-medium">
            Problem / Symptoms
          </Label>
          <div className="relative">
            <AlertCircle className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
            <Textarea
              id="problem"
              name="problem"
              placeholder="Describe your symptoms or health concern..."
              value={formData.problem}
              onChange={handleChange}
              className="pl-12 min-h-[120px] bg-card border-border resize-none"
              required
            />
          </div>
        </div>

        <Button type="submit" variant="hero" size="lg" className="w-full mt-6">
          Proceed to Payment
        </Button>
      </motion.form>
    </div>
  );
};

export default BookingForm;