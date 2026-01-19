-- Create profiles table for users
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  age TEXT,
  gender TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id),
  UNIQUE(phone)
);

-- Create hospitals table
CREATE TABLE public.hospitals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  hospital_code TEXT NOT NULL UNIQUE,
  location TEXT,
  upi_id TEXT,
  rating NUMERIC DEFAULT 4.5,
  image TEXT,
  specialties TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create doctors table
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  degree TEXT,
  fee NUMERIC NOT NULL DEFAULT 500,
  rating NUMERIC DEFAULT 4.5,
  reviews INTEGER DEFAULT 0,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create slots table
CREATE TABLE public.slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  booked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(doctor_id, date, time)
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  hospital_id UUID REFERENCES public.hospitals(id) NOT NULL,
  doctor_id UUID REFERENCES public.doctors(id) NOT NULL,
  slot_id UUID REFERENCES public.slots(id),
  payment_id UUID REFERENCES public.payments(id),
  hospital_name TEXT NOT NULL,
  doctor_name TEXT NOT NULL,
  specialization TEXT,
  slot_date TEXT NOT NULL,
  slot_time TEXT NOT NULL,
  fee NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Hospitals policies (publicly viewable for users to browse)
CREATE POLICY "Anyone can view hospitals"
ON public.hospitals FOR SELECT
USING (true);

CREATE POLICY "Hospital owners can insert their hospital"
ON public.hospitals FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Hospital owners can update their hospital"
ON public.hospitals FOR UPDATE
USING (auth.uid() = user_id);

-- Doctors policies (publicly viewable)
CREATE POLICY "Anyone can view doctors"
ON public.doctors FOR SELECT
USING (true);

CREATE POLICY "Hospital owners can manage doctors"
ON public.doctors FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM public.hospitals WHERE id = hospital_id AND user_id = auth.uid())
);

CREATE POLICY "Hospital owners can update doctors"
ON public.doctors FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM public.hospitals WHERE id = hospital_id AND user_id = auth.uid())
);

CREATE POLICY "Hospital owners can delete doctors"
ON public.doctors FOR DELETE
USING (
  EXISTS (SELECT 1 FROM public.hospitals WHERE id = hospital_id AND user_id = auth.uid())
);

-- Slots policies (publicly viewable for booking)
CREATE POLICY "Anyone can view slots"
ON public.slots FOR SELECT
USING (true);

CREATE POLICY "Hospital owners can manage slots via doctors"
ON public.slots FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.doctors d
    JOIN public.hospitals h ON d.hospital_id = h.id
    WHERE d.id = doctor_id AND h.user_id = auth.uid()
  )
);

CREATE POLICY "Hospital owners can update slots"
ON public.slots FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.doctors d
    JOIN public.hospitals h ON d.hospital_id = h.id
    WHERE d.id = doctor_id AND h.user_id = auth.uid()
  )
);

-- Bookings policies
CREATE POLICY "Users can view their own bookings"
ON public.bookings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
ON public.bookings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
ON public.bookings FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Hospital owners can view their bookings"
ON public.bookings FOR SELECT
USING (
  EXISTS (SELECT 1 FROM public.hospitals WHERE id = hospital_id AND user_id = auth.uid())
);

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_payments_updated_at();

CREATE TRIGGER update_hospitals_updated_at
BEFORE UPDATE ON public.hospitals
FOR EACH ROW
EXECUTE FUNCTION public.update_payments_updated_at();

CREATE TRIGGER update_doctors_updated_at
BEFORE UPDATE ON public.doctors
FOR EACH ROW
EXECUTE FUNCTION public.update_payments_updated_at();

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_payments_updated_at();