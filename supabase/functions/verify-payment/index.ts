import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  action: "create" | "check" | "simulate_complete";
  transactionId?: string;
  doctorName?: string;
  hospitalName?: string;
  amount?: number;
  slotDate?: string;
  slotTime?: string;
  upiId?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, transactionId, doctorName, hospitalName, amount, slotDate, slotTime, upiId }: PaymentRequest = await req.json();

    console.log(`Payment action: ${action}, transactionId: ${transactionId}`);

    if (action === "create") {
      // Create a new payment record
      const newTransactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      const { data, error } = await supabase
        .from("payments")
        .insert({
          transaction_id: newTransactionId,
          doctor_name: doctorName,
          hospital_name: hospitalName,
          amount: amount,
          slot_date: slotDate,
          slot_time: slotTime,
          upi_id: upiId,
          status: "pending",
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating payment:", error);
        throw error;
      }

      console.log(`Payment created: ${newTransactionId}`);

      // Simulate payment completion after 15 seconds (in real scenario, this would be a webhook)
      // Using setTimeout without blocking the response
      setTimeout(async () => {
        try {
          const { error: updateError } = await supabase
            .from("payments")
            .update({ status: "success" })
            .eq("transaction_id", newTransactionId);
          
          if (updateError) {
            console.error("Error updating payment status:", updateError);
          } else {
            console.log(`Payment ${newTransactionId} marked as success`);
          }
        } catch (e) {
          console.error("Error in delayed update:", e);
        }
      }, 15000);

      return new Response(
        JSON.stringify({ success: true, transactionId: newTransactionId, status: "pending" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "check") {
      // Check payment status
      if (!transactionId) {
        return new Response(
          JSON.stringify({ success: false, error: "Transaction ID required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("transaction_id", transactionId)
        .maybeSingle();

      if (error) {
        console.error("Error checking payment:", error);
        throw error;
      }

      if (!data) {
        return new Response(
          JSON.stringify({ success: false, error: "Payment not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`Payment ${transactionId} status: ${data.status}`);

      return new Response(
        JSON.stringify({ success: true, status: data.status, payment: data }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Payment error:", error);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
