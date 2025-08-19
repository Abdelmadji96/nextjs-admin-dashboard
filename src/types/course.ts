export type CourseType = "ONLINE" | "ONSITE" | "FULL-TIME" | "PART-TIME" | "HYBRID";

export interface Course {
  id: number;
  title: string;
  type: CourseType;
  price: string;
  company: string;
  location: string;
  duration: string;
  rating: number;
  description?: string;
  startDate?: string;
  endDate?: string;
  maxStudents?: number;
  currentStudents?: number;
  instructor?: string;
  level?: "Beginner" | "Intermediate" | "Advanced";
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseFormData {
  title: string;
  type: CourseType;
  price: string;
  company: string;
  location: string;
  duration: string;
  rating: number;
  description?: string;
  startDate?: string;
  endDate?: string;
  maxStudents?: number;
  instructor?: string;
  level?: "Beginner" | "Intermediate" | "Advanced";
}

export interface CourseFormErrors {
  title?: string;
  type?: string;
  price?: string;
  company?: string;
  location?: string;
  duration?: string;
  rating?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  maxStudents?: string;
  instructor?: string;
  level?: string;
}

export interface CourseTableFilters {
  search: string;
  type: CourseType | "ALL";
  level: "Beginner" | "Intermediate" | "Advanced" | "ALL";
  sortBy: "title" | "price" | "rating" | "duration" | "createdAt";
  sortOrder: "asc" | "desc";
}
