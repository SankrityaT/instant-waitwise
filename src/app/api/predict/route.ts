import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define types for our data
interface HospitalFeatures {
  id: string;
  name: string;
  region: string;
  facilitySize: number;
  averageWaitTimes: {
    overall: number;
    byUrgency: {
      Critical: number;
      High: number;
      Medium: number;
      Low: number;
    };
    byTimeOfDay: {
      'Early Morning': number;
      'Late Morning': number;
      'Afternoon': number;
      'Evening': number;
      'Night': number;
    };
    bySeason: {
      Winter: number;
      Spring: number;
      Summer: number;
      Fall: number;
    };
  };
  nurseToPatientRatio: number;
  specialistAvailability: number;
  patientSatisfaction: number;
  visitCount: number;
}

interface HospitalWithDistance extends HospitalFeatures {
  distance: number; // Distance in kilometers
}

// Mock hospital coordinates (in a real app, these would come from a database)
const hospitalCoordinates: Record<string, { lat: number; lon: number }> = {
  // Original California hospitals
  'HOSP-1': { lat: 37.7749, lon: -122.4194 }, // San Francisco
  'HOSP-2': { lat: 37.3382, lon: -121.8863 }, // San Jose
  'HOSP-3': { lat: 38.5816, lon: -121.4944 }, // Sacramento
  'HOSP-4': { lat: 36.7783, lon: -119.4179 }, // Fresno
  'HOSP-5': { lat: 34.0522, lon: -118.2437 }, // Los Angeles
  
  // New York City hospitals
  'NYC-1': { lat: 40.8142, lon: -73.9419 }, // Harlem Hospital Center
  'NYC-2': { lat: 40.7845, lon: -73.9440 }, // Metropolitan Hospital Center
  'NYC-3': { lat: 40.7392, lon: -73.9767 }, // Bellevue Hospital Center
  'NYC-4': { lat: 40.8019, lon: -73.9662 }, // Mount Sinai St Luke's Roosevelt Hospital
  'NYC-5': { lat: 40.7644, lon: -73.9552 }, // New York-Presbyterian Hospital
  'NYC-6': { lat: 40.7900, lon: -73.9526 }, // Mount Sinai Hospital
  
  // Phoenix hospitals
  'PHX-1': { lat: 33.4805, lon: -112.0741 }, // Banner University Medical Center Phoenix
  'PHX-2': { lat: 33.6107, lon: -111.8910 }, // Mayo Clinic Hospital
  'PHX-3': { lat: 33.4794, lon: -112.0980 }, // St. Joseph's Hospital And Medical Center
  
  // London hospitals
  'LON-1': { lat: 51.4987, lon: -0.1178 }, // St. Thomas' Hospital
  'LON-2': { lat: 51.5182, lon: -0.0594 }, // Royal London Hospital
  'LON-3': { lat: 51.5246, lon: -0.1357 }  // University College Hospital
};

// Function to calculate distance between two coordinates using Haversine formula
function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Mock traffic data API (in a real app, this would call a traffic API)
async function getTrafficCondition(lat: number, lon: number): Promise<string> {
  // Simulate traffic conditions based on time of day
  const hour = new Date().getHours();
  
  // Rush hours typically have heavier traffic
  if ((hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 18)) {
    return 'Heavy';
  } else if ((hour >= 10 && hour <= 15) || (hour >= 19 && hour <= 20)) {
    return 'Moderate';
  } else {
    return 'Light';
  }
}

// Mock weather data API (in a real app, this would call a weather API)
async function getWeatherCondition(lat: number, lon: number): Promise<string> {
  // Simulate weather conditions (in a real app, would call a weather API)
  const conditions = ['Clear', 'Cloudy', 'Rainy', 'Snowy', 'Stormy'];
  const randomIndex = Math.floor(Math.random() * conditions.length);
  return conditions[randomIndex];
}

