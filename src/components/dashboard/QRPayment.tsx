import { motion } from "framer-motion";
import { ArrowLeft, QrCode, Smartphone, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  fee: number;
}

interface Slot {
  id: string;
  time: string;
  date: string;
}

interface QRPaymentProps {
  doctor: Doctor;
  slot: Slot;
  hospitalName: string;
  onBack: () => void;
  onPaymentComplete: (success: boolean) => void;
}

const QRPayment = ({ doctor, slot, hospitalName, onBack, onPaymentComplete }: QRPaymentProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        className="gradient-primary px-6 pt-12 pb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-primary-foreground">Complete Payment</h2>
            <p className="text-sm text-primary-foreground/80">{hospitalName}</p>
          </div>
        </div>
      </motion.header>

      <motion.div
        className="flex-1 flex flex-col items-center px-6 py-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        {/* Booking Summary */}
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border w-full max-w-sm mb-6">
          <h3 className="font-semibold text-foreground mb-3">Booking Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Doctor</span>
              <span className="font-medium text-foreground">{doctor.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Specialization</span>
              <span className="text-primary">{doctor.specialization}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium text-foreground">{slot.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time</span>
              <span className="font-medium text-foreground">{slot.time}</span>
            </div>
            <div className="border-t border-border my-3" />
            <div className="flex justify-between items-center">
              <span className="font-semibold text-foreground">Total Amount</span>
              <span className="text-xl font-bold text-primary">₹{doctor.fee}</span>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <motion.div
          className="bg-card rounded-2xl p-8 shadow-card border border-border text-center max-w-sm w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <QrCode className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-bold text-foreground">Scan to Pay</h3>
          </div>

          {/* QR Code Placeholder */}
          <div className="w-48 h-48 mx-auto mb-6 bg-secondary rounded-xl flex items-center justify-center border-2 border-dashed border-primary/30">
            <div className="text-center">
              <div className="w-36 h-36 bg-foreground/5 rounded-lg flex items-center justify-center p-4">
                <div className="grid grid-cols-5 gap-1">
                  {[...Array(25)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-5 h-5 rounded-sm ${
                        Math.random() > 0.4 ? "bg-foreground" : "bg-transparent"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-6">
            <Smartphone className="w-4 h-4" />
            <p className="text-sm">Scan with any UPI app</p>
          </div>

          <div className="flex gap-4">
            <Button
              variant="destructive"
              size="lg"
              className="flex-1"
              onClick={() => onPaymentComplete(false)}
            >
              <XCircle className="w-5 h-5 mr-2" />
              Cancel
            </Button>
            <Button
              variant="success"
              size="lg"
              className="flex-1"
              onClick={() => onPaymentComplete(true)}
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              I've Paid
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default QRPayment;
