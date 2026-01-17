import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Building2, Phone, MapPin, QrCode, Hash, Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HospitalProfile } from "@/types/user";
import logo from "@/assets/logo.png";

interface HospitalRegisterProps {
  onBack: () => void;
  onRegisterSuccess: (hospitalData: HospitalProfile) => void;
}

const HospitalRegister = ({ onBack, onRegisterSuccess }: HospitalRegisterProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    hospitalName: "",
    mobileNumber: "",
    hospitalCode: "",
    location: "",
    qrDetails: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(formData).every((val) => val.trim() !== "")) {
      const hospitalData: HospitalProfile = {
        hospitalName: formData.hospitalName,
        mobileNumber: formData.mobileNumber,
        hospitalCode: formData.hospitalCode,
        location: formData.location,
        qrDetails: formData.qrDetails,
      };
      // Persist to localStorage keyed by hospital code
      const hospitals = JSON.parse(localStorage.getItem("medibook-hospitals") || "{}");
      hospitals[formData.hospitalCode] = { ...hospitalData, password: formData.password };
      localStorage.setItem("medibook-hospitals", JSON.stringify(hospitals));
      
      onRegisterSuccess(hospitalData);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex flex-col px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4 mb-6"
      >
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h2 className="text-xl font-bold text-foreground">Hospital Registration</h2>
      </motion.div>

      <motion.div
        className="flex-1 max-w-md mx-auto w-full overflow-y-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="MediBook" className="w-14 h-14 mb-3" />
          <p className="text-muted-foreground text-center text-sm">
            Register your hospital to start managing appointments
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="hospitalName" className="text-foreground font-medium">
              Hospital Name
            </Label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="hospitalName"
                name="hospitalName"
                placeholder="Enter hospital name"
                value={formData.hospitalName}
                onChange={handleChange}
                className="pl-12 h-12 bg-card border-border"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobileNumber" className="text-foreground font-medium">
              Mobile Number
            </Label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="mobileNumber"
                name="mobileNumber"
                type="tel"
                placeholder="Enter mobile number"
                value={formData.mobileNumber}
                onChange={handleChange}
                className="pl-12 h-12 bg-card border-border"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hospitalCode" className="text-foreground font-medium">
              Hospital Code
            </Label>
            <div className="relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="hospitalCode"
                name="hospitalCode"
                placeholder="Enter unique hospital code"
                value={formData.hospitalCode}
                onChange={handleChange}
                className="pl-12 h-12 bg-card border-border"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-foreground font-medium">
              Location
            </Label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="location"
                name="location"
                placeholder="Enter hospital address"
                value={formData.location}
                onChange={handleChange}
                className="pl-12 h-12 bg-card border-border"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="qrDetails" className="text-foreground font-medium">
              QR Payment Details
            </Label>
            <div className="relative">
              <QrCode className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
              <Textarea
                id="qrDetails"
                name="qrDetails"
                placeholder="Enter UPI ID or payment QR details"
                value={formData.qrDetails}
                onChange={handleChange}
                className="pl-12 min-h-[80px] bg-card border-border resize-none"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                className="pl-12 pr-12 h-12 bg-card border-border"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button type="submit" variant="hero" size="lg" className="w-full mt-6">
            Register Hospital
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default HospitalRegister;
