import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar, User, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Slot {
  id: string;
  time: string;
  date: string;
  available: boolean;
}

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  degree: string;
  fee: number;
  slots: Slot[];
}

interface SlotSelectionProps {
  doctor: Doctor;
  hospitalName: string;
  onBack: () => void;
  onSlotSelect: (slot: Slot) => void;
}

const SlotSelection = ({ doctor, hospitalName, onBack, onSlotSelect }: SlotSelectionProps) => {
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const handleContinue = () => {
    if (selectedSlot) {
      onSlotSelect(selectedSlot);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        className="gradient-primary px-6 pt-12 pb-8 rounded-b-3xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4 mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-primary-foreground">Select Time Slot</h2>
            <p className="text-sm text-primary-foreground/80">{hospitalName}</p>
          </div>
        </div>
      </motion.header>

      {/* Doctor Info Card */}
      <motion.div
        className="px-6 -mt-6 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-foreground text-lg">{doctor.name}</h3>
              <p className="text-sm text-primary">{doctor.specialization}</p>
              <p className="text-xs text-muted-foreground mt-1">{doctor.degree}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-foreground">₹{doctor.fee}</p>
              <p className="text-xs text-muted-foreground">Consultation</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Available Slots */}
      <motion.section
        className="px-6 py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Available Slots
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {doctor.slots.map((slot) => (
            <motion.button
              key={slot.id}
              disabled={!slot.available}
              onClick={() => setSelectedSlot(slot)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                !slot.available
                  ? "bg-muted border-border opacity-50 cursor-not-allowed"
                  : selectedSlot?.id === slot.id
                  ? "bg-primary/10 border-primary shadow-md"
                  : "bg-card border-border hover:border-primary/50"
              }`}
              whileTap={slot.available ? { scale: 0.98 } : undefined}
            >
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{slot.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{slot.time}</span>
              </div>
              {!slot.available && (
                <p className="text-xs text-destructive mt-2 font-medium">Booked</p>
              )}
            </motion.button>
          ))}
        </div>

        {doctor.slots.filter(s => s.available).length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No slots available for this doctor</p>
          </div>
        )}
      </motion.section>

      {/* Continue Button */}
      <div className="px-6 pb-8">
        <Button
          variant="hero"
          size="lg"
          className="w-full"
          disabled={!selectedSlot}
          onClick={handleContinue}
        >
          <CreditCard className="w-5 h-5 mr-2" />
          Continue to Payment - ₹{doctor.fee}
        </Button>
      </div>
    </div>
  );
};

export default SlotSelection;
