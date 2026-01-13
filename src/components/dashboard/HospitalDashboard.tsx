import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Users,
  Calendar,
  Settings,
  Plus,
  Star,
  Clock,
  Bell,
  LogOut,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface HospitalDashboardProps {
  onLogout: () => void;
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

const HospitalDashboard = ({ onLogout }: HospitalDashboardProps) => {
  const [activeTab, setActiveTab] = useState<"doctors" | "appointments" | "slots">("doctors");
  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: "1",
      name: "Dr. Sarah Smith",
      specialization: "Cardiologist",
      degree: "MBBS, MD, DM (Cardiology)",
      rating: 4.9,
      reviews: 234,
      fee: 800,
      available: true,
      slots: [
        { id: "s1", date: "Jan 16, 2026", time: "10:00 AM", booked: true, patientName: "Rahul Kumar" },
        { id: "s2", date: "Jan 16, 2026", time: "11:00 AM", booked: false },
        { id: "s3", date: "Jan 16, 2026", time: "2:00 PM", booked: true, patientName: "Priya Patel" },
      ],
    },
    {
      id: "2",
      name: "Dr. Rajesh Kumar",
      specialization: "Neurologist",
      degree: "MBBS, MD (Neurology)",
      rating: 4.7,
      reviews: 189,
      fee: 1000,
      available: true,
      slots: [
        { id: "s4", date: "Jan 16, 2026", time: "10:30 AM", booked: false },
        { id: "s5", date: "Jan 16, 2026", time: "3:00 PM", booked: true, patientName: "Amit Shah" },
      ],
    },
  ]);

  const [appointments] = useState<Appointment[]>([
    { id: "1", patientName: "Rahul Kumar", patientPhone: "+91 9876543210", doctor: "Dr. Sarah Smith", time: "10:00 AM", status: "confirmed" },
    { id: "2", patientName: "Priya Patel", patientPhone: "+91 9876543211", doctor: "Dr. Sarah Smith", time: "2:00 PM", status: "pending" },
    { id: "3", patientName: "Amit Shah", patientPhone: "+91 9876543212", doctor: "Dr. Rajesh Kumar", time: "3:00 PM", status: "delayed" },
  ]);

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
    alert(`Notification sent to ${appointment.patientName} about delay for ${appointment.doctor} appointment at ${appointment.time}`);
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
          <div>
            <p className="text-primary-foreground/80 text-sm">Hospital Dashboard</p>
            <h1 className="text-2xl font-bold text-primary-foreground">Apollo Hospital</h1>
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