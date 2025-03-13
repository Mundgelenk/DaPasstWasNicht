import axios from 'axios';

// Mock data for development
const MOCK_COMPANIES = [
  {
    id: '1',
    name: 'Building Management Inc.',
    distance: 0.5,
    address: '123 Main Street, Anytown',
    categories: ['Structural', 'Electrical', 'Plumbing'],
    rating: 4.8,
    responseTime: '2 hours'
  },
  {
    id: '2',
    name: 'Quick Fix Solutions',
    distance: 1.2,
    address: '456 Oak Avenue, Anytown',
    categories: ['Plumbing', 'HVAC'],
    rating: 4.5,
    responseTime: '3 hours'
  },
  {
    id: '3',
    name: 'Electro Maintenance LLC',
    distance: 2.1,
    address: '789 Pine Road, Anytown',
    categories: ['Electrical', 'Lighting'],
    rating: 4.7,
    responseTime: '1 hour'
  },
  {
    id: '4',
    name: 'AllFix Repairs',
    distance: 3.5,
    address: '101 Cedar Lane, Anytown',
    categories: ['Structural', 'Plumbing', 'Electrical', 'HVAC', 'Lighting'],
    rating: 4.9,
    responseTime: '4 hours'
  }
];

// Type for the location data
export type Location = {
  latitude: number;
  longitude: number;
  accuracy?: number;
};

// Company type
export type Company = {
  id: string;
  name: string;
  distance: number;
  address: string;
  categories: string[];
  rating: number;
  responseTime: string;
};

/**
 * Get the user's current location
 */
export const getCurrentLocation = (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
};

/**
 * Get companies near the user's location
 * @param location The user's location
 * @param radius The search radius in kilometers
 */
export const getNearbyCompanies = async (
  location: Location,
  radius: number = 5
): Promise<Company[]> => {
  try {
    // This would be replaced with an actual API call in production
    // const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/companies/nearby`, {
    //   params: {
    //     latitude: location.latitude,
    //     longitude: location.longitude,
    //     radius
    //   }
    // });
    // return response.data;
    
    // For development, return mock data
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Sort by distance to simulate location-based filtering
    return MOCK_COMPANIES.sort((a, b) => a.distance - b.distance);
  } catch (error) {
    console.error('Error fetching nearby companies:', error);
    throw error;
  }
};

/**
 * Submit a repair request to a company
 * @param companyId The ID of the company
 * @param issueData The issue data
 */
export const submitRepairRequest = async (
  companyId: string,
  issueData: {
    imageUrl: string;
    description: string;
    location?: Location;
  }
): Promise<{ success: boolean; requestId: string }> => {
  try {
    // This would be replaced with an actual API call in production
    // const response = await axios.post(
    //   `${process.env.REACT_APP_API_URL}/api/v1/companies/${companyId}/repair-requests`,
    //   issueData
    // );
    // return response.data;
    
    // For development, simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      success: true,
      requestId: `req-${Math.random().toString(36).substring(2, 10)}`
    };
  } catch (error) {
    console.error('Error submitting repair request:', error);
    throw error;
  }
}; 