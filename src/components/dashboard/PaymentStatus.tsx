import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Home, Calendar, Clock, User, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingDetails {
  doctorName?: string;
  specialization?: string;
  date?: string;
  time?: string;
  hospitalName?: string;
  fee?: number;
}

interface PaymentStatusProps {
  success: boolean;
  onContinue: () => void;
  bookingDetails?: BookingDetails;
}

const PaymentStatus = ({ success, onContinue, bookingDetails }: PaymentStatusProps) => {
  const bookingId = `MED${Date.now().toString().slice(-8)}`;

  return (
    <motion.div
      className={`min-h-screen flex flex-col items-center justify-center px-6 ${
        success 
          ? "bg-gradient-to-b from-success/90 via-success to-success/80" 
          : "bg-gradient-to-b from-destructive/90 via-destructive to-destructive/80"
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Hospital Cross Icon */}
      <motion.div
        className="absolute top-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          success ? "bg-success-foreground/20" : "bg-destructive-foreground/20"
        }`}>
          <Stethoscope className={`w-6 h-6 ${
            success ? "text-success-foreground" : "text-destructive-foreground"
          }`} />
        </div>
      </motion.div>

      <motion.div
        className="text-center"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        {success ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <CheckCircle2 className="w-28 h-28 mx-auto mb-6 text-success-foreground drop-shadow-lg" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <XCircle className="w-28 h-28 mx-auto mb-6 text-destructive-foreground drop-shadow-lg" />
          </motion.div>
        )}

        <h1 className={`text-3xl font-bold mb-4 ${
          success ? "text-success-foreground" : "text-destructive-foreground"
        }`}>
          {success ? "Payment Successful!" : "Payment Declined"}
        </h1>

        <p className={`text-lg mb-8 max-w-sm mx-auto ${
          success ? "text-success-foreground/90" : "text-destructive-foreground/90"
        }`}>
          {success
            ? "Your appointment has been confirmed. You will receive a confirmation SMS shortly."
            : "We couldn't process your payment. Please try again or use a different payment method."}
        </p>

        {success && (
          <motion.div
            className="bg-success-foreground/15 backdrop-blur-sm rounded-2xl p-5 mb-8 max-w-sm mx-auto border border-success-foreground/20"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-success-foreground/20 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-success-foreground" />
              </div>
              <p className="text-success-foreground font-semibold">Appointment Confirmed</p>
            </div>
            
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <span className="text-success-foreground/70 text-sm w-24">Booking ID</span>
                <span className="font-bold text-success-foreground">{bookingId}</span>
              </div>
              {bookingDetails?.doctorName && (
                <div className="flex items-center gap-3">
                  <span className="text-success-foreground/70 text-sm w-24">Doctor</span>
                  <span className="font-medium text-success-foreground">{bookingDetails.doctorName}</span>
                </div>
              )}
              {bookingDetails?.date && bookingDetails?.time && (
                <div className="flex items-center gap-3">
                  <span className="text-success-foreground/70 text-sm w-24">Schedule</span>
                  <span className="font-medium text-success-foreground">
                    {bookingDetails.date} at {bookingDetails.time}
                  </span>
                </div>
              )}
              {bookingDetails?.fee && (
                <div className="flex items-center gap-3">
                  <span className="text-success-foreground/70 text-sm w-24">Amount Paid</span>
                  <span className="font-bold text-success-foreground">₹{bookingDetails.fee}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        <Button
          variant="heroOutline"
          size="lg"
          className={`${
            success 
              ? "bg-success-foreground/20 border-success-foreground/40 text-success-foreground hover:bg-success-foreground/30" 
              : "bg-destructive-foreground/20 border-destructive-foreground/40 text-destructive-foreground hover:bg-destructive-foreground/30"
          }`}
          onClick={onContinue}
        >
          <Home className="w-5 h-5 mr-2" />
          {success ? "Go to Dashboard" : "Try Again"}
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default PaymentStatus;