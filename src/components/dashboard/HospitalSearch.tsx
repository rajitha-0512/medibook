import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search, MapPin, Star, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface HospitalSearchProps {
  onBack: () => void;
  onHospitalSelect: (hospital: Hospital) => void;
}

const allHospitals: Hospital[] = [
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
    name: "City Care Hospital",
    location: "Mumbai, Maharashtra",
    status: "closed",
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=400&h=250&fit=crop",
    specialties: ["General Medicine", "Surgery", "ENT"],
  },
  {
    id: "5",
    name: "Life Line Hospital",
    location: "Hyderabad, Telangana",
    status: "open",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=250&fit=crop",
    specialties: ["Neurosurgery", "Pulmonology", "Urology"],
  },
  {
    id: "6",
    name: "Rainbow Children's Hospital",
    location: "Hyderabad, Telangana",
    status: "open",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=250&fit=crop",
    specialties: ["Pediatrics", "Neonatology", "Child Psychology"],
  },
];

const specialtyFilters = [
  "All",
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Oncology",
  "Dermatology",
];

const HospitalSearch = ({ onBack, onHospitalSelect }: HospitalSearchProps) => {
  const { hospitals: dbHospitals, loading } = useHospitals();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

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
    : allHospitals;

  const filteredHospitals = hospitals.filter((hospital) => {
    const matchesSearch =
      hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.specialties.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesSpecialty =
      selectedSpecialty === "All" ||
      hospital.specialties.includes(selectedSpecialty);

    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        className="bg-card px-6 pt-12 pb-6 border-b border-border sticky top-0 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h2 className="text-xl font-bold text-foreground">Find Hospitals</h2>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search hospitals, doctors, specialties..."
            className="pl-12 h-12 bg-secondary border-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>

        {/* Specialty Filters */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
          {specialtyFilters.map((specialty) => (
            <button
              key={specialty}
              onClick={() => setSelectedSpecialty(specialty)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedSpecialty === specialty
                  ? "gradient-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {specialty}
            </button>
          ))}
        </div>
      </motion.header>

      {/* Results */}
      <main className="px-6 py-6">
        <p className="text-sm text-muted-foreground mb-4">
          {filteredHospitals.length} hospitals found
        </p>

        <div className="space-y-4">
          {filteredHospitals.map((hospital, index) => (
            <motion.div
              key={hospital.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onHospitalSelect(hospital)}
              className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border cursor-pointer hover:shadow-card transition-shadow"
            >
              <div className="flex">
                <img
                  src={hospital.image}
                  alt={hospital.name}
                  className="w-28 h-28 object-cover"
                />
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground">{hospital.name}</h4>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>{hospital.location}</span>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        hospital.status === "open"
                          ? "bg-success/10 text-success"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {hospital.status === "open" ? "Open" : "Closed"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-4 h-4 text-accent fill-accent" />
                    <span className="text-sm font-medium text-foreground">{hospital.rating}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {hospital.specialties.slice(0, 2).map((specialty) => (
                      <span
                        key={specialty}
                        className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredHospitals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hospitals found matching your search</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default HospitalSearch;
