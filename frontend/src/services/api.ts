import { BASE_URL } from "../config";

export interface RegisterLoginPayload {
	username: string;
	password: string;
  }
  
  export interface RegisterLoginResponse {
    username: string;
    token?: string;
    profileImgUrl: string;
    // refreshToken?: string;
  }
  
  // const BASE_URL = 'http://localhost:3000/';
  
  // When using this function, always catch the promise in case of error
  async function fetchWithToken(url: string, options?: RequestInit): Promise<Response> {
    let token = sessionStorage.getItem('access_token');
    options = {
      ...options,
      headers: {
        ...options?.headers,
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include', // Important to include for cookies
    };
    url = BASE_URL + url;
    console.log(url);
    let response = await fetch(url, options);

    // If token is expired, try to refresh
    if (response.status === 401 && token) {
        token = await refreshAccessToken();
        if (token) {
            options.headers = {
                ...options?.headers,
                'Authorization': `Bearer ${token}`
            };

            response = await fetch(url, options);  // Retry with new token
        }
        else {
          logout();
          throw new Error('Session expired. PLease login again.');
        }
    }

    return response;
}

  
  export async function registerUser(payload: RegisterLoginPayload): Promise<RegisterLoginResponse> {
	try {
	  const response = await fetchWithToken(`/register`, {
		method: 'POST',
    headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
    credentials: 'include'
	  });
  
	  const data = await response.json();
  
	  if (!response.ok) {
		throw new Error(data.message || 'Failed to register.');
	  }
  
	  return data;
	} catch (error) {
	  if (error instanceof Error) {
		  console.error('Error registering user:', error.message);
	  }
	  throw error;
	}
  }
  
// export async function loginUser(payload: RegisterLoginPayload): Promise<RegisterLoginResponse> {
//   try {
//     const response = await fetchWithToken(`/users/login`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(payload),
//     credentials: 'include', // Include for cookies
//     });

//     const data = await response.json();

//     if (data.token) {
//     localStorage.setItem('auth_token', data.token);
//   }

//     if (data.refreshToken) {
//     localStorage.setItem('refresh_token', data.refreshToken);
//   }
  export async function loginUser(payload: RegisterLoginPayload): Promise<RegisterLoginResponse> {
    try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include', // Include for cookies
    });
    
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid credentials. Please try again');
      }
      else {
        throw new Error(data.message || 'Failed to login.');
      }  
    }

    // Store the JWT token in localStorage
    console.log('api.ts login worked! data:', data.toString());
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error logging in user:', error.message);
    }
    throw error;
  }
}

export async function refreshAccessToken(): Promise<string | null> {
  try {
      // Just call the refresh endpoint, no need to send the refresh token
      const response = await fetchWithToken(`/users/refresh-token`, {
          method: 'POST',
          credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
          throw new Error(data.message || 'Failed to refresh token.');
      }

      if (data.token) {
          localStorage.setItem('auth_token', data.token);
          return data.token;
      }

      return null;
  } catch (error) {
      if (error instanceof Error) {
          console.error('Error refreshing token:', error.message);
      }
      throw error;
  }
}

export function logout() {
  // Call backend logout endpoint
  fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include', // Include for cookies
  }).then(() => {
    sessionStorage.removeItem('access_token');
    // Redirect user to login page or update state accordingly
  });
}

/* ****************************************************************
                  CHATROOM API CALLS FUNCTIONS 
**************************************************************** */

export const getChannels = async () => {
  try {
    // Replace with your actual base URL
    const response = await fetch(`${BASE_URL}/channels`, {
      method: 'GET',
      headers: {
        // Include headers as required, for example, for authentication
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // If the response is not ok, throw an error
      throw new Error('Network response was not ok');
    }

    // Parse the JSON response
    const channels = await response.json();
    return channels; // Returns the list of channels
  } catch (error) {
    // Handle or throw the error
    console.error('Error fetching channels:', error);
    throw error;
  }
};

// Only 50 messages max.
export const fetchLastMessagesFromChannel = async (channelId: number) => {
  try {
    const response = await fetch(`${BASE_URL}/channels/${channelId}/messages`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json',
    },
    });
    if (!response.ok) {
      throw new Error('Error fetching last messages from channel');
    }

    const messages = await response.json();
    return messages;
  } catch (err) {console.error('Error fetching last messages from channel');
      throw err;
    }
};



  export async function someAuthenticatedAPI() {
	const response = await fetchWithToken(`/some_authenticated_route`);
  
	// handle the response as per your requirement
	// e.g., convert to JSON or check status codes
  }
  
