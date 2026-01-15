import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Phone, Lock, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserProfile } from "@/types/user";
import logo from "@/assets/logo.png";

interface UserRegisterProps {
  onBack: () => void;
  onRegisterSuccess: (userData: UserProfile) => void;
}

const UserRegister = ({ onBack, onRegisterSuccess }: UserRegisterProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    password: "",
  });

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, password }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(formData).every((val) => val.trim() !== "")) {
      onRegisterSuccess({
        name: formData.name,
        age: formData.age,
        gender: formData.gender,
        phone: formData.phone,
      });
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
        <h2 className="text-xl font-bold text-foreground">User Registration</h2>
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
            Create your account to book appointments
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
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
                min="1"
                max="120"
                placeholder="Enter your age"
                value={formData.age}
                onChange={handleChange}
                className="pl-12 h-12 bg-card border-border"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender" className="text-foreground font-medium">
              Gender
            </Label>
            <Select value={formData.gender} onValueChange={handleGenderChange}>
              <SelectTrigger className="h-12 bg-card border-border">
                <SelectValue placeholder="Select your gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
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
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                className="pl-12 h-12 bg-card border-border"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-foreground font-medium">
                Password
              </Label>
              <button
                type="button"
                onClick={generatePassword}
                className="text-primary font-medium text-sm hover:underline"
              >
                Generate Password
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter or generate password"
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
            Register
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default UserRegister;
