export default function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-[#111111] border border-gray-100 dark:border-gray-800 rounded-xl p-4 md:p-5 relative flex flex-col h-full animate-pulse shadow-sm">
      {/* Image Skeleton */}
      <div className="w-full aspect-square bg-gray-200 dark:bg-gray-800/80 rounded-xl mb-4"></div>
      
      {/* Details Skeleton */}
      <div className="space-y-3 flex-1">
        {/* Brand */}
        <div className="w-1/3 h-3 bg-gray-200 dark:bg-gray-800/80 rounded-full"></div>
        {/* Title */}
        <div className="w-full h-4 bg-gray-200 dark:bg-gray-800/80 rounded-full"></div>
        <div className="w-4/5 h-4 bg-gray-200 dark:bg-gray-800/80 rounded-full"></div>
        
        {/* Rating */}
        <div className="flex gap-1 py-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-3 h-3 bg-gray-200 dark:bg-gray-800/80 rounded-full"></div>
          ))}
        </div>
        
        {/* Price */}
        <div className="w-24 h-6 bg-gray-200 dark:bg-gray-800/80 rounded-lg mt-2"></div>
      </div>
      
      {/* Progress Bar Skeleton */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex justify-between mb-2">
          <div className="w-16 h-3 bg-gray-200 dark:bg-gray-800/80 rounded-full"></div>
          <div className="w-16 h-3 bg-gray-200 dark:bg-gray-800/80 rounded-full"></div>
        </div>
        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800/80 rounded-full"></div>
      </div>
    </div>
  );
}