// Mock local events API (in a real app, this would call an events API)
async function getLocalEvents(lat: number, lon: number): Promise<string[]> {
  // Simulate local events that might impact hospital traffic
  const events = [
    'Sports Game',
    'Concert',
    'Festival',
    'Marathon',
    'Convention'
  ];
  
  // Randomly decide if there are events happening
  const hasEvents = Math.random() > 0.7;
  
  if (hasEvents) {
    const numEvents = Math.floor(Math.random() * 2) + 1; // 1 or 2 events
    const selectedEvents = [];
    
    for (let i = 0; i < numEvents; i++) {
      const randomIndex = Math.floor(Math.random() * events.length);
      selectedEvents.push(events[randomIndex]);
      // Remove the selected event to avoid duplicates
      events.splice(randomIndex, 1);
    }
    
    return selectedEvents;
  }
  
  return [];
}

// Function to simulate different locations for testing
function simulateUserLocation(requestedLatitude: number, requestedLongitude: number): { latitude: number, longitude: number } {
  // If the coordinates are close to 0,0 (default values), provide a simulated location
  if (Math.abs(requestedLatitude) < 1 && Math.abs(requestedLongitude) < 1) {
    // Randomly choose between different city locations for testing
    const locations = [
      { latitude: 37.7749, longitude: -122.4194 }, // San Francisco
      { latitude: 40.7128, longitude: -74.0060 }, // New York
      { latitude: 33.4484, longitude: -112.0740 }, // Phoenix
      { latitude: 51.5074, longitude: -0.1278 }   // London
    ];
    
    const randomIndex = Math.floor(Math.random() * locations.length);
    return locations[randomIndex];
  }
  
  // Otherwise return the requested coordinates
  return { latitude: requestedLatitude, longitude: requestedLongitude };
}

// Helper function to get the current time of day
function getCurrentTimeOfDay(): 'Early Morning' | 'Late Morning' | 'Afternoon' | 'Evening' | 'Night' {
  const hour = new Date().getHours();
  
  if (hour >= 0 && hour < 6) {
    return 'Early Morning';
  } else if (hour >= 6 && hour < 12) {
    return 'Late Morning';
  } else if (hour >= 12 && hour < 18) {
    return 'Afternoon';
  } else if (hour >= 18 && hour < 22) {
    return 'Evening';
  } else {
    return 'Night';
  }
}

// Helper function to get the current season
function getCurrentSeason(): 'Winter' | 'Spring' | 'Summer' | 'Fall' {
  const month = new Date().getMonth();
  
  if (month >= 0 && month < 3) {
    return 'Winter';
  } else if (month >= 3 && month < 6) {
    return 'Spring';
  } else if (month >= 6 && month < 9) {
    return 'Summer';
  } else {
    return 'Fall';
  }
}

// Helper function to get the day of the week information
function getDayInfo(): { dayOfWeek: string, isWeekend: boolean } {
  const dayOfWeek = new Date().toLocaleString('en-US', { weekday: 'long' });
  const isWeekend = dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday';
  
  return { dayOfWeek, isWeekend };
}

// Calculate a dynamic confidence score based on multiple factors
function calculateConfidenceScore(hospital: HospitalFeatures, distance: number) {
  // Base confidence starts at 0.9 (90%)
  let confidenceScore = 0.9;
  
  // Reduce confidence based on distance (farther = less confident)
  // Subtract up to 0.1 for distances over 20km
  const distanceFactor = Math.min(0.1, distance / 200);
  confidenceScore -= distanceFactor;
  
  // Reduce confidence if we have limited historical data
  // visitCount is the number of data points we have for this hospital
  if (hospital.visitCount < 10) {
    confidenceScore -= 0.1;
  }
  
  // Adjust based on time of day - we might be less confident during unusual hours
  const hour = new Date().getHours();
  if (hour < 6 || hour > 22) {
    confidenceScore -= 0.05;
  }
  
  // Ensure confidence stays between 0.5 and 0.95
  return Math.max(0.5, Math.min(0.95, confidenceScore));
}

