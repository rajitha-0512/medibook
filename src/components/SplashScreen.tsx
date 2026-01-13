import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateLogo = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("generate-logo", {
          body: {
            prompt: "Generate a modern healthcare mobile app logo icon. Feature a stylized medical cross combined elegantly with a heart shape. Use a beautiful teal to cyan gradient. Ultra clean minimalist design with smooth curves. Square format, professional app icon style, centered on pure white background. No text, just the icon symbol."
          }
        });

        if (error) throw error;
        if (data?.imageUrl) {
          setLogoUrl(data.imageUrl);
        }
      } catch (error) {
        console.error("Error generating logo:", error);
      } finally {
        setIsLoading(false);
      }
    };

    generateLogo();
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center gradient-hero"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex flex-col items-center gap-6"
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 1.2,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        onAnimationComplete={() => {
          setTimeout(onComplete, 1200);
        }}
      >
        <motion.div
          className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden shadow-xl bg-card flex items-center justify-center"
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {isLoading ? (
            <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          ) : logoUrl ? (
            <img
              src={logoUrl}
              alt="MediBook Logo"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center">
              <span className="text-4xl font-bold text-primary-foreground">M</span>
            </div>
          )}
        </motion.div>
        <motion.div
          className="text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gradient-primary tracking-tight">
            MediBook
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Your Health, Our Priority
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;