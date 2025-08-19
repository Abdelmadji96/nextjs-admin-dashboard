// Dataset types for the application

export interface Degrees {
  id: number;
  designation: string;
  description?: string;
}

// Add other dataset types as needed
export interface Language {
  id: string;
  label: string;
  ar_label: string;
}

export interface Skill {
  id: number;
  name: string;
  category?: string;
}
