// API Response Interfaces - Updated with real structure

import { Degrees } from "./dataset";

export interface DiplomaType {
  id: number;
  designation: string;
}

export interface DiplomaLevel {
  id: number;
  designation: string;
  diploma_type: DiplomaType;
}

export interface Diploma {
  id: number;
  title: string;
  institution: string;
  start_date: string;
  end_date: string;
  modality: string;
  verification_status: string;
  diploma_level: DiplomaLevel;
  description: string;
  is_current: boolean;
}

export interface Experience {
  id: number;
  job_title: string;
  company_name: string;
  start_date: string;
  end_date: string;
  modality: string;
  main_missions: string;
  company_address: string;
  is_current: boolean;
  degree: Degrees;
}

export interface CVLanguage {
  id: number;
  proficiency_level: string;
  language: {
    id: string;
    label: string;
    ar_label: string;
  };
}

export interface CVSkill {
  id: number;
  percentage: number;
  skill: {
    id: number;
    name: string;
  };
}

export interface Certification {
  id: number;
  name: string;
  obtention_date: string;
}

export interface CV {
  id: number;
  cv_title: string;
  state: string;
  diplomas: Diploma[];
  experiences: Experience[];
  cvLanguages: CVLanguage[];
  cvSkills: CVSkill[];
  certifications: Certification[];
}

export interface Province {
  id: number;
  name: string;
  ar_name: string;
}

export interface City {
  id: number;
  name: string;
  ar_name: string;
  province: Province;
}

export interface Nationality {
  id: string;
  name: string;
  code: string;
}

export interface User {
  id: number;
  uuid: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: string;
  phone: string;
  marital_status: string;
  gender: "male" | "female";
  birth_date: string;
  street: string;
  personal_form_filled: boolean;
  identity_verification_state: string;
  city: City;
  nationality: Nationality;
  portfolio_url: string;
  linkedin_url: string;
  academic_bg_form_filled: boolean;
  experience_form_filled: boolean;
  skills_form_filled: boolean;
  verify_identity_form_filled: boolean;
  verify_diploma_form_filled: boolean;
  years_of_experience: number;
  profile_summary: string;
  has_driver_license: boolean;
  has_vehicle: boolean;
  cv: CV[];
  email_verified_at: string;
  completed_registration_at: string;
  completed_identity_at: string;
  completed_verification_at: string;
}

export interface VerifyIdentityFormData {
  avatar: File | null;
  id_card_front: File | null;
  id_card_back: File | null;
}

// For support tickets (keeping the existing structure)
export interface SupportTicket {
  id: string;
  submissionDate: string;
  applicantName: string;
  documentType: string;
  status: "pending" | "approved" | "rejected" | "under_review";
  priority: "low" | "medium" | "high";
}

// Extended interfaces for verification tables
export interface DiplomaVerification extends Diploma {
  applicantName: string;
  submissionDate: string;
  status: "pending" | "approved" | "rejected" | "under_review";
  priority: "low" | "medium" | "high";
}

export interface IdentityVerification {
  id: string;
  user: User;
  submissionDate: string;
  status: "pending" | "approved" | "rejected" | "under_review";
  priority: "low" | "medium" | "high";
  documents: VerifyIdentityFormData;
}

export interface UserVerification {
  id: string;
  user: User;
  submissionDate: string;
  status: "pending" | "approved" | "rejected" | "under_review";
  priority: "low" | "medium" | "high";
  verificationType: "account" | "business" | "premium" | "professional";
}
