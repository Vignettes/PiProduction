"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Music, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setUploading(true)
    // Here you would implement the actual file upload and analysis
    await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulated upload
    router.push("/payment")
  }

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
                  <Input id="song" type="file" accept="audio/*" className="hidden" onChange={handleFileChange} />
                  <Label htmlFor="song" className="cursor-pointer flex flex-col items-center gap-2">
                    {file ? (
                      <>
                        <Music className="w-8 h-8 text-cyan-600" />
                        <span className="text-sm font-medium">{file.name}</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400" />
                        <span className="text-sm font-medium">Drag and drop or click to upload</span>
                        <span className="text-xs text-gray-500">Supports MP3, WAV, AIFF</span>
                      </>
                    )}
                  </Label>
                </div>
              </div>

              <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700" disabled={!file || uploading}>
                {uploading ? "Analyzing..." : "Continue to Payment"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

