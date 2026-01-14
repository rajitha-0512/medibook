import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Star, Clock, Users, Stethoscope, Calendar } from "lucide-react";
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

interface Slot {
  id: string;
  time: string;
  date: string;
  available: boolean;
}

export interface Doctor {
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
  slots: Slot[];
}

interface HospitalDetailsProps {
  hospital: Hospital;
  onBack: () => void;
  onDoctorSelect: (doctor: Doctor) => void;
}

export const mockDoctors: Doctor[] = [
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
    slots: [
      { id: "s1", time: "10:00 AM", date: "Jan 16, 2026", available: true },
      { id: "s2", time: "11:30 AM", date: "Jan 16, 2026", available: true },
      { id: "s3", time: "2:00 PM", date: "Jan 16, 2026", available: false },
      { id: "s4", time: "3:30 PM", date: "Jan 16, 2026", available: true },
      { id: "s5", time: "10:00 AM", date: "Jan 17, 2026", available: true },
      { id: "s6", time: "2:00 PM", date: "Jan 17, 2026", available: true },
    ],
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
    slots: [
      { id: "s7", time: "10:00 AM", date: "Jan 17, 2026", available: true },
      { id: "s8", time: "11:30 AM", date: "Jan 17, 2026", available: false },
      { id: "s9", time: "3:00 PM", date: "Jan 17, 2026", available: true },
    ],
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
    slots: [
      { id: "s10", time: "10:00 AM", date: "Jan 18, 2026", available: false },
      { id: "s11", time: "2:00 PM", date: "Jan 18, 2026", available: false },
    ],
  },
];

const HospitalDetails = ({ hospital, onBack, onDoctorSelect }: HospitalDetailsProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image */}
      <div className="relative h-56">
        <img
          src={hospital.image}
          alt={hospital.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onBack}
          className="absolute top-12 left-6 w-10 h-10 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-border"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </motion.button>
        
        {/* Hospital Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-12 right-6 flex items-center gap-2 bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded-full"
        >
          <Stethoscope className="w-4 h-4 text-primary-foreground" />
          <span className="text-xs font-semibold text-primary-foreground">MediBook</span>
        </motion.div>
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

      {/* Doctors List with Slots */}
      <motion.section
        className="px-6 py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Available Doctors & Slots
        </h2>

        <div className="space-y-4">
          {mockDoctors.map((doctor) => {
            const availableSlots = doctor.slots.filter(s => s.available);
            
            return (
              <motion.div
                key={doctor.id}
                className={`bg-card rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                  doctor.available 
                    ? "border-border hover:border-primary/50 hover:shadow-card" 
                    : "border-destructive/20 opacity-75"
                }`}
                whileHover={doctor.available ? { scale: 1.01 } : undefined}
              >
                {/* Doctor Header */}
                <div className="p-4 border-b border-border">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                      <Stethoscope className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-foreground">{doctor.name}</h3>
                          <p className="text-sm text-primary font-medium">{doctor.specialization}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{doctor.degree}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-accent fill-accent" />
                            <span className="text-sm font-bold">{doctor.rating}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">({doctor.reviewCount})</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div>
                          <p className="text-lg font-bold text-foreground">₹{doctor.fee}</p>
                          <p className="text-xs text-muted-foreground">Consultation</p>
                        </div>
                        {doctor.available ? (
                          <span className="px-3 py-1 bg-success/10 text-success text-xs font-semibold rounded-full">
                            {availableSlots.length} slots available
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-destructive/10 text-destructive text-xs font-semibold rounded-full">
                            Fully Booked
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slots Preview */}
                <div className="p-4 bg-secondary/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Available Slots</span>
                  </div>
                  
                  {availableSlots.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {availableSlots.slice(0, 4).map((slot) => (
                        <span
                          key={slot.id}
                          className="px-3 py-1.5 bg-card border border-border rounded-lg text-xs font-medium text-foreground"
                        >
                          <Clock className="w-3 h-3 inline mr-1 text-primary" />
                          {slot.time} • {slot.date}
                        </span>
                      ))}
                      {availableSlots.length > 4 && (
                        <span className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-medium">
                          +{availableSlots.length - 4} more
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mb-4">No slots available</p>
                  )}

                  <Button
                    variant={doctor.available ? "hero" : "secondary"}
                    size="default"
                    className="w-full"
                    disabled={!doctor.available}
                    onClick={() => onDoctorSelect(doctor)}
                  >
                    {doctor.available ? "Book Appointment" : "Not Available"}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>
    </div>
  );
};

export default HospitalDetails;