export interface Diploma {
  id: number;
  title: string;
  institution: string;
  start_date: string;
  end_date: string | null;
  modality: string;
  description: string;
  verification_status: string;
  verified_at: string | null;
  is_current: boolean;
  diploma_level: {
    id: number;
    designation: string;
    diploma_type: {
      id: number;
      designation: string;
      created_at: string;
      updated_at: string;
    };
    created_at: string;
    updated_at: string;
  };
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Experience {
  id: number;
  job_title: string;
  company_name: string;
  start_date: string;
  end_date: string | null;
  modality: string;
  main_missions: string;
  company_address: string;
  is_current: boolean;
  degree: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CVLanguage {
  id: number;
  proficiency_level: string;
  language: {
    id: string;
    label: string;
    ar_label: string;
    created_at: string;
    updated_at: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CVSkill {
  id: number;
  percentage: number;
  skill: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Certification {
  id: number;
  name: string;
  obtention_date: string;
  created_at: string;
  updated_at: string;
}

export interface CV {
  id: number;
  cv_title: string;
  state: string;
  cv_update_count: number;
  last_published_at: string | null;
  diplomas: Diploma[];
  experiences: Experience[];
  cvLanguages: CVLanguage[];
  cvSkills: CVSkill[];
  certifications: Certification[];
  created_at: string;
  updated_at: string;
}

export interface City {
  id: number;
  name: string;
  ar_name: string;
  province: {
    id: number;
    name: string;
    ar_name: string;
    created_at: string;
    updated_at: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Nationality {
  id: string;
  name: string;
  code: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  uuid: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  user_type: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  email_verified_at: string | null;
  phone: string;
  marital_status: string;
  gender: "male" | "female";
  birth_date: string;
  street: string;
  identity_verification_state: string;
  completed_identity_at: string | null;
  completed_registration_at: string;
  city: City;
  nationality: Nationality;
  portfolio_url: string;
  linkedin_url: string;
  years_of_experience: number;
  profile_summary: string;
  has_driver_license: boolean;
  has_vehicle: boolean;
  completed_verification_at: string | null;
  cv: CV[];
}

export interface UserTableData {
  id: number;
  uuid: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  isEmailVerified: boolean;
  isIdentityVerified: boolean;
  isDiplomaVerified: boolean;
  user_type: string;
  registration_date: string;
  city: string;
  nationality: string;
  created_at: string;
  updated_at: string;
  cv_count: number;
  experience_count: number;
  diploma_count: number;
}
