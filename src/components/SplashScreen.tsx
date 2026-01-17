import { motion } from "framer-motion";
import logo from "@/assets/logo.png";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
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
          <img
            src={logo}
            alt="MediBook Logo"
            className="w-full h-full object-cover"
          />
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
