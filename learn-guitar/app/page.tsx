'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
        localStorage.removeItem('token');
        router.push('/login');
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Welcome, {user.name}!</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-semibold mb-4">Upload a Song</h2>
                <p className="text-gray-600 mb-4">
                  Upload your favorite songs to analyze and get a personalized learning plan.
                </p>
                <Button onClick={() => router.push('/upload')}>Upload Song</Button>
              </div>

              <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-semibold mb-4">Your Songs</h2>
                <p className="text-gray-600 mb-4">
                  View and manage your uploaded songs and learning plans.
                </p>
                <Button onClick={() => router.push('/songs')}>View Songs</Button>
              </div>
            </div>
          </div>
        </div>
        <div className="space-x-4 mt-8">
          <Button onClick={handleLogout} variant="outline">Logout</Button>
        </div>
      </div>
    </div>
  );
}
