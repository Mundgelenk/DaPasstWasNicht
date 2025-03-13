import math
from typing import Tuple

def haversine_distance(
    lat1: float, 
    lon1: float, 
    lat2: float, 
    lon2: float
) -> float:
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees)
    Returns distance in kilometers
    """
    # Convert decimal degrees to radians
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    
    # Haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    r = 6371  # Radius of earth in kilometers
    
    return c * r

def is_within_radius(
    company_lat: float, 
    company_lon: float, 
    user_lat: float, 
    user_lon: float, 
    radius_km: float
) -> bool:
    """Check if user is within service radius of company"""
    distance = haversine_distance(company_lat, company_lon, user_lat, user_lon)
    return distance <= radius_km

def get_bounding_box(
    latitude: float, 
    longitude: float, 
    distance_km: float
) -> Tuple[float, float, float, float]:
    """
    Calculate a bounding box around a point given a distance in kilometers
    Returns (min_lat, min_lon, max_lat, max_lon)
    
    This is used for database query optimization before calculating exact distances
    """
    # Earth's radius in km
    earth_radius = 6371.0
    
    # Angular distance in radians
    angular_distance = distance_km / earth_radius
    
    # Convert latitude and longitude to radians
    lat_rad = math.radians(latitude)
    lon_rad = math.radians(longitude)
    
    # Calculate min and max latitudes
    min_lat = lat_rad - angular_distance
    max_lat = lat_rad + angular_distance
    
    # Calculate min and max longitudes
    delta_lon = math.asin(math.sin(angular_distance) / math.cos(lat_rad))
    min_lon = lon_rad - delta_lon
    max_lon = lon_rad + delta_lon
    
    # Convert back to degrees
    min_lat = math.degrees(min_lat)
    min_lon = math.degrees(min_lon)
    max_lat = math.degrees(max_lat)
    max_lon = math.degrees(max_lon)
    
    return (min_lat, min_lon, max_lat, max_lon) 