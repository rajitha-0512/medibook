import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import SplashScreen from "@/components/SplashScreen";
import LandingChoice from "@/components/LandingChoice";
import UserAuthChoice from "@/components/auth/UserAuthChoice";
import UserSignIn from "@/components/auth/UserSignIn";
import UserRegister from "@/components/auth/UserRegister";
import HospitalAuthChoice from "@/components/auth/HospitalAuthChoice";
import HospitalSignIn from "@/components/auth/HospitalSignIn";
import HospitalRegister from "@/components/auth/HospitalRegister";
import UserDashboard from "@/components/dashboard/UserDashboard";
import HospitalDashboard from "@/components/dashboard/HospitalDashboard";
import { UserProfile, HospitalProfile } from "@/types/user";

type Screen =
  | "splash"
  | "choice"
  | "userAuthChoice"
  | "userSignIn"
  | "userRegister"
  | "hospitalAuthChoice"
  | "hospitalSignIn"
  | "hospitalRegister"
  | "userDashboard"
  | "hospitalDashboard";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [hospitalProfile, setHospitalProfile] = useState<HospitalProfile | null>(null);

  const handleSplashComplete = () => {
    setCurrentScreen("choice");
  };

  const handleUserClick = () => {
    setCurrentScreen("userAuthChoice");
  };

  const handleHospitalClick = () => {
    setCurrentScreen("hospitalAuthChoice");
  };

  const handleUserSignIn = () => {
    setCurrentScreen("userSignIn");
  };

  const handleUserRegister = () => {
    setCurrentScreen("userRegister");
  };

  const handleHospitalSignIn = () => {
    setCurrentScreen("hospitalSignIn");
  };

  const handleHospitalRegister = () => {
    setCurrentScreen("hospitalRegister");
  };

  const handleUserAuthSuccess = (userData?: UserProfile) => {
    if (userData) {
      setUserProfile(userData);
    } else {
      // For sign in, set default profile (in real app, fetch from backend)
      setUserProfile({
        name: "User",
        age: "",
        gender: "",
        phone: "",
      });
    }
    setCurrentScreen("userDashboard");
  };

  const handleHospitalAuthSuccess = (hospitalData?: HospitalProfile) => {
    if (hospitalData) {
      setHospitalProfile(hospitalData);
    } else {
      // For sign in, set default profile (in real app, fetch from backend)
      setHospitalProfile({
        hospitalName: "Hospital",
        mobileNumber: "",
        hospitalCode: "",
        location: "",
        qrDetails: "",
      });
    }
    setCurrentScreen("hospitalDashboard");
  };

  const handleLogout = () => {
    setUserProfile(null);
    setHospitalProfile(null);
    setCurrentScreen("choice");
  };

  const handleBackToChoice = () => {
    setCurrentScreen("choice");
  };

  const handleBackToUserAuth = () => {
    setCurrentScreen("userAuthChoice");
  };

  const handleBackToHospitalAuth = () => {
    setCurrentScreen("hospitalAuthChoice");
  };

  const handleUserProfileUpdate = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
  };

  const handleHospitalProfileUpdate = (updatedProfile: HospitalProfile) => {
    setHospitalProfile(updatedProfile);
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
            onUserClick={handleUserClick}
            onHospitalClick={handleHospitalClick}
          />
        )}

        {currentScreen === "userAuthChoice" && (
          <UserAuthChoice
            key="userAuthChoice"
            onBack={handleBackToChoice}
            onSignIn={handleUserSignIn}
            onRegister={handleUserRegister}
          />
        )}

        {currentScreen === "userSignIn" && (
          <UserSignIn
            key="userSignIn"
            onBack={handleBackToUserAuth}
            onSignInSuccess={() => handleUserAuthSuccess()}
          />
        )}

        {currentScreen === "userRegister" && (
          <UserRegister
            key="userRegister"
            onBack={handleBackToUserAuth}
            onRegisterSuccess={(userData) => handleUserAuthSuccess(userData)}
          />
        )}

        {currentScreen === "hospitalAuthChoice" && (
          <HospitalAuthChoice
            key="hospitalAuthChoice"
            onBack={handleBackToChoice}
            onSignIn={handleHospitalSignIn}
            onRegister={handleHospitalRegister}
          />
        )}

        {currentScreen === "hospitalSignIn" && (
          <HospitalSignIn
            key="hospitalSignIn"
            onBack={handleBackToHospitalAuth}
            onSignInSuccess={() => handleHospitalAuthSuccess()}
          />
        )}

        {currentScreen === "hospitalRegister" && (
          <HospitalRegister
            key="hospitalRegister"
            onBack={handleBackToHospitalAuth}
            onRegisterSuccess={(hospitalData) => handleHospitalAuthSuccess(hospitalData)}
          />
        )}

        {currentScreen === "userDashboard" && userProfile && (
          <UserDashboard
            key="userDashboard"
            onLogout={handleLogout}
            userProfile={userProfile}
            onProfileUpdate={handleUserProfileUpdate}
          />
        )}

        {currentScreen === "hospitalDashboard" && hospitalProfile && (
          <HospitalDashboard
            key="hospitalDashboard"
            onLogout={handleLogout}
            hospitalProfile={hospitalProfile}
            onProfileUpdate={handleHospitalProfileUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
