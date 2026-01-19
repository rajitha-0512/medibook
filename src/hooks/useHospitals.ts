import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Hospital {
  id: string;
  name: string;
  location: string | null;
  status: string | null;
  rating: number | null;
  image: string | null;
  specialties: string[] | null;
  upi_id: string | null;
  mobile_number: string;
  hospital_code: string;
}

export interface Doctor {
  id: string;
  hospital_id: string;
  name: string;
  specialization: string;
  degree: string | null;
  fee: number;
  rating: number | null;
  reviews: number | null;
  available: boolean | null;
}

export const useHospitals = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHospitals = async () => {
    try {
      const { data, error } = await supabase
        .from("hospitals")
        .select("*")
        .order("rating", { ascending: false });

      if (error) throw error;
      setHospitals(data || []);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async (hospitalId: string): Promise<Doctor[]> => {
    try {
      const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .eq("hospital_id", hospitalId)
        .eq("available", true);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching doctors:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  return { hospitals, loading, fetchDoctors, refetch: fetchHospitals };
};
