import { motion } from "framer-motion";
import { ArrowLeft, QrCode, Smartphone, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

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
  upiId?: string;
  onBack: () => void;
  onPaymentComplete: (success: boolean) => void;
}

type PaymentState = "scanning" | "verifying" | "success" | "failed";

const QRPayment = ({ doctor, slot, hospitalName, upiId, onBack, onPaymentComplete }: QRPaymentProps) => {
  const [paymentState, setPaymentState] = useState<PaymentState>("scanning");
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [countdown, setCountdown] = useState(30);

  // Generate UPI QR code URL
  const upiLink = `upi://pay?pa=${upiId || "hospital@upi"}&pn=${encodeURIComponent(hospitalName)}&am=${doctor.fee}&cu=INR&tn=${encodeURIComponent(`Appointment with ${doctor.name}`)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;

  // Simulate waiting for payment (countdown timer)
  useEffect(() => {
    if (paymentState === "scanning" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (paymentState === "scanning" && countdown === 0) {
      // Simulate payment received after countdown
      setPaymentState("verifying");
    }
  }, [paymentState, countdown]);

  // Verification progress
  useEffect(() => {
    if (paymentState === "verifying") {
      const interval = setInterval(() => {
        setVerificationProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            // Simulate random success/failure (90% success rate)
            const success = Math.random() > 0.1;
            setPaymentState(success ? "success" : "failed");
            return 100;
          }
          return prev + 10;
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [paymentState]);

  const handleContinue = () => {
    onPaymentComplete(paymentState === "success");
  };

  const handleRetry = () => {
    setPaymentState("scanning");
    setCountdown(30);
    setVerificationProgress(0);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        className="gradient-primary px-6 pt-12 pb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4">
          {paymentState === "scanning" && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onBack}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
          )}
          <div>
            <h2 className="text-xl font-bold text-primary-foreground">
              {paymentState === "success" ? "Payment Successful" : 
               paymentState === "failed" ? "Payment Failed" : 
               "Complete Payment"}
            </h2>
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

        {/* Payment Section */}
        <motion.div
          className="bg-card rounded-2xl p-8 shadow-card border border-border text-center max-w-sm w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {paymentState === "scanning" && (
            <>
              <div className="flex items-center justify-center gap-2 mb-4">
                <QrCode className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Scan to Pay</h3>
              </div>

              {/* Real QR Code */}
              <div className="w-52 h-52 mx-auto mb-4 bg-white rounded-xl flex items-center justify-center border-2 border-dashed border-primary/30 p-2">
                <img 
                  src={qrCodeUrl} 
                  alt="UPI QR Code" 
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>

              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
                <Smartphone className="w-4 h-4" />
                <p className="text-sm">Scan with any UPI app</p>
              </div>

              {/* Waiting indicator */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-primary">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm font-medium">Waiting for payment...</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Auto-verifying in {countdown}s
                </p>
              </div>
            </>
          )}

          {paymentState === "verifying" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="w-16 h-16 text-primary animate-spin" />
              <h3 className="text-lg font-bold text-foreground">Verifying Payment...</h3>
              <p className="text-sm text-muted-foreground">Please wait while we confirm your payment</p>
              <div className="w-full bg-secondary rounded-full h-2 mt-4">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${verificationProgress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{verificationProgress}% completed</p>
            </div>
          )}

          {paymentState === "success" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center"
              >
                <CheckCircle className="w-12 h-12 text-green-500" />
              </motion.div>
              <h3 className="text-xl font-bold text-foreground">Payment Successful!</h3>
              <p className="text-sm text-muted-foreground">Your appointment has been booked</p>
              <div className="text-2xl font-bold text-green-500">₹{doctor.fee}</div>
              <Button
                className="w-full mt-4 bg-green-500 hover:bg-green-600"
                size="lg"
                onClick={handleContinue}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Continue
              </Button>
            </div>
          )}

          {paymentState === "failed" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center"
              >
                <XCircle className="w-12 h-12 text-destructive" />
              </motion.div>
              <h3 className="text-xl font-bold text-foreground">Payment Failed</h3>
              <p className="text-sm text-muted-foreground">We couldn't verify your payment</p>
              <div className="flex gap-3 w-full mt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => onPaymentComplete(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleRetry}
                >
                  Retry
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default QRPayment;
