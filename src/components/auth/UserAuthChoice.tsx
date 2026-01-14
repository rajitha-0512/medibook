import { motion } from "framer-motion";
import { ArrowLeft, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

interface UserAuthChoiceProps {
  onBack: () => void;
  onSignIn: () => void;
  onRegister: () => void;
}

const UserAuthChoice = ({ onBack, onSignIn, onRegister }: UserAuthChoiceProps) => {
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
        <h2 className="text-xl font-bold text-foreground">User</h2>
      </motion.div>

      <motion.div
        className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <img src={logo} alt="MediBook" className="w-20 h-20 mb-6" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Welcome</h1>
        <p className="text-muted-foreground text-center mb-10">
          Sign in to your account or create a new one
        </p>

        <div className="w-full space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Button
              variant="hero"
              size="xl"
              className="w-full flex items-center justify-center gap-4"
              onClick={onSignIn}
            >
              <LogIn className="w-6 h-6" />
              <span className="text-xl font-bold">Sign In</span>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Button
              variant="heroOutline"
              size="xl"
              className="w-full flex items-center justify-center gap-4"
              onClick={onRegister}
            >
              <UserPlus className="w-6 h-6" />
              <span className="text-xl font-bold">Register</span>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserAuthChoice;
