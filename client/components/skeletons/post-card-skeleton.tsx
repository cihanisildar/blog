"use client";

import { cn } from "@/lib/utils";
import Masonry from "react-masonry-css";

interface PostCardSkeletonProps {
  count?: number;
  className?: string;
}

export const PostCardSkeleton = ({ className }: PostCardSkeletonProps) => {
  return (
    <div className={cn(
      "block mb-4 overflow-hidden border rounded-[8px] animate-pulse",
      className
    )}>
      <div className="relative w-full h-[200px] bg-gray-200" />
      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
};

export const PostCardSkeletonGrid = ({ count = 8 }: PostCardSkeletonProps) => {
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex gap-4 w-auto"
      columnClassName="bg-clip-padding"
    >
      {[...Array(count)].map((_, index) => (
        <PostCardSkeleton key={index} />
      ))}
    </Masonry>
  );
};