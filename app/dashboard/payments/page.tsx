"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, DollarSign, Calendar } from "lucide-react"

export default function PaymentsPage() {
  const payments = [
    {
      id: 1,
      amount: 280000,
      service: "Electrical Repair",
      date: "2024-01-15",
      status: "Paid",
      method: "Cash"
    },
    {
      id: 2,
      amount: 150000,
      service: "House Cleaning",
      date: "2024-01-20",
      status: "Pending",
      method: "Cash"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>View your payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-[#C8E6C9] rounded-lg flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-[#2E7D32]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{payment.service}</h4>
                        <p className="text-sm text-gray-500">{payment.method}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">TZS {payment.amount.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{payment.date}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'Paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 