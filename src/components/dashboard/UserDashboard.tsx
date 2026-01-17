import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Calendar, Clock, Search, LogOut, Star, ChevronRight, Stethoscope, X, Phone, Mail, Edit2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { UserProfile } from "@/types/user";
import HospitalCarousel from "./HospitalCarousel";
import HospitalSearch from "./HospitalSearch";
import HospitalDetails, { Doctor } from "./HospitalDetails";
import SlotSelection from "./SlotSelection";
import QRPayment from "./QRPayment";
import PaymentStatus from "./PaymentStatus";

interface UserDashboardProps {
  onLogout: () => void;
  userProfile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
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

interface CurrentBooking {
  id: string;
  hospital: string;
  doctor: string;
  date: string;
  time: string;
  status: string;
}

const UserDashboard = ({ onLogout, userProfile, onProfileUpdate }: UserDashboardProps) => {
  const [view, setView] = useState<View>("dashboard");
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(userProfile);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);
  const [currentBookings, setCurrentBookings] = useState<CurrentBooking[]>([]);
  const [recentBookings] = useState<CurrentBooking[]>([]);

  const handleCancelBooking = (bookingId: string) => {
    setCurrentBookings(prev => prev.filter(b => b.id !== bookingId));
    setCancelBookingId(null);
    toast.success("Booking cancelled successfully");
  };

  const handleSaveProfile = () => {
    onProfileUpdate(editedProfile);
    setShowEditProfile(false);
    setShowProfile(false);
    toast.success("Profile updated successfully");
  };

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

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
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
            <h1 className="text-2xl font-bold text-primary-foreground">{userProfile.name || "User"}</h1>
          </div>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="relative"
          >
            <Avatar className="w-12 h-12 border-2 border-primary-foreground/30 shadow-lg">
              <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
              <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground font-semibold">
                {getInitials(userProfile.name)}
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-primary"></span>
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
      <AnimatePresence>
        {showProfile && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProfile(false)}
            />
            <motion.div
              className="absolute right-6 top-24 bg-card rounded-2xl shadow-2xl w-72 z-50 border border-border overflow-hidden"
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
            >
              {/* Profile Header */}
              <div className="gradient-primary p-4 relative">
                <button
                  onClick={() => setShowProfile(false)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-colors"
                >
                  <X className="w-4 h-4 text-primary-foreground" />
                </button>
                <div className="flex items-center gap-3">
                  <Avatar className="w-14 h-14 border-2 border-primary-foreground/30">
                    <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                    <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground font-bold text-lg">
                      {getInitials(userProfile.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-primary-foreground">{userProfile.name || "User"}</p>
                    <span className="text-xs text-primary-foreground/70 bg-primary-foreground/20 px-2 py-0.5 rounded-full">
                      Patient
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Profile Details */}
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-muted-foreground">{userProfile.phone || "Not set"}</span>
                </div>
                {userProfile.age && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{userProfile.age} years old • {userProfile.gender}</span>
                  </div>
                )}
                {userProfile.email && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{userProfile.email}</span>
                  </div>
                )}
                
                <div className="pt-2 space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => {
                      setEditedProfile(userProfile);
                      setShowEditProfile(true);
                    }}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="destructive" size="sm" className="w-full" onClick={onLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
        <DialogContent className="bg-card max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-primary" />
              Edit Profile
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={editedProfile.name}
                onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <Label>Age</Label>
              <Input
                type="number"
                value={editedProfile.age}
                onChange={(e) => setEditedProfile({ ...editedProfile, age: e.target.value })}
                placeholder="Enter your age"
              />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select 
                value={editedProfile.gender} 
                onValueChange={(value) => setEditedProfile({ ...editedProfile, gender: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                value={editedProfile.phone}
                onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                placeholder="Enter phone number"
              />
            </div>
            <div className="space-y-2">
              <Label>Email (Optional)</Label>
              <Input
                type="email"
                value={editedProfile.email || ""}
                onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                placeholder="Enter email address"
              />
            </div>
            <Button variant="hero" className="w-full" onClick={handleSaveProfile}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Booking Confirmation Dialog */}
      <AlertDialog open={!!cancelBookingId} onOpenChange={() => setCancelBookingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => cancelBookingId && handleCancelBooking(cancelBookingId)}
            >
              Yes, Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
                  <div className="flex items-center justify-between">
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
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setCancelBookingId(booking.id)}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
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
