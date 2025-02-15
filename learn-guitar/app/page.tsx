import Link from "next/link"
import { Upload, CheckCircle, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      <div className="container px-4 py-6 mx-auto">
        <nav className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-2">
            <img
              src="/logo.svg"
              alt="Guitar Learning Logo"
              className="w-10 h-10"
            />
            <span className="text-xl font-bold text-cyan-600">SongMaster</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </nav>

        <main className="grid gap-12 py-12 md:py-20">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Master Any Song.
              <br />
              <span className="text-cyan-600">Pay Less When You Succeed.</span>
            </h1>
            <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl">
              Upload a song, get a personalized learning plan, and only pay full price if you don't learn it in 30 days.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>1. Upload</CardTitle>
                <CardDescription>Share your song and we'll analyze it</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Upload className="w-12 h-12 text-cyan-600" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Learn</CardTitle>
                <CardDescription>Follow your personalized learning plan</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <CheckCircle className="w-12 h-12 text-cyan-600" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Share & Save</CardTitle>
                <CardDescription>Show off your skills and pay less</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Share2 className="w-12 h-12 text-cyan-600" />
              </CardContent>
            </Card>
          </div>

          <div className="text-center space-y-6">
            <Button size="lg" asChild>
              <Link href="/upload" className="text-lg px-8">
                Start Learning Now
              </Link>
            </Button>

            <div className="space-y-4 max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold">Pay 50% Upfront</h2>
              <p className="text-gray-500">
                Get your personalized learning plan immediately
              </p>
              <ul className="space-y-2 text-left max-w-md mx-auto">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-cyan-600" />
                  <span>Chord breakdown</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-cyan-600" />
                  <span>Section-by-section guide</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-cyan-600" />
                  <span>Practice schedule</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-cyan-600" />
                  <span>Progress tracking</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4 max-w-2xl mx-auto pt-8">
              <h2 className="text-2xl font-semibold">Share Your Success</h2>
              <p className="text-gray-500">
                Post a video playing the song within 30 days
              </p>
              <ul className="space-y-2 text-left max-w-md mx-auto">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-cyan-600" />
                  <span>Skip the final payment</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-cyan-600" />
                  <span>Join our wall of fame</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-cyan-600" />
                  <span>Inspire other learners</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-cyan-600" />
                  <span>Build your portfolio</span>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
