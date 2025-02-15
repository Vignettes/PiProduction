'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getCurrentUser(token)
        .then(userData => {
          setUser(userData);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching user:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        {user ? (
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {user.name}! 🎸</CardTitle>
              <CardDescription>Ready to start analyzing some songs?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Upload your guitar recordings for instant feedback and analysis!</p>
                <div className="space-x-4">
                  <Button onClick={() => window.location.href = '/upload'}>Upload a Song</Button>
                  <Button onClick={handleLogout} variant="outline">Logout</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Welcome to ChordBreak</CardTitle>
              <CardDescription>Your personal guitar learning assistant</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Please log in or create an account to get started.</p>
                <div className="space-x-4">
                  <Button onClick={() => window.location.href = '/login'}>Login</Button>
                  <Button onClick={() => window.location.href = '/signup'} variant="outline">Sign Up</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
