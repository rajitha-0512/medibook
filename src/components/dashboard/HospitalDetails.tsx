import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Star, Clock, Phone, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Hospital {
  id: string;
  name: string;
  location: string;
  status: "open" | "closed";
  rating: number;
  image: string;
  specialties: string[];
}

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  degree: string;
  rating: number;
  reviewCount: number;
  fee: number;
  available: boolean;
  availableSlots: number;
  nextAvailable: string;
}

interface HospitalDetailsProps {
  hospital: Hospital;
  onBack: () => void;
  onRegister: () => void;
}

const mockDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Smith",
    specialization: "Cardiologist",
    degree: "MBBS, MD, DM (Cardiology)",
    rating: 4.9,
    reviewCount: 234,
    fee: 800,
    available: true,
    availableSlots: 5,
    nextAvailable: "Today, 2:00 PM",
  },
  {
    id: "2",
    name: "Dr. Rajesh Kumar",
    specialization: "Neurologist",
    degree: "MBBS, MD (Neurology)",
    rating: 4.7,
    reviewCount: 189,
    fee: 1000,
    available: true,
    availableSlots: 2,
    nextAvailable: "Tomorrow, 10:00 AM",
  },
  {
    id: "3",
    name: "Dr. Priya Sharma",
    specialization: "Orthopedic Surgeon",
    degree: "MBBS, MS (Ortho)",
    rating: 4.8,
    reviewCount: 156,
    fee: 900,
    available: false,
    availableSlots: 0,
    nextAvailable: "Jan 18, 2026",
  },
];

const HospitalDetails = ({ hospital, onBack, onRegister }: HospitalDetailsProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image */}
      <div className="relative h-56">
        <img
          src={hospital.image}
          alt={hospital.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onBack}
          className="absolute top-12 left-6 w-10 h-10 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </motion.button>
      </div>

      {/* Hospital Info */}
      <motion.div
        className="px-6 -mt-12 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{hospital.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground mt-2">
                <MapPin className="w-4 h-4" />
                <span>{hospital.location}</span>
              </div>
            </div>
            <span
              className={`px-3 py-1.5 text-sm font-medium rounded-full ${
                hospital.status === "open"
                  ? "bg-success/10 text-success"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              {hospital.status === "open" ? "Open Now" : "Closed"}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-accent fill-accent" />
              <span className="font-semibold text-foreground">{hospital.rating}</span>
              <span className="text-sm text-muted-foreground">(500+ reviews)</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {hospital.specialties.map((specialty) => (
              <span
                key={specialty}
                className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Doctors List */}
      <motion.section
        className="px-6 py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Available Doctors
        </h2>

        <div className="space-y-4">
          {mockDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className={`bg-card rounded-xl p-4 border ${
                doctor.available ? "border-border" : "border-destructive/20"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground">{doctor.name}</h3>
                  <p className="text-sm text-primary">{doctor.specialization}</p>
                  <p className="text-xs text-muted-foreground mt-1">{doctor.degree}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-accent fill-accent" />
                    <span className="text-sm font-semibold">{doctor.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">({doctor.reviewCount} reviews)</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-foreground">₹{doctor.fee}</p>
                  <p className="text-xs text-muted-foreground">Consultation fee</p>
                </div>

                {doctor.available ? (
                  <div className="text-right">
                    <p className="text-sm font-medium text-success">
                      {doctor.availableSlots} slots available
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3" />
                      {doctor.nextAvailable}
                    </p>
                  </div>
                ) : (
                  <div className="text-right">
                    <p className="text-sm font-medium text-destructive">Slots Booked</p>
                    <p className="text-xs text-muted-foreground">
                      Next: {doctor.nextAvailable}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Register Button */}
      <div className="px-6 pb-8">
        <Button variant="hero" size="lg" className="w-full" onClick={onRegister}>
          Register for Appointment
        </Button>
      </div>
    </div>
  );
};

export default HospitalDetails;