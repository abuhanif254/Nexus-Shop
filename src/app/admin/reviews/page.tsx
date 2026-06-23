import { db } from "@/db";
import { reviews, users, products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { MessageSquare, Star, Trash2 } from "lucide-react";
import Image from "next/image";

export const dynamic = 'force-dynamic';

export default async function AdminReviewsPage() {
  const allReviews = await db.select({
    review: reviews,
    user: users,
    product: products,
  })
  .from(reviews)
  .leftJoin(users, eq(reviews.userId, users.id))
  .leftJoin(products, eq(reviews.productId, products.id))
  .orderBy(desc(reviews.createdAt));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MessageSquare className="text-brand-orange" /> Reviews Moderation
        </h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="p-4 font-semibold w-1/4">User</th>
                <th className="p-4 font-semibold w-1/4">Product</th>
                <th className="p-4 font-semibold w-2/4">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allReviews.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">
                    No reviews yet.
                  </td>
                </tr>
              ) : (
                allReviews.map(({ review, user, product }) => (
                  <tr key={review.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 align-top">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden relative shrink-0">
                          {user?.image ? (
                            <Image src={user.image} alt={user.name || 'User'} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold bg-orange-50 text-brand-orange">
                              {(user?.name?.[0] || user?.email?.[0] || '?').toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{user?.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">{new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(review.createdAt))}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-top">
                      {product ? (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-gray-100 relative overflow-hidden shrink-0 border border-gray-200">
                            <Image src={product.image} alt={product.title} fill className="object-cover" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 line-clamp-1">{product.title}</p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-sm">Product Deleted</span>
                      )}
                    </td>
                    <td className="p-4 align-top">
                      <div className="flex items-center gap-1 mb-2 text-brand-orange">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "transparent"} className={i < review.rating ? "" : "text-gray-300"} />
                        ))}
                      </div>
                      <p className="text-sm text-gray-700">{review.comment || <span className="italic text-gray-400">No comment provided.</span>}</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
