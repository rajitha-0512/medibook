import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Users,
  Calendar,
  Plus,
  Star,
  Clock,
  Bell,
  LogOut,
  AlertTriangle,
  Phone,
  MapPin,
  Hash,
  QrCode,
  Edit2,
  Save,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { HospitalProfile } from "@/types/user";

interface HospitalDashboardProps {
  onLogout: () => void;
  hospitalProfile: HospitalProfile;
  onProfileUpdate: (profile: HospitalProfile) => void;
}

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  degree: string;
  rating: number;
  reviews: number;
  fee: number;
  available: boolean;
  slots: Slot[];
}

interface Slot {
  id: string;
  date: string;
  time: string;
  booked: boolean;
  patientName?: string;
}

interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  doctor: string;
  time: string;
  status: "pending" | "confirmed" | "delayed" | "completed";
}

const HospitalDashboard = ({ onLogout, hospitalProfile, onProfileUpdate }: HospitalDashboardProps) => {
  const [activeTab, setActiveTab] = useState<"doctors" | "appointments" | "slots">("doctors");
  const [showProfile, setShowProfile] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState<HospitalProfile>(hospitalProfile);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const [appointments] = useState<Appointment[]>([]);

  const [newDoctor, setNewDoctor] = useState({
    name: "",
    specialization: "",
    degree: "",
    fee: "",
  });

  const [showAddDoctor, setShowAddDoctor] = useState(false);

  const handleAddDoctor = () => {
    if (newDoctor.name && newDoctor.specialization && newDoctor.degree && newDoctor.fee) {
      const doctor: Doctor = {
        id: Date.now().toString(),
        name: newDoctor.name,
        specialization: newDoctor.specialization,
        degree: newDoctor.degree,
        rating: 0,
        reviews: 0,
        fee: parseInt(newDoctor.fee),
        available: true,
        slots: [],
      };
      setDoctors([...doctors, doctor]);
      setNewDoctor({ name: "", specialization: "", degree: "", fee: "" });
      setShowAddDoctor(false);
    }
  };

  const toggleDoctorAvailability = (doctorId: string) => {
    setDoctors(doctors.map(doc =>
      doc.id === doctorId ? { ...doc, available: !doc.available } : doc
    ));
  };

  const notifyPatient = (appointment: Appointment) => {
    toast.info(`Notification sent to ${appointment.patientName} about delay`);
  };

  const handleSaveProfile = () => {
    onProfileUpdate(editedProfile);
    setShowEditProfile(false);
    setShowProfile(false);
    toast.success("Hospital profile updated successfully");
  };

  const getInitials = (name: string) => {
    if (!name) return 'H';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const totalSlots = doctors.reduce((acc, doc) => acc + doc.slots.length, 0);
  const bookedSlots = doctors.reduce((acc, doc) => acc + doc.slots.filter(s => s.booked).length, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        className="gradient-primary px-6 pt-12 pb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowProfile(!showProfile)}>
              <Avatar className="w-12 h-12 border-2 border-primary-foreground/30">
                <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground font-bold">
                  {getInitials(hospitalProfile.hospitalName)}
                </AvatarFallback>
              </Avatar>
            </button>
            <div>
              <p className="text-primary-foreground/80 text-sm">Hospital Dashboard</p>
              <h1 className="text-xl font-bold text-primary-foreground">{hospitalProfile.hospitalName || "Hospital"}</h1>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center"
          >
            <LogOut className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="bg-primary-foreground/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-primary-foreground">{doctors.length}</p>
            <p className="text-xs text-primary-foreground/80">Doctors</p>
          </div>
          <div className="bg-primary-foreground/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-primary-foreground">{bookedSlots}</p>
            <p className="text-xs text-primary-foreground/80">Bookings</p>
          </div>
          <div className="bg-primary-foreground/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-primary-foreground">{totalSlots - bookedSlots}</p>
            <p className="text-xs text-primary-foreground/80">Available</p>
          </div>
        </div>
      </motion.header>

      {/* Profile Dropdown */}
      <AnimatePresence>
        {showProfile && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProfile(false)}
            />
            <motion.div
              className="absolute left-6 top-24 bg-card rounded-2xl shadow-2xl w-80 z-50 border border-border overflow-hidden"
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
                    <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground font-bold text-lg">
                      {getInitials(hospitalProfile.hospitalName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-primary-foreground">{hospitalProfile.hospitalName || "Hospital"}</p>
                    <span className="text-xs text-primary-foreground/70 bg-primary-foreground/20 px-2 py-0.5 rounded-full">
                      {hospitalProfile.hospitalCode || "Code not set"}
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
                  <span className="text-muted-foreground">{hospitalProfile.mobileNumber || "Not set"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-muted-foreground">{hospitalProfile.location || "Not set"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Hash className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-muted-foreground">{hospitalProfile.hospitalCode || "Not set"}</span>
                </div>
                {hospitalProfile.qrDetails && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <QrCode className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-muted-foreground truncate">{hospitalProfile.qrDetails}</span>
                  </div>
                )}
                
                <div className="pt-2 space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => {
                      setEditedProfile(hospitalProfile);
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
              Edit Hospital Profile
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Hospital Name</Label>
              <Input
                value={editedProfile.hospitalName}
                onChange={(e) => setEditedProfile({ ...editedProfile, hospitalName: e.target.value })}
                placeholder="Enter hospital name"
              />
            </div>
            <div className="space-y-2">
              <Label>Mobile Number</Label>
              <Input
                value={editedProfile.mobileNumber}
                onChange={(e) => setEditedProfile({ ...editedProfile, mobileNumber: e.target.value })}
                placeholder="Enter mobile number"
              />
            </div>
            <div className="space-y-2">
              <Label>Hospital Code</Label>
              <Input
                value={editedProfile.hospitalCode}
                onChange={(e) => setEditedProfile({ ...editedProfile, hospitalCode: e.target.value })}
                placeholder="Enter hospital code"
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={editedProfile.location}
                onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                placeholder="Enter hospital address"
              />
            </div>
            <div className="space-y-2">
              <Label>QR Payment Details</Label>
              <Textarea
                value={editedProfile.qrDetails}
                onChange={(e) => setEditedProfile({ ...editedProfile, qrDetails: e.target.value })}
                placeholder="Enter UPI ID or payment details"
                className="resize-none"
              />
            </div>
            <Button variant="hero" className="w-full" onClick={handleSaveProfile}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tabs */}
      <div className="flex border-b border-border bg-card sticky top-0 z-10">
        {[
          { id: "doctors", icon: Users, label: "Doctors" },
          { id: "appointments", icon: Calendar, label: "Appointments" },
          { id: "slots", icon: Clock, label: "Slots" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <main className="px-6 py-6">
        <AnimatePresence mode="wait">
          {activeTab === "doctors" && (
            <motion.div
              key="doctors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">Manage Doctors</h2>
                <Dialog open={showAddDoctor} onOpenChange={setShowAddDoctor}>
                  <DialogTrigger asChild>
                    <Button variant="hero" size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Doctor
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card">
                    <DialogHeader>
                      <DialogTitle>Add New Doctor</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label>Doctor Name</Label>
                        <Input
                          placeholder="Dr. John Doe"
                          value={newDoctor.name}
                          onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Specialization</Label>
                        <Select
                          value={newDoctor.specialization}
                          onValueChange={(v) => setNewDoctor({ ...newDoctor, specialization: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select specialty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Cardiologist">Cardiologist</SelectItem>
                            <SelectItem value="Neurologist">Neurologist</SelectItem>
                            <SelectItem value="Orthopedic">Orthopedic</SelectItem>
                            <SelectItem value="Pediatrician">Pediatrician</SelectItem>
                            <SelectItem value="Dermatologist">Dermatologist</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Degree/Qualification</Label>
                        <Input
                          placeholder="MBBS, MD"
                          value={newDoctor.degree}
                          onChange={(e) => setNewDoctor({ ...newDoctor, degree: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Consultation Fee (₹)</Label>
                        <Input
                          type="number"
                          placeholder="500"
                          value={newDoctor.fee}
                          onChange={(e) => setNewDoctor({ ...newDoctor, fee: e.target.value })}
                        />
                      </div>
                      <Button variant="hero" className="w-full" onClick={handleAddDoctor}>
                        Add Doctor
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="bg-card rounded-xl p-4 border border-border"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{doctor.name}</h3>
                        <p className="text-sm text-primary">{doctor.specialization}</p>
                        <p className="text-xs text-muted-foreground">{doctor.degree}</p>
                      </div>
                      <button
                        onClick={() => toggleDoctorAvailability(doctor.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          doctor.available
                            ? "bg-success/10 text-success"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {doctor.available ? "Available" : "Unavailable"}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-accent fill-accent" />
                          {doctor.rating || "New"}
                        </span>
                        <span className="text-muted-foreground">
                          {doctor.reviews} reviews
                        </span>
                      </div>
                      <span className="font-semibold text-foreground">₹{doctor.fee}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "appointments" && (
            <motion.div
              key="appointments"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h2 className="text-lg font-bold text-foreground mb-4">Today's Appointments</h2>

              <div className="space-y-4">
                {appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className={`bg-card rounded-xl p-4 border ${
                      apt.status === "delayed"
                        ? "border-accent"
                        : "border-border"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground">{apt.patientName}</h3>
                        <p className="text-sm text-muted-foreground">{apt.patientPhone}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          apt.status === "confirmed"
                            ? "bg-success/10 text-success"
                            : apt.status === "delayed"
                            ? "bg-accent/10 text-accent"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-foreground">{apt.doctor}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {apt.time}
                        </p>
                      </div>

                      {apt.status !== "completed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => notifyPatient(apt)}
                          className="text-accent border-accent hover:bg-accent hover:text-accent-foreground"
                        >
                          <Bell className="w-4 h-4 mr-1" />
                          Notify Delay
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "slots" && (
            <motion.div
              key="slots"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h2 className="text-lg font-bold text-foreground mb-4">Manage Slots</h2>

              {doctors.map((doctor) => (
                <div key={doctor.id} className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-foreground">{doctor.name}</h3>
                    {doctor.slots.filter(s => !s.booked).length === 0 ? (
                      <span className="px-3 py-1 bg-destructive/10 text-destructive text-xs font-medium rounded-full flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Slots Booked
                      </span>
                    ) : (
                      <span className="text-sm text-success">
                        {doctor.slots.filter(s => !s.booked).length} slots available
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {doctor.slots.map((slot) => (
                      <div
                        key={slot.id}
                        className={`p-3 rounded-lg text-sm ${
                          slot.booked
                            ? "bg-destructive/10 border border-destructive/20"
                            : "bg-success/10 border border-success/20"
                        }`}
                      >
                        <p className="font-medium text-foreground">{slot.time}</p>
                        <p className="text-xs text-muted-foreground">{slot.date}</p>
                        {slot.booked && (
                          <p className="text-xs mt-1 text-destructive">{slot.patientName}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" size="sm" className="mt-3 w-full">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Slot
                  </Button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default HospitalDashboard;
