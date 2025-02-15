'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

interface Analysis {
  key: string;
  scale: string;
  bpm: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  chords: {
    time: number;
    chord: string;
  }[];
  sections: {
    start: number;
    duration: number;
    confidence: number;
  }[];
}

interface Song {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  uploadDate: string;
  mimeType: string;
  url: string;
  analysis?: Analysis;
}

export default function SongsPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/songs`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch songs');
        }

        const data = await response.json();
        setSongs(data.songs);
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to load songs',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [router, toast]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-600';
      case 'intermediate':
        return 'text-yellow-600';
      case 'advanced':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Loading songs...</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Songs</h1>
        <button
          onClick={() => router.push('/upload')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Upload New Song
        </button>
      </div>

      {songs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No songs uploaded yet.</p>
          <button
            onClick={() => router.push('/upload')}
            className="mt-4 text-blue-500 hover:text-blue-600"
          >
            Upload your first song
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {songs.map((song) => (
            <div
              key={song.id}
              className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{song.originalName}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Size: {formatFileSize(song.size)}</p>
                    <p>Uploaded: {formatDate(song.uploadDate)}</p>
                    <audio
                      controls
                      className="w-full mt-4"
                      src={`${process.env.BACKEND_URL}${song.url}`}
                    >
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </div>

                {song.analysis && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-700">Key & Scale</h4>
                        <p className="text-gray-600">{song.analysis.key} {song.analysis.scale}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700">Tempo</h4>
                        <p className="text-gray-600">{song.analysis.bpm} BPM</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700">Difficulty</h4>
                        <p className={getDifficultyColor(song.analysis.difficulty)}>
                          {song.analysis.difficulty.charAt(0).toUpperCase() + song.analysis.difficulty.slice(1)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Chord Progression</h4>
                      <div className="flex flex-wrap gap-2">
                        {song.analysis.chords.slice(0, 8).map((chord, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 px-2 py-1 rounded text-sm"
                            title={`Time: ${formatTime(chord.time)}`}
                          >
                            {chord.chord}
                          </span>
                        ))}
                        {song.analysis.chords.length > 8 && (
                          <span className="text-gray-500 text-sm">
                            +{song.analysis.chords.length - 8} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Song Structure</h4>
                      <div className="h-8 bg-gray-100 rounded-full overflow-hidden flex">
                        {song.analysis.sections.map((section, index) => {
                          const width = (section.duration / song.analysis.sections.reduce((acc, s) => acc + s.duration, 0)) * 100;
                          return (
                            <div
                              key={index}
                              className="h-full bg-blue-500 border-r border-white last:border-0"
                              style={{ width: `${width}%`, opacity: 0.3 + section.confidence * 0.7 }}
                              title={`Section ${index + 1}: ${formatTime(section.start)} - ${formatTime(section.start + section.duration)}`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
