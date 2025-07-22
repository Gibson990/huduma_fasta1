import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function ProviderReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return;
    setLoading(true)
    fetch(`/api/providers/${user.id}/reviews`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setReviews(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
        setReviews([])
      })
  }, [user])

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 border rounded-lg mb-4 bg-white shadow-sm animate-pulse flex flex-col gap-4">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-1" />
            <div className="h-4 bg-gray-100 rounded w-1/4" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card className="border-0 shadow-sm mt-6">
      <CardHeader>
        <CardTitle className="text-[#212121] flex items-center gap-2">
          Reviews
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-gray-600">No reviews yet.</p>
          ) : (
            reviews.map((review, idx) => (
              <div key={idx} className="p-4 border rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-[#212121]">{review.reviewer_name}</span>
                    <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {review.rating}/5
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{review.comment}</p>
                  <span className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
} 