// At the top of the file, add a debug function
function debug(...args: any[]) {
  console.log('[PREDICT API]', new Date().toISOString(), ...args);
}

export async function GET(request: NextRequest) {
  debug('Request received', request.nextUrl.searchParams.toString());
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const requestedLatitude = parseFloat(searchParams.get('latitude') || '0');
    const requestedLongitude = parseFloat(searchParams.get('longitude') || '0');
    const urgencyLevel = searchParams.get('urgency') || 'Medium';
    
    debug('Parameters:', { requestedLatitude, requestedLongitude, urgencyLevel });
    
    // Simulate different locations for testing
    const { latitude, longitude } = simulateUserLocation(requestedLatitude, requestedLongitude);
    debug('Simulated location:', { latitude, longitude });
    
    // Validate coordinates
    if (latitude === 0 && longitude === 0) {
      return NextResponse.json(
        { error: 'Invalid coordinates. Please provide latitude and longitude.' },
        { status: 400 }
      );
    }
    
    // Load hospital features from the processed data
    const originalDataPath = path.join(process.cwd(), 'data', 'hospital-features.json');
    const realDataPath = path.join(process.cwd(), 'data', 'real-hospital-features.json');

    if (!fs.existsSync(originalDataPath) || !fs.existsSync(realDataPath)) {
      return NextResponse.json(
        { error: 'Hospital data not found. Please check the data directory.' },
        { status: 500 }
      );
    }

    // Load and combine both datasets
    const originalHospitalFeatures: HospitalFeatures[] = JSON.parse(
      fs.readFileSync(originalDataPath, 'utf-8')
    );

    const realHospitalFeatures: HospitalFeatures[] = JSON.parse(
      fs.readFileSync(realDataPath, 'utf-8')
    );

    // Combine the datasets
    const hospitalFeatures: HospitalFeatures[] = [
      ...originalHospitalFeatures,
      ...realHospitalFeatures
    ];
    
    // Calculate distance for each hospital
    const hospitalsWithDistance: HospitalWithDistance[] = hospitalFeatures.map(hospital => {
      const coords = hospitalCoordinates[hospital.id];
      
      if (!coords) {
        // If coordinates not found, use a default large distance
        return {
          ...hospital,
          distance: 9999
        };
      }
      
      const distance = calculateDistance(latitude, longitude, coords.lat, coords.lon);
      
      return {
        ...hospital,
        distance
      };
    });
    
    // Sort hospitals by distance
    const sortedHospitals = hospitalsWithDistance
      .sort((a, b) => a.distance - b.distance);
    
    // Select a representative sample of hospitals from each region to ensure diversity
    const regionMap: Record<string, HospitalWithDistance[]> = {};
    
    sortedHospitals.forEach(hospital => {
      const region = hospital.region.split(',')[0].trim();
      if (!regionMap[region]) {
        regionMap[region] = [];
      }
      regionMap[region].push(hospital);
    });
    
    // Take up to 3 hospitals from each region
    const selectedHospitals: HospitalWithDistance[] = [];
    Object.values(regionMap).forEach(hospitals => {
      selectedHospitals.push(...hospitals.slice(0, 3));
    });
    
    // Sort the selected hospitals by distance
    selectedHospitals.sort((a, b) => a.distance - b.distance);
    
    // Get real-time contextual data
    const trafficCondition = await getTrafficCondition(latitude, longitude);
    const weatherCondition = await getWeatherCondition(latitude, longitude);
    const localEvents = await getLocalEvents(latitude, longitude);
    
    // Calculate predictions without using Groq AI for faster response
    const hospitalsWithPredictions = selectedHospitals.map(hospital => {
      // Calculate estimated wait time based on urgency, time of day, and season
      const currentTimeOfDay = getCurrentTimeOfDay();
      const currentSeason = getCurrentSeason();
      const { dayOfWeek, isWeekend } = getDayInfo();
      
      const baseWaitTime = hospital.averageWaitTimes.byUrgency[urgencyLevel as keyof typeof hospital.averageWaitTimes.byUrgency] || hospital.averageWaitTimes.overall;
      const timeOfDayFactor = hospital.averageWaitTimes.byTimeOfDay[currentTimeOfDay as keyof typeof hospital.averageWaitTimes.byTimeOfDay] / hospital.averageWaitTimes.overall;
      const seasonFactor = hospital.averageWaitTimes.bySeason[currentSeason as keyof typeof hospital.averageWaitTimes.bySeason] / hospital.averageWaitTimes.overall;
      const dayOfWeekFactor = isWeekend ? 1.2 : 1.0; // Assume weekends are 20% busier
      
      // Apply traffic and weather factors
      const trafficFactor = trafficCondition === 'Heavy' ? 1.15 : trafficCondition === 'Moderate' ? 1.05 : 1.0;
      const weatherFactor = weatherCondition === 'Stormy' ? 1.2 : weatherCondition === 'Rainy' ? 1.1 : 1.0;
      
      // Calculate the final predicted wait time
      const predictedWaitTime = Math.round(baseWaitTime * timeOfDayFactor * seasonFactor * dayOfWeekFactor * trafficFactor * weatherFactor);
      
      // Create factors array for display
      const otherFactors = [];
      if (trafficCondition !== 'Light') otherFactors.push(`${trafficCondition} traffic conditions`);
      if (weatherCondition !== 'Clear') otherFactors.push(`${weatherCondition} weather`);
      if (localEvents.length > 0) otherFactors.push(`Local events: ${localEvents.join(', ')}`);
      if (isWeekend) otherFactors.push('Weekend hours');
      
      // Calculate dynamic confidence score
      const confidenceScore = calculateConfidenceScore(hospital, hospital.distance);
      
      return {
        id: hospital.id,
        name: hospital.name,
        region: hospital.region,
        distance: hospital.distance,
        facilitySize: hospital.facilitySize,
        nurseToPatientRatio: hospital.nurseToPatientRatio,
        patientSatisfaction: hospital.patientSatisfaction,
        historicalWaitTime: hospital.averageWaitTimes.overall,
        prediction: {
          predictedWaitTime: predictedWaitTime,
          confidenceScore: confidenceScore,
          factors: {
            baseWaitTime: baseWaitTime,
            timeOfDayFactor: timeOfDayFactor,
            seasonFactor: seasonFactor,
            dayOfWeekFactor: dayOfWeekFactor,
            trafficFactor: trafficFactor,
            weatherFactor: weatherFactor,
            otherFactors: otherFactors
          }
        }
      };
    });
    
    // Before loading hospital features
    debug('Loading hospital features from files');
    
    // After loading hospital features
    debug(`Loaded ${hospitalFeatures.length} hospital features`);
    
    // Before calculating distances
    debug('Calculating distances for hospitals');
    
    // After sorting hospitals
    debug(`Sorted ${sortedHospitals.length} hospitals by distance`);
    
    // After selecting hospitals
    debug(`Selected ${selectedHospitals.length} hospitals for prediction`);
    
    // Before getting contextual data
    debug('Getting contextual data (traffic, weather, events)');
    
    // After getting contextual data
    debug('Contextual data:', { trafficCondition, weatherCondition, localEvents: localEvents.length });
    
    // Before calculating predictions
    debug('Calculating predictions for hospitals');
    
    // After calculating predictions
    debug(`Generated predictions for ${hospitalsWithPredictions.length} hospitals`);
    
    // Before returning response
    debug('Returning response to client');
    
    return NextResponse.json({
      hospitals: hospitalsWithPredictions,
      contextualFactors: {
        trafficCondition,
        weatherCondition,
        localEvents,
        urgencyLevel
      }
    });
    
  } catch (error) {
    debug('ERROR:', error);
    console.error('Error predicting wait times:', error);
    return NextResponse.json(
      { error: 'Failed to predict wait times' },
      { status: 500 }
    );
  }
}
