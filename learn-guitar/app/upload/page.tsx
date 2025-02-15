'use client';

import type React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Music, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: 'File too large',
          description: 'Please select a file smaller than 10MB',
          variant: 'destructive',
        });
        return;
      }
      if (!['audio/mpeg', 'audio/wav', 'audio/mp3'].includes(selectedFile.type)) {
        toast({
          title: 'Invalid file type',
          description: 'Please select an MP3 or WAV file',
          variant: 'destructive',
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const formData = new FormData();
      formData.append('audio', file);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      console.log('Upload successful:', data);

      toast({
        title: 'Upload successful',
        description: 'Your song is being analyzed',
      });

      // For now, just show success and stay on the page
      setFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      <div className="container px-4 py-12 mx-auto">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Upload Your Song</CardTitle>
            <CardDescription>We'll analyze the song and create your personalized learning plan</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="song">Choose a song file</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Input 
                    id="song" 
                    type="file" 
                    accept=".mp3,.wav" 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                  <Label htmlFor="song" className="cursor-pointer flex flex-col items-center gap-2">
                    {file ? (
                      <>
                        <Music className="w-8 h-8 text-cyan-600" />
                        <span className="text-sm font-medium">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          {(file.size / (1024 * 1024)).toFixed(2)}MB
                        </span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400" />
                        <span className="text-sm font-medium">Drag and drop or click to upload</span>
                        <span className="text-xs text-gray-500">MP3 or WAV, max 10MB</span>
                      </>
                    )}
                  </Label>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={!file || uploading}
              >
                {uploading ? "Uploading..." : "Upload Song"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
