const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function register(data: { email: string; password: string; name?: string }) {
  console.log('Attempting registration:', { email: data.email });
  
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();
  
  if (!response.ok) {
    console.error('Registration failed:', responseData);
    throw new Error(responseData.error || 'Registration failed');
  }

  console.log('Registration successful');
  return responseData;
}

export async function login(data: { email: string; password: string }) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    console.error('Login failed:', responseData);
    throw new Error(responseData.error || 'Login failed');
  }

  console.log('Login successful');
  return responseData;
}

export async function getCurrentUser(token: string) {
  const response = await fetch(`${API_URL}/auth/me`, {
    credentials: 'include',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get current user');
  }

  return response.json();
}
