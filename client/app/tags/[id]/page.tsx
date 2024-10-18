"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Post } from "@/models/post.model";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Masonry from "react-masonry-css";
import { PostCardSkeletonGrid } from "@/components/skeletons/post-card-skeleton";

interface Tag {
  id: string;
  name: string;
  description: string;
  posts: {
    post: Post;
  }[];
}

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

const SingleTagPage = () => {
  const params = useParams();
  const id = params.id;
  const [tag, setTag] = useState<Tag | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchTag(id as string);
    }
  }, [id]);

  const fetchTag = async (tagId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tag/${tagId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch tag");
      }
      const data = await response.json();
      setTag(data.tag);
    } catch (error) {
      console.error("Error fetching tag:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <PostCardSkeletonGrid count={8} />;
    }

    if (!tag) {
      return <div>Tag not found</div>;
    }

    return tag.posts.length > 0 ? (
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex gap-4 w-auto"
        columnClassName="bg-clip-padding"
      >
        {tag.posts.map((post) => (
          <Link
            href={`/posts/${post.post.id}`}
            key={post.post.id}
            className={cn(
              "block mb-4 overflow-hidden border hover:shadow-xl transition duration-200 rounded-[8px]"
            )}
          >
            <div className="relative w-full">
              {post.post.mainImageUrl && (
                <Image
                  src={post.post.mainImageUrl}
                  alt={post.post.mainImageName || "Post image"}
                  width={500}
                  height={300}
                  style={{ objectFit: "cover", width: "100%", height: "auto" }}
                  priority
                  className="rounded-t-[8px]"
                />
              )}
            </div>

            <div className="p-4">
              <h2 className="text-lg font-semibold">{post.post.title}</h2>
              <p className="text-sm text-gray-600">
                {new Date(post.post.createdAt).toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </Masonry>
    ) : (
      <p>No posts found for this tag.</p>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="overflow-y-auto h-screen pb-20">
        <div className="flex-shrink-0 px-8 py-4 border-b border-gray-200">
          <h1 className="text-5xl font-medium font-serif mb-4">
            Related Posts - [{tag?.name || "Loading..."}]
          </h1>
          <p className="text-gray-600">{tag?.description}</p>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SingleTagPage;
