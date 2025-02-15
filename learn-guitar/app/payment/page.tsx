"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function PaymentPage() {
  const [processing, setProcessing] = useState(false)
  const router = useRouter()

  const handlePayment = async () => {
    setProcessing(true)
    // Here you would implement the actual payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulated payment
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      <div className="container px-4 py-12 mx-auto">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>Pay 50% now and the rest only if you don't complete the challenge</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold">Learning Plan</h3>
                  <p className="text-sm text-gray-500">30-day access</p>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Complete the challenge within 30 days to save 50%</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Full Price</span>
                  <span>$20.00</span>
                </div>
                <div className="flex justify-between text-cyan-600">
                  <span>Initial Payment (50%)</span>
                  <span>$10.00</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Remaining Balance*</span>
                  <span>$10.00</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">What&apos;s included:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-600" />
                  Detailed chord breakdown
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-600" />
                  Section-by-section learning guide
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-600" />
                  Progress tracking dashboard
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-600" />
                  Social sharing tools
                </li>
              </ul>
            </div>

            <Button onClick={handlePayment} className="w-full bg-cyan-600 hover:bg-cyan-700" disabled={processing}>
              {processing ? "Processing..." : "Pay $10.00 Now"}
            </Button>

            <p className="text-xs text-gray-500 text-center">*Only if challenge is not completed within 30 days</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

