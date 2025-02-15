const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005/api';

export async function register(data: { email: string; password: string; name?: string }) {
  const url = `${API_URL}/auth/register`;
  console.log('Making registration request to:', url);
  console.log('API_URL:', process.env.NEXT_PUBLIC_API_URL);
  console.log('Request data:', data);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  console.log('Response status:', response.status);
  console.log('Response headers:', Object.fromEntries(response.headers.entries()));

  let responseData;
  try {
    const text = await response.text();
    console.log('Raw response:', text);
    responseData = text ? JSON.parse(text) : null;
  } catch (error) {
    console.error('Failed to parse response:', error);
    throw new Error('Server response was not valid JSON');
  }
  
  if (!response.ok) {
    console.error('Registration failed:', responseData);
    throw new Error(responseData?.error || 'Registration failed');
  }

  console.log('Registration successful:', responseData);
  return responseData;
}

export async function login(data: { email: string; password: string }) {
  const url = `${API_URL}/auth/login`;
  console.log('Making login request to:', url);
  console.log('API_URL:', process.env.NEXT_PUBLIC_API_URL);
  console.log('Request data:', data);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  console.log('Response status:', response.status);
  console.log('Response headers:', Object.fromEntries(response.headers.entries()));

  let responseData;
  try {
    const text = await response.text();
    console.log('Raw response:', text);
    responseData = text ? JSON.parse(text) : null;
  } catch (error) {
    console.error('Failed to parse response:', error);
    throw new Error('Server response was not valid JSON');
  }

  if (!response.ok) {
    console.error('Login failed:', responseData);
    throw new Error(responseData?.error || 'Login failed');
  }

  console.log('Login successful:', responseData);
  return responseData;
}

export async function getCurrentUser(token: string) {
  const url = `${API_URL}/auth/me`;
  console.log('Making get current user request to:', url);
  console.log('API_URL:', process.env.NEXT_PUBLIC_API_URL);
  console.log('Token:', token);
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });

  console.log('Response status:', response.status);
  console.log('Response headers:', Object.fromEntries(response.headers.entries()));

  let responseData;
  try {
    const text = await response.text();
    console.log('Raw response:', text);
    responseData = text ? JSON.parse(text) : null;
  } catch (error) {
    console.error('Failed to parse response:', error);
    throw new Error('Server response was not valid JSON');
  }

  if (!response.ok) {
    throw new Error('Failed to get current user');
  }

  console.log('Get current user successful:', responseData);
  return responseData;
}
