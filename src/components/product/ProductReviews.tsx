"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductReviews({ productId }: { productId: string }) {
  const router = useRouter();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchReviews = async () => {
    try {
      const [res, sessionRes] = await Promise.all([
        fetch(`/api/products/${productId}/reviews`),
        fetch(`/api/auth/session`)
      ]);
      const data = await res.json();
      const sessionData = await sessionRes.json();
      
      if (data.reviews) setReviews(data.reviews);
      if (sessionData && Object.keys(sessionData).length > 0) setIsAuthenticated(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return router.push("/login");

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });

      const data = await res.json();

      if (res.ok) {
        setComment("");
        setRating(5);
        fetchReviews();
        router.refresh();
      } else {
        setError(data.error || "Failed to submit review");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="py-8 text-center text-gray-500 animate-pulse">Loading reviews...</div>;

  return (
    <div className="mt-12 border-t border-gray-200 pt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Write a Review */}
        <div className="md:col-span-1">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h3>
          {isAuthenticated ? (
            <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-6 rounded-2xl">
              {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded">{error}</div>}
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className={`${star <= rating ? "text-yellow-400" : "text-gray-300"} hover:text-yellow-400 transition-colors`}
                    >
                      <Star fill="currentColor" size={24} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Comment</label>
                <textarea
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-3 min-h-[100px] focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none"
                  placeholder="Share your thoughts about this product..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-brand-dark text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          ) : (
            <div className="bg-gray-50 p-6 rounded-2xl text-center">
              <p className="text-gray-600 mb-4">You must be logged in to leave a review.</p>
              <button onClick={() => router.push("/login")} className="bg-brand-orange text-white font-bold px-6 py-2 rounded-lg">Log In</button>
            </div>
          )}
        </div>

        {/* Review List */}
        <div className="md:col-span-2 space-y-6">
          {reviews.length === 0 ? (
            <div className="text-gray-500 text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
              No reviews yet. Be the first to review this product!
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 text-sm">
                    {review.user.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{review.user.name}</p>
                    <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "text-yellow-400" : "text-gray-300"} />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed text-sm">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
