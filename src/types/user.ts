export interface UserProfile {
  name: string;
  age: string;
  gender: string;
  phone: string;
  email?: string;
  avatar?: string;
}

export interface HospitalProfile {
  hospitalName: string;
  mobileNumber: string;
  hospitalCode: string;
  location: string;
  qrDetails: string;
}
