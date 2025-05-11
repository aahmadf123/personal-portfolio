export interface Experience {
  id: number;
  company: string;
  position: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
  logo_url: string | null;
  location: string | null;
  is_featured: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  field_of_study: string | null;
  start_date: string;
  end_date: string | null;
  description: string | null;
  logo_url: string | null;
  location: string | null;
  gpa: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Certification {
  id: number;
  name: string;
  issuer: string;
  issue_date: string;
  expiry_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  description: string | null;
  logo_url: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  organization: string | null;
  award_date: string;
  expiry_date: string | null;
  award_url: string | null;
  image_url: string | null;
  achievement_type: string;
  location: string | null;
  is_featured: boolean;
  tags: string[] | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface TimelineItem {
  id: string | number;
  type: "education" | "work" | "project" | "achievement";
  title: string;
  organization?: string;
  description: string;
  startDate: string;
  endDate?: string | null;
  location?: string | null;
  tags?: string[];
  link?: string | null;
  image?: string | null;
}
