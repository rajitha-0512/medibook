import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";
import { useHospitals } from "@/hooks/useHospitals";

interface Hospital {
  id: string;
  name: string;
  location: string;
  status: "open" | "closed";
  rating: number;
  image: string;
  specialties: string[];
  upi_id?: string;
}

interface HospitalCarouselProps {
  onHospitalSelect: (hospital: Hospital) => void;
}

// Fallback hospitals if database is empty
const fallbackHospitals: Hospital[] = [
  {
    id: "1",
    name: "Apollo Hospital",
    location: "Chennai, Tamil Nadu",
    status: "open",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=250&fit=crop",
    specialties: ["Cardiology", "Neurology", "Orthopedics"],
  },
  {
    id: "2",
    name: "Fortis Healthcare",
    location: "Bangalore, Karnataka",
    status: "open",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=250&fit=crop",
    specialties: ["Oncology", "Gastroenterology", "Pediatrics"],
  },
  {
    id: "3",
    name: "Max Super Specialty",
    location: "New Delhi",
    status: "open",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=250&fit=crop",
    specialties: ["Cardiac Surgery", "Transplant", "Dermatology"],
  },
  {
    id: "4",
    name: "AIIMS Hospital",
    location: "New Delhi",
    status: "open",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=400&h=250&fit=crop",
    specialties: ["General Medicine", "Surgery", "ENT"],
  },
  {
    id: "5",
    name: "Medanta Hospital",
    location: "Gurugram, Haryana",
    status: "open",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=250&fit=crop",
    specialties: ["Neurosurgery", "Liver Transplant", "Urology"],
  },
];

const HospitalCarousel = ({ onHospitalSelect }: HospitalCarouselProps) => {
  const { hospitals: dbHospitals, loading } = useHospitals();
  
  // Map database hospitals to the expected format, or use fallback
  const hospitals: Hospital[] = dbHospitals.length > 0 
    ? dbHospitals.map(h => ({
        id: h.id,
        name: h.name,
        location: h.location || "Location not specified",
        status: (h.status === "open" ? "open" : "closed") as "open" | "closed",
        rating: h.rating || 4.5,
        image: h.image || "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=250&fit=crop",
        specialties: h.specialties || [],
        upi_id: h.upi_id || undefined,
      }))
    : fallbackHospitals;
  
  // Duplicate hospitals for seamless scrolling
  const duplicatedHospitals = [...hospitals, ...hospitals];

  if (loading) {
    return (
      <div className="flex gap-4 px-6 overflow-hidden">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-shrink-0 w-72 h-48 bg-card rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden -mx-6">
      <motion.div
        className="flex gap-4 px-6"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          x: {
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      >
        {duplicatedHospitals.map((hospital, index) => (
          <div
            key={`${hospital.id}-${index}`}
            onClick={() => onHospitalSelect(hospital)}
            className="flex-shrink-0 w-72 bg-card rounded-2xl overflow-hidden shadow-card border border-border cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="relative h-36">
              <img
                src={hospital.image}
                alt={hospital.name}
                className="w-full h-full object-cover"
              />
              <span
                className={`absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded-full ${
                  hospital.status === "open"
                    ? "bg-success text-success-foreground"
                    : "bg-destructive text-destructive-foreground"
                }`}
              >
                {hospital.status === "open" ? "Open" : "Closed"}
              </span>
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-foreground truncate">{hospital.name}</h4>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{hospital.location}</span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <Star className="w-4 h-4 text-accent fill-accent" />
                <span className="text-sm font-medium text-foreground">{hospital.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default HospitalCarousel;
