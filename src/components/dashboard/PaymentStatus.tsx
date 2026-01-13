import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentStatusProps {
  success: boolean;
  onContinue: () => void;
}

const PaymentStatus = ({ success, onContinue }: PaymentStatusProps) => {
  return (
    <motion.div
      className={`min-h-screen flex flex-col items-center justify-center px-6 ${
        success ? "gradient-success" : "gradient-error"
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="text-center"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        {success ? (
          <CheckCircle2 className="w-24 h-24 mx-auto mb-6 text-success-foreground" />
        ) : (
          <XCircle className="w-24 h-24 mx-auto mb-6 text-destructive-foreground" />
        )}

        <h1 className="text-3xl font-bold text-primary-foreground mb-4">
          {success ? "Payment Successful!" : "Payment Declined"}
        </h1>

        <p className="text-lg text-primary-foreground/80 mb-8 max-w-sm mx-auto">
          {success
            ? "Your appointment has been confirmed. You will receive a confirmation SMS shortly."
            : "We couldn't process your payment. Please try again or use a different payment method."}
        </p>

        {success && (
          <motion.div
            className="bg-primary-foreground/10 rounded-xl p-4 mb-8 max-w-sm mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-primary-foreground/90 text-sm">
              Booking ID: <span className="font-bold">MED{Date.now().toString().slice(-8)}</span>
            </p>
            <p className="text-primary-foreground/90 text-sm mt-1">
              Date: <span className="font-bold">Jan 16, 2026 at 10:30 AM</span>
            </p>
          </motion.div>
        )}

        <Button
          variant={success ? "heroOutline" : "outline"}
          size="lg"
          className={success ? "bg-primary-foreground/20 border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/30" : "bg-destructive-foreground/20 border-destructive-foreground/40 text-destructive-foreground hover:bg-destructive-foreground/30"}
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