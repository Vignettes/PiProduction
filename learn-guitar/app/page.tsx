import Link from "next/link"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      <div className="container px-4 py-6 mx-auto">
        <nav className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-2">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/favicon-32-LETsI2uVZ3faGBOx1ZAF54tQHpTlrE.png"
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
              <CardContent>
                <Upload className="w-12 h-12 mx-auto text-cyan-600" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Learn</CardTitle>
                <CardDescription>Follow your personalized learning plan</CardDescription>
              </CardHeader>
              <CardContent className="text-center text-4xl">🎸</CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Share & Save</CardTitle>
                <CardDescription>Show off your skills and pay less</CardDescription>
              </CardHeader>
              <CardContent className="text-center text-4xl">🎥</CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/upload">
              <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700">
                Start Learning Now
                <Upload className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-8 mt-20 md:grid-cols-2 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Pay 50% Upfront</CardTitle>
                <CardDescription>Get your personalized learning plan immediately</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">✓ Chord breakdown</li>
                  <li className="flex items-center">✓ Section-by-section guide</li>
                  <li className="flex items-center">✓ Practice schedule</li>
                  <li className="flex items-center">✓ Progress tracking</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Share Your Success</CardTitle>
                <CardDescription>Post a video playing the song within 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">✓ Skip the final payment</li>
                  <li className="flex items-center">✓ Join our wall of fame</li>
                  <li className="flex items-center">✓ Inspire other learners</li>
                  <li className="flex items-center">✓ Build your portfolio</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

