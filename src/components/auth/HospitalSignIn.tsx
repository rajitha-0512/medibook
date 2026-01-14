import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Hash, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/logo.png";

interface HospitalSignInProps {
  onBack: () => void;
  onSignInSuccess: () => void;
}

const HospitalSignIn = ({ onBack, onSignInSuccess }: HospitalSignInProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [hospitalId, setHospitalId] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (hospitalId && password) {
      onSignInSuccess();
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex flex-col px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4 mb-8"
      >
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h2 className="text-xl font-bold text-foreground">Hospital Sign In</h2>
      </motion.div>

      <motion.div
        className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <img src={logo} alt="MediBook" className="w-16 h-16 mb-6" />

        <form onSubmit={handleSignIn} className="w-full space-y-6">
          <div className="space-y-2">
            <Label htmlFor="hospitalId" className="text-foreground font-medium">
              Hospital ID
            </Label>
            <div className="relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="hospitalId"
                type="text"
                placeholder="Enter your hospital ID"
                value={hospitalId}
                onChange={(e) => setHospitalId(e.target.value)}
                className="pl-12 h-12 bg-card border-border"
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
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <Button type="submit" variant="hero" size="lg" className="w-full mt-4">
            Sign In
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default HospitalSignIn;
