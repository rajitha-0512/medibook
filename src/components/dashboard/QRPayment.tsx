import { motion } from "framer-motion";
import { ArrowLeft, QrCode, Smartphone, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

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

type PaymentState = "scanning" | "success" | "failed";

const QRPayment = ({ doctor, slot, hospitalName, upiId, onBack, onPaymentComplete }: QRPaymentProps) => {
  const [paymentState, setPaymentState] = useState<PaymentState>("scanning");
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Generate UPI QR code URL
  const upiLink = `upi://pay?pa=${upiId || "hospital@upi"}&pn=${encodeURIComponent(hospitalName)}&am=${doctor.fee}&cu=INR&tn=${encodeURIComponent(`Appointment with ${doctor.name}`)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;

  // Create payment record on mount
  useEffect(() => {
    const createPayment = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("verify-payment", {
          body: {
            action: "create",
            doctorName: doctor.name,
            hospitalName,
            amount: doctor.fee,
            slotDate: slot.date,
            slotTime: slot.time,
            upiId: upiId || "hospital@upi",
          },
        });

        if (error) throw error;
        
        if (data?.transactionId) {
          setTransactionId(data.transactionId);
          console.log("Payment created:", data.transactionId);
        }
      } catch (error) {
        console.error("Error creating payment:", error);
      }
    };

    createPayment();
  }, [doctor, hospitalName, slot, upiId]);

  // Poll for payment status
  useEffect(() => {
    if (!transactionId || paymentState !== "scanning") return;

    const checkPaymentStatus = async () => {
      try {
        setCheckingPayment(true);
        const { data, error } = await supabase.functions.invoke("verify-payment", {
          body: {
            action: "check",
            transactionId,
          },
        });

        if (error) throw error;

        console.log("Payment status:", data?.status);

        if (data?.status === "success") {
          setPaymentState("success");
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
          }
        } else if (data?.status === "failed") {
          setPaymentState("failed");
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
          }
        }
      } catch (error) {
        console.error("Error checking payment:", error);
      } finally {
        setCheckingPayment(false);
      }
    };

    // Poll every 3 seconds
    pollingRef.current = setInterval(checkPaymentStatus, 3000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [transactionId, paymentState]);

  const handleContinue = () => {
    onPaymentComplete(paymentState === "success");
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
              <div className="flex flex-col items-center gap-4 mt-2">
                <div className="flex items-center gap-2 text-primary">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm font-medium">Waiting for payment...</span>
                </div>
                {transactionId && (
                  <p className="text-xs text-muted-foreground">
                    Transaction ID: {transactionId}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Payment will be verified automatically
                </p>
                <Button
                  variant="ghost"
                  className="text-muted-foreground mt-4"
                  onClick={onBack}
                >
                  Cancel
                </Button>
              </div>
            </>
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
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => onPaymentComplete(false)}
              >
                Go Back
              </Button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default QRPayment;
