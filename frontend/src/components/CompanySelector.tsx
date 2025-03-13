import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Box, 
  Typography, 
  Button, 
  CircularProgress, 
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  Chip
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import { NearbyCompany, Company } from '../types/api';
import { companiesAPI } from '../services/api';

interface CompanySelectorProps {
  onCompanySelected: (companyId: number) => void;
  initialCompanyId?: number;
}

const CompanySelector: React.FC<CompanySelectorProps> = ({ 
  onCompanySelected, 
  initialCompanyId 
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCompany, setSelectedCompany] = useState<Company | NearbyCompany | null>(null);
  const [nearbyCompanies, setNearbyCompanies] = useState<NearbyCompany[]>([]);
  const [searchResults, setSearchResults] = useState<Company[]>([]);
  const [isLoadingNearby, setIsLoadingNearby] = useState<boolean>(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState<boolean>(false);

  // Fetch company details if initialCompanyId is provided
  useEffect(() => {
    if (initialCompanyId) {
      companiesAPI.getCompany(initialCompanyId)
        .then(response => {
          setSelectedCompany(response.data);
        })
        .catch(error => {
          console.error('Failed to fetch initial company:', error);
        });
    }
  }, [initialCompanyId]);

  // Get user's geolocation
  const getUserLocation = () => {
    setIsLoadingNearby(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        
        // Fetch nearby companies
        companiesAPI.findNearbyCompanies({ 
          latitude, 
          longitude, 
          max_distance_km: 50 
        })
          .then(response => {
            setNearbyCompanies(response.data);
            setIsLoadingNearby(false);
          })
          .catch(error => {
            console.error('Failed to fetch nearby companies:', error);
            setIsLoadingNearby(false);
          });
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationPermissionDenied(true);
        setIsLoadingNearby(false);
      }
    );
  };

  // Search companies by name
  const searchCompanies = () => {
    if (!searchQuery.trim()) return;
    
    setIsLoadingSearch(true);
    companiesAPI.searchCompanies(searchQuery)
      .then(response => {
        setSearchResults(response.data);
        setIsLoadingSearch(false);
      })
      .catch(error => {
        console.error('Failed to search companies:', error);
        setIsLoadingSearch(false);
      });
  };

  // Handle company selection
  const handleCompanySelect = (company: Company | NearbyCompany) => {
    setSelectedCompany(company);
    onCompanySelected(company.id);
  };

  return (
    <Box sx={{ mt: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Select the appropriate company
      </Typography>
      
      {/* Display selected company if any */}
      {selectedCompany && (
        <Box sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Selected company:
          </Typography>
          <Typography>{selectedCompany.name}</Typography>
          {'distance_km' in selectedCompany && (
            <Chip 
              icon={<LocationOnIcon />} 
              label={`${selectedCompany.distance_km} km away`}
              size="small"
              sx={{ mt: 1 }}
            />
          )}
          <Button 
            size="small" 
            sx={{ mt: 1 }}
            onClick={() => {
              setSelectedCompany(null);
              onCompanySelected(0); // Reset selection
            }}
          >
            Change
          </Button>
        </Box>
      )}
      
      {!selectedCompany && (
        <>
          {/* Location-based selection */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Find companies near your location
            </Typography>
            
            <Button
              variant="outlined"
              startIcon={<LocationOnIcon />}
              onClick={getUserLocation}
              disabled={isLoadingNearby}
              sx={{ mb: 2 }}
            >
              {isLoadingNearby ? 'Finding nearby companies...' : 'Use my location'}
            </Button>
            
            {locationPermissionDenied && (
              <Typography color="error" variant="body2">
                Location access denied. Please enable location services in your browser.
              </Typography>
            )}
            
            {isLoadingNearby && <CircularProgress size={20} sx={{ ml: 2 }} />}
            
            {!isLoadingNearby && nearbyCompanies.length > 0 && (
              <List sx={{ maxHeight: 300, overflow: 'auto', bgcolor: '#f5f5f5', borderRadius: 1 }}>
                {nearbyCompanies.map((company) => (
                  <React.Fragment key={company.id}>
                    <ListItemButton onClick={() => handleCompanySelect(company)}>
                      <ListItemText 
                        primary={company.name} 
                        secondary={
                          <>
                            <Typography component="span" variant="body2">
                              {company.distance_km} km away
                            </Typography>
                            {company.address && (
                              <Typography component="span" variant="body2" sx={{ display: 'block' }}>
                                {company.address}
                              </Typography>
                            )}
                          </>
                        }
                      />
                    </ListItemButton>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            )}
            
            {!isLoadingNearby && userLocation && nearbyCompanies.length === 0 && (
              <Typography color="textSecondary">
                No companies found near your location.
              </Typography>
            )}
          </Box>
          
          {/* Search-based selection */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Or search for a company
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                label="Company name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchCompanies()}
              />
              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={searchCompanies}
                disabled={isLoadingSearch || !searchQuery.trim()}
              >
                Search
              </Button>
            </Box>
            
            {isLoadingSearch && <CircularProgress size={20} sx={{ ml: 2 }} />}
            
            {!isLoadingSearch && searchResults.length > 0 && (
              <List sx={{ maxHeight: 300, overflow: 'auto', bgcolor: '#f5f5f5', borderRadius: 1 }}>
                {searchResults.map((company) => (
                  <React.Fragment key={company.id}>
                    <ListItemButton onClick={() => handleCompanySelect(company)}>
                      <ListItemText 
                        primary={company.name} 
                        secondary={
                          <>
                            {company.address && (
                              <Typography component="span" variant="body2">
                                {company.address}
                              </Typography>
                            )}
                            {company.service_categories && (
                              <Typography component="span" variant="body2" sx={{ display: 'block', mt: 0.5 }}>
                                Services: {company.service_categories}
                              </Typography>
                            )}
                          </>
                        }
                      />
                    </ListItemButton>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            )}
            
            {!isLoadingSearch && searchQuery && searchResults.length === 0 && (
              <Typography color="textSecondary">
                No companies found matching your search.
              </Typography>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default CompanySelector; 