import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface LandingChoiceProps {
  onUserRegister: () => void;
  onHospitalRegister: () => void;
}

const LandingChoice = ({ onUserRegister, onHospitalRegister }: LandingChoiceProps) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    // Try to get cached logo or generate new one
    const cachedLogo = sessionStorage.getItem("medibook-logo");
    if (cachedLogo) {
      setLogoUrl(cachedLogo);
    } else {
      generateLogo();
    }
  }, []);

  const generateLogo = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("generate-logo", {
        body: {
          prompt: "Generate a modern healthcare mobile app logo icon. Feature a stylized medical cross combined elegantly with a heart shape. Use a beautiful teal to cyan gradient. Ultra clean minimalist design with smooth curves. Square format, professional app icon style, centered on pure white background. No text, just the icon symbol."
        }
      });

      if (!error && data?.imageUrl) {
        setLogoUrl(data.imageUrl);
        sessionStorage.setItem("medibook-logo", data.imageUrl);
      }
    } catch (error) {
      console.error("Error generating logo:", error);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        className="flex flex-col items-center max-w-md w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo and Title */}
        <motion.div
          className="w-20 h-20 mb-4 rounded-2xl overflow-hidden shadow-lg bg-card flex items-center justify-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {logoUrl ? (
            <img src={logoUrl} alt="MediBook" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full gradient-primary flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">M</span>
            </div>
          )}
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gradient-primary mb-2">
          MediBook
        </h1>
        <p className="text-muted-foreground text-center mb-12">
          Book doctor appointments with ease
        </p>

        {/* Choice Cards */}
        <div className="w-full space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Button
              variant="hero"
              size="xl"
              className="w-full flex items-center justify-center gap-4"
              onClick={onUserRegister}
            >
              <User className="w-6 h-6" />
              <span className="text-xl font-bold">Register as a User</span>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Button
              variant="heroOutline"
              size="xl"
              className="w-full flex items-center justify-center gap-4"
              onClick={onHospitalRegister}
            >
              <Building2 className="w-6 h-6" />
              <span className="text-xl font-bold">Register as Hospital</span>
            </Button>
          </motion.div>
        </div>

        {/* Footer Text */}
        <motion.p
          className="text-sm text-muted-foreground mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          By continuing, you agree to our Terms of Service and Privacy Policy
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LandingChoice;