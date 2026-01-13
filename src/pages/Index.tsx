import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import SplashScreen from "@/components/SplashScreen";
import LandingChoice from "@/components/LandingChoice";
import UserRegister from "@/components/auth/UserRegister";
import HospitalRegister from "@/components/auth/HospitalRegister";
import UserDashboard from "@/components/dashboard/UserDashboard";
import HospitalDashboard from "@/components/dashboard/HospitalDashboard";

type Screen = 
  | "splash"
  | "choice"
  | "userRegister"
  | "hospitalRegister"
  | "userDashboard"
  | "hospitalDashboard";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash");

  const handleSplashComplete = () => {
    setCurrentScreen("choice");
  };

  const handleUserRegister = () => {
    setCurrentScreen("userRegister");
  };

  const handleHospitalRegister = () => {
    setCurrentScreen("hospitalRegister");
  };

  const handleUserRegisterSuccess = () => {
    setCurrentScreen("userDashboard");
  };

  const handleHospitalRegisterSuccess = () => {
    setCurrentScreen("hospitalDashboard");
  };

  const handleLogout = () => {
    setCurrentScreen("choice");
  };

  const handleBack = () => {
    setCurrentScreen("choice");
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {currentScreen === "splash" && (
          <SplashScreen key="splash" onComplete={handleSplashComplete} />
        )}

        {currentScreen === "choice" && (
          <LandingChoice
            key="choice"
            onUserRegister={handleUserRegister}
            onHospitalRegister={handleHospitalRegister}
          />
        )}

        {currentScreen === "userRegister" && (
          <UserRegister
            key="userRegister"
            onBack={handleBack}
            onRegisterSuccess={handleUserRegisterSuccess}
          />
        )}

        {currentScreen === "hospitalRegister" && (
          <HospitalRegister
            key="hospitalRegister"
            onBack={handleBack}
            onRegisterSuccess={handleHospitalRegisterSuccess}
          />
        )}

        {currentScreen === "userDashboard" && (
          <UserDashboard key="userDashboard" onLogout={handleLogout} />
        )}

        {currentScreen === "hospitalDashboard" && (
          <HospitalDashboard key="hospitalDashboard" onLogout={handleLogout} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;