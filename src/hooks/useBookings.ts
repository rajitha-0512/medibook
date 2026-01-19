import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Booking {
  id: string;
  hospital_name: string;
  doctor_name: string;
  specialization: string | null;
  slot_date: string;
  slot_time: string;
  fee: number;
  status: string;
  created_at: string;
}

export const useBookings = (userId: string | null) => {
  const [currentBookings, setCurrentBookings] = useState<Booking[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    if (!userId) {
      setCurrentBookings([]);
      setRecentBookings([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const current: Booking[] = [];
      const recent: Booking[] = [];

      (data || []).forEach((booking) => {
        // Parse date - assuming format like "Jan 20, 2026" or "2026-01-20"
        const bookingDate = new Date(booking.slot_date);
        
        if (bookingDate >= today && booking.status !== "cancelled") {
          current.push(booking);
        } else {
          recent.push(booking);
        }
      });

      setCurrentBookings(current);
      setRecentBookings(recent);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId);

      if (error) throw error;

      await fetchBookings();
      return true;
    } catch (error) {
      console.error("Error cancelling booking:", error);
      return false;
    }
  };

  const createBooking = async (bookingData: {
    hospital_id: string;
    doctor_id: string;
    slot_id?: string;
    payment_id?: string;
    hospital_name: string;
    doctor_name: string;
    specialization: string;
    slot_date: string;
    slot_time: string;
    fee: number;
  }) => {
    if (!userId) return null;

    try {
      const { data, error } = await supabase
        .from("bookings")
        .insert({
          user_id: userId,
          ...bookingData,
          status: "upcoming",
        })
        .select()
        .single();

      if (error) throw error;

      await fetchBookings();
      return data;
    } catch (error) {
      console.error("Error creating booking:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [userId]);

  return {
    currentBookings,
    recentBookings,
    loading,
    cancelBooking,
    createBooking,
    refetch: fetchBookings,
  };
};
