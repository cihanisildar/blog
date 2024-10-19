"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ReadersPickSkeletonProps {
  className?: string;
}

export const ReadersPickSkeleton = ({ className }: ReadersPickSkeletonProps) => {
  return (
    <div
      className={cn(
        "block overflow-hidden border rounded-lg p-6 animate-pulse",
        className
      )}
    >
      <div className="w-full h-8 bg-gray-200 rounded mb-4" /> {/* Title Skeleton */}
      <div className="h-4 bg-gray-200 rounded w-full mb-2" /> {/* Description Skeleton */}
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-2" /> {/* Shorter Description */}
      <div className="h-4 bg-gray-200 rounded w-4/6" /> {/* Shorter Description */}
      <div className="mt-6 h-10 w-32 bg-gray-200 rounded" /> {/* Button Skeleton */}
    </div>
  );
};
