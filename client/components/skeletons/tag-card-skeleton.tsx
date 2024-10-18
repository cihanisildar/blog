import { cn } from "@/lib/utils";

export const TagCardSkeleton = ({ className }: { className?: string }) => {
    return (
      <div className={cn(
        "h-48 bg-white rounded-lg shadow-md overflow-hidden border border-green-100 animate-pulse",
        className
      )}>
        <div className="p-5">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>
        </div>
        <div className="mt-4 px-5 py-2 bg-gray-50">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
    );
  };
  
  export const TagCardSkeletonGrid = ({ count = 8 }: { count?: number }) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(count)].map((_, index) => (
          <TagCardSkeleton key={index} />
        ))}
      </div>
    );
  };