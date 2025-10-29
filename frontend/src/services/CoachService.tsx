import type { Coach } from '../models/Coach.tsx';
import type { CoachFormData } from '../components/CoachForm';

// Base URL for your backend API
const API_BASE_URL = 'http://localhost:8080/api/coaches';

/**
 * Submits the new coach data to the backend.
 * @param coachData The data from the creation form.
 * @returns A Promise resolving to the newly created Coach object.
 */
export const createCoach = async (coachData: CoachFormData): Promise<Coach> => {
  console.log('Submitting new coach...', coachData);

  // --- REAL FETCH LOGIC ---
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(coachData),
    });

    if (!response.ok) {
      // Try to parse error body if available
      const errorBody = await response.text();
      throw new Error(`Failed to create coach: ${response.statusText} - ${errorBody}`);
    }
    
    const newCoach = await response.json();
    console.log('Coach created successfully via API:', newCoach);
    return newCoach as Coach;

  } catch (error) {
    console.error('Error creating coach:', error);
    // Re-throw the error so the component can handle it
    throw error;
  }
};


/**
 * Fetches all coaches from the backend API.
 * This function is the "service" that talks to the controller.
 * * @returns A promise that resolves to an array of Coach objects.
 * @throws An error if the network response is not ok.
 */
export const getAllCoaches = async (): Promise<Coach[]> => {
  // Call the controller endpoint
  const response = await fetch(`${API_BASE_URL}`);

  if (!response.ok) {
    // Try to get more error details from the response body
    const errorText = await response.text();
    throw new Error(`Failed to fetch coaches: ${response.status} ${response.statusText} - ${errorText}`);
  }

  // Parse the JSON response
  const data: Coach[] = await response.json();
  return data;
};

/**
 * Fetches a single coach by their ID from the backend API.
 * @param id The ID of the coach to fetch.
 * @returns A promise that resolves to a single Coach object.
 */
export const getCoachById = async (id: string): Promise<Coach> => {
  const response = await fetch(`${API_BASE_URL}/${id}`); // Calls GET /api/coaches/{id}

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Coach not found with id: ${id}`);
    }
    const errorText = await response.text();
    throw new Error(`Failed to fetch coach: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data: Coach = await response.json();
  return data;
};

