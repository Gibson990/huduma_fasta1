"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, TrendingDown, Calendar, BarChart3 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export function ProviderEarnings() {
  const { user } = useAuth()
  const [earnings, setEarnings] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return;
    setLoading(true)
    fetch(`/api/providers/${user.id}/earnings`)
      .then(res => res.ok ? res.json() : {})
      .then(data => {
        setEarnings(data)
        setLoading(false)
      })
      .catch(error => {
        setLoading(false)
        // fallback sample data if needed
        setEarnings({})
      })
  }, [user])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 mb-2 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mt-6" />
        <div className="space-y-4 mt-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm animate-pulse">
              <div className="flex-1">
                <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-16 bg-gray-100 rounded mb-1" />
                <div className="h-3 w-20 bg-gray-100 rounded" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-16 bg-gray-200 rounded" />
                <div className="h-4 w-12 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return `TSh ${amount.toLocaleString()}`
  }

  const getGrowthPercentage = (current: number, previous: number) => {
    if (previous === 0) return 100
    return Math.round(((current - previous) / previous) * 100)
  }

  const monthlyGrowth = getGrowthPercentage(earnings.thisMonth || 0, earnings.lastMonth || 0)

  return (
    <div className="space-y-6">
      {/* Earnings Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Earnings
            </CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#212121]">
              {formatCurrency(earnings.totalEarnings || 0)}
            </div>
            <p className="text-xs text-gray-600 mt-1">All time earnings</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              This Month
            </CardTitle>
            <div className="flex items-center gap-1">
              {monthlyGrowth >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#212121]">
              {formatCurrency(earnings.thisMonth || 0)}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {monthlyGrowth >= 0 ? '+' : ''}{monthlyGrowth}% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              This Week
            </CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#212121]">
              {formatCurrency(earnings.thisWeek || 0)}
            </div>
            <p className="text-xs text-gray-600 mt-1">Current week earnings</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending Payments
            </CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#212121]">
              {formatCurrency(earnings.pendingPayments || 0)}
            </div>
            <p className="text-xs text-gray-600 mt-1">Awaiting payment</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#212121] flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {earnings.recentTransactions && earnings.recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {earnings.recentTransactions.map((transaction: any) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-[#212121]">{transaction.service}</h4>
                    <p className="text-sm text-gray-600">{transaction.customer}</p>
                    <p className="text-xs text-gray-500">{transaction.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      className={
                        transaction.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {transaction.status}
                    </Badge>
                    <span className="font-medium text-[#2E7D32]">
                      {formatCurrency(transaction.amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
              <p className="text-gray-600">Your transaction history will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 