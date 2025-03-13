// Authentication
export interface Token {
  access_token: string;
  token_type: string;
}

export interface OAuthLoginRequest {
  token: string;
}

// User
export interface User {
  id: number;
  email: string;
  name: string;
  profile_picture?: string;
  is_verified: boolean;
}

// Company
export interface Company {
  id: number;
  name: string;
  email: string;
  description?: string;
  website?: string;
  phone?: string;
  address?: string;
  service_categories?: string;
  is_verified: boolean;
}

export interface NearbyCompany {
  id: number;
  name: string;
  distance_km: number;
  address?: string;
  service_categories?: string;
}

export interface CompanySearchParams {
  query?: string;
  latitude?: number;
  longitude?: number;
  max_distance_km?: number;
  service_category?: string;
}

// Issue
export interface Issue {
  id: number;
  title: string;
  description?: string;
  location?: string;
  photo_path: string;
  status: string;
  created_at: string;
  updated_at?: string;
  reporter_id: number;
  assigned_company_id?: number;
}

export interface IssueDetail extends Issue {
  company_name?: string;
  company_email?: string;
  company_phone?: string;
  response_count: number;
}

export interface IssueCreateRequest {
  title: string;
  description?: string;
  location?: string;
  assigned_company_id?: number;
  latitude?: number;
  longitude?: number;
  photo: File;
}

export interface IssueUpdateRequest {
  title?: string;
  description?: string;
  location?: string;
  status?: string;
  assigned_company_id?: number;
}

// Response
export interface Response {
  id: number;
  content: string;
  status_update?: string;
  created_at: string;
  updated_at?: string;
  issue_id: number;
  company_id: number;
  company_name?: string;
}

export interface ResponseCreateRequest {
  content: string;
  status_update?: string;
  issue_id: number;
}

// Donation
export interface Donation {
  id: number;
  amount: number;
  currency: string;
  payment_id: string;
  payment_status: string;
  created_at: string;
  updated_at?: string;
  issue_id: number;
  company_id: number;
  recipient_id: number;
}

export interface DonationCreateRequest {
  amount: number;
  currency: string;
  issue_id: number;
}

export interface PaymentResponse {
  approval_url: string;
  payment_id: string;
} 