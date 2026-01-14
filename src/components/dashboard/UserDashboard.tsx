import { useState } from "react";
import { motion } from "framer-motion";
import { User, Calendar, Clock, Search, LogOut, Star, ChevronRight, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import HospitalCarousel from "./HospitalCarousel";
import HospitalSearch from "./HospitalSearch";
import HospitalDetails, { Doctor } from "./HospitalDetails";
import SlotSelection from "./SlotSelection";
import QRPayment from "./QRPayment";
import PaymentStatus from "./PaymentStatus";

interface UserDashboardProps {
  onLogout: () => void;
}

type View = "dashboard" | "search" | "hospitalDetails" | "slotSelection" | "payment" | "paymentStatus";

interface Hospital {
  id: string;
  name: string;
  location: string;
  status: "open" | "closed";
  rating: number;
  image: string;
  specialties: string[];
}

interface Slot {
  id: string;
  time: string;
  date: string;
  available: boolean;
}

interface BookingDetails {
  doctorName: string;
  specialization: string;
  date: string;
  time: string;
  hospitalName: string;
  fee: number;
}

const UserDashboard = ({ onLogout }: UserDashboardProps) => {
  const [view, setView] = useState<View>("dashboard");
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);

  const userProfile = {
    name: "John Doe",
    phone: "+91 9876543210",
    email: "john@example.com",
  };

  const currentBookings = [
    {
      id: "1",
      hospital: "Apollo Hospital",
      doctor: "Dr. Sarah Smith",
      date: "Jan 15, 2026",
      time: "10:30 AM",
      status: "confirmed",
    },
  ];

  const recentBookings = [
    {
      id: "2",
      hospital: "Max Healthcare",
      doctor: "Dr. John Wilson",
      date: "Jan 10, 2026",
      time: "2:00 PM",
      status: "completed",
    },
    {
      id: "3",
      hospital: "Fortis Hospital",
      doctor: "Dr. Priya Patel",
      date: "Jan 5, 2026",
      time: "11:00 AM",
      status: "completed",
    },
  ];

  const handleHospitalSelect = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setView("hospitalDetails");
  };

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setView("slotSelection");
  };

  const handleSlotSelect = (slot: Slot) => {
    setSelectedSlot(slot);
    setView("payment");
  };

  const handlePaymentComplete = (success: boolean) => {
    setPaymentSuccess(success);
    if (success && selectedDoctor && selectedSlot && selectedHospital) {
      setBookingDetails({
        doctorName: selectedDoctor.name,
        specialization: selectedDoctor.specialization,
        date: selectedSlot.date,
        time: selectedSlot.time,
        hospitalName: selectedHospital.name,
        fee: selectedDoctor.fee,
      });
    }
    setView("paymentStatus");
  };

  const resetToDashboard = () => {
    setView("dashboard");
    setSelectedHospital(null);
    setSelectedDoctor(null);
    setSelectedSlot(null);
    setPaymentSuccess(false);
    setBookingDetails(null);
  };

  if (view === "search") {
    return (
      <HospitalSearch
        onBack={() => setView("dashboard")}
        onHospitalSelect={handleHospitalSelect}
      />
    );
  }

  if (view === "hospitalDetails" && selectedHospital) {
    return (
      <HospitalDetails
        hospital={selectedHospital}
        onBack={() => setView("dashboard")}
        onDoctorSelect={handleDoctorSelect}
      />
    );
  }

  if (view === "slotSelection" && selectedDoctor && selectedHospital) {
    return (
      <SlotSelection
        doctor={selectedDoctor}
        hospitalName={selectedHospital.name}
        onBack={() => setView("hospitalDetails")}
        onSlotSelect={handleSlotSelect}
      />
    );
  }

  if (view === "payment" && selectedDoctor && selectedSlot && selectedHospital) {
    return (
      <QRPayment
        doctor={selectedDoctor}
        slot={selectedSlot}
        hospitalName={selectedHospital.name}
        onBack={() => setView("slotSelection")}
        onPaymentComplete={handlePaymentComplete}
      />
    );
  }

  if (view === "paymentStatus") {
    return (
      <PaymentStatus
        success={paymentSuccess}
        onContinue={resetToDashboard}
        bookingDetails={bookingDetails || undefined}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Hospital Theme */}
      <motion.header
        className="gradient-primary px-6 pt-12 pb-8 rounded-b-3xl relative overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Medical Cross Pattern */}
        <div className="absolute top-4 right-4 opacity-20">
          <Stethoscope className="w-20 h-20 text-primary-foreground" />
        </div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-primary-foreground/80 text-sm">Welcome back,</p>
            <h1 className="text-2xl font-bold text-primary-foreground">{userProfile.name}</h1>
          </div>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center"
          >
            <User className="w-6 h-6 text-primary-foreground" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search hospitals or doctors..."
            className="pl-12 h-12 bg-card border-0 shadow-lg"
            onFocus={() => setView("search")}
          />
        </div>
      </motion.header>

      {/* Profile Dropdown */}
      {showProfile && (
        <motion.div
          className="absolute right-6 top-24 bg-card rounded-xl shadow-xl p-4 w-64 z-50 border border-border"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                <User className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{userProfile.name}</p>
                <p className="text-sm text-muted-foreground">{userProfile.phone}</p>
              </div>
            </div>
          </div>
          <Button variant="destructive" size="sm" className="w-full" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </motion.div>
      )}

      <main className="px-6 py-6 space-y-8">
        {/* Book OP CTA */}
        <motion.div
          className="bg-card rounded-2xl p-6 shadow-card border border-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Do you wanna book an OP?
          </h2>
          <p className="text-muted-foreground mb-4">
            Find the best hospitals and doctors near you
          </p>
          <Button variant="hero" onClick={() => setView("search")}>
            <Search className="w-5 h-5 mr-2" />
            Search Hospitals
          </Button>
        </motion.div>

        {/* Current Bookings */}
        {currentBookings.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Current Bookings
            </h3>
            <div className="space-y-3">
              {currentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-card rounded-xl p-4 border-2 border-primary/20 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-foreground">{booking.hospital}</h4>
                      <p className="text-sm text-muted-foreground">{booking.doctor}</p>
                    </div>
                    <span className="px-3 py-1 bg-success/10 text-success text-xs font-medium rounded-full">
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {booking.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {booking.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Famous Hospitals Carousel */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-accent" />
            Popular Hospitals
          </h3>
          <HospitalCarousel onHospitalSelect={handleHospitalSelect} />
        </motion.section>

        {/* Recent Bookings */}
        {recentBookings.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              Recent Bookings
            </h3>
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-card rounded-xl p-4 border border-border flex justify-between items-center"
                >
                  <div>
                    <h4 className="font-medium text-foreground">{booking.hospital}</h4>
                    <p className="text-sm text-muted-foreground">{booking.doctor}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {booking.date} at {booking.time}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
