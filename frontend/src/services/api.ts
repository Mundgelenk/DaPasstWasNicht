import axios, { AxiosRequestConfig } from 'axios';
import { 
  Token, OAuthLoginRequest, 
  Company, NearbyCompany, CompanySearchParams,
  Issue, IssueDetail, IssueCreateRequest, IssueUpdateRequest,
  Response, ResponseCreateRequest,
  Donation, DonationCreateRequest, PaymentResponse
} from '../types/api';

// Create API client
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authentication interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication API
export const authAPI = {
  loginWithGoogle: (data: OAuthLoginRequest) => 
    apiClient.post<Token>('/auth/oauth/google', data),
    
  loginWithApple: (data: OAuthLoginRequest) => 
    apiClient.post<Token>('/auth/oauth/apple', data),
  
  // Get current user profile
  getProfile: () => apiClient.get('/users/me'),
};

// Companies API
export const companiesAPI = {
  // Get all companies
  getCompanies: (page = 1, limit = 10) => 
    apiClient.get<Company[]>('/companies', { params: { skip: (page - 1) * limit, limit } }),
  
  // Get company by ID
  getCompany: (id: number) => 
    apiClient.get<Company>(`/companies/${id}`),
  
  // Search companies by name or category
  searchCompanies: (query?: string, category?: string) => 
    apiClient.get<Company[]>('/companies/search', { params: { query, category } }),
  
  // Find nearby companies
  findNearbyCompanies: (params: CompanySearchParams) => 
    apiClient.post<NearbyCompany[]>('/companies/nearby', params),
};

// Issues API
export const issuesAPI = {
  // Get all issues with optional status filter
  getIssues: (page = 1, limit = 10, status?: string) => 
    apiClient.get<Issue[]>('/issues', { params: { skip: (page - 1) * limit, limit, status } }),
  
  // Get issue by ID
  getIssue: (id: number) => 
    apiClient.get<IssueDetail>(`/issues/${id}`),
  
  // Create new issue
  createIssue: (data: IssueCreateRequest) => {
    const formData = new FormData();
    formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.location) formData.append('location', data.location);
    if (data.assigned_company_id) formData.append('assigned_company_id', data.assigned_company_id.toString());
    if (data.latitude) formData.append('latitude', data.latitude.toString());
    if (data.longitude) formData.append('longitude', data.longitude.toString());
    formData.append('photo', data.photo);
    
    return apiClient.post<Issue>('/issues', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Update existing issue
  updateIssue: (id: number, data: IssueUpdateRequest) => 
    apiClient.put<Issue>(`/issues/${id}`, data),
};

// Responses API
export const responsesAPI = {
  // Get responses for an issue
  getIssueResponses: (issueId: number) => 
    apiClient.get<Response[]>(`/issues/${issueId}/responses`),
  
  // Create new response
  createResponse: (data: ResponseCreateRequest) => 
    apiClient.post<Response>('/responses', data),
};

// Donations API
export const donationsAPI = {
  // Create PayPal payment
  createPayment: (data: DonationCreateRequest) => 
    apiClient.post<PaymentResponse>('/donations/create-payment', data),
  
  // Execute PayPal payment
  executePayment: (paymentId: string, payerId: string) => 
    apiClient.get<Donation>(`/donations/execute-payment/${paymentId}`, { params: { payer_id: payerId } }),
};

export default apiClient; 