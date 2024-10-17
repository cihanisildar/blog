"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Post } from "@/models/post.model";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Masonry from "react-masonry-css";

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
      const response = await fetch(`http://localhost:3001/tag/${tagId}`);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!tag) {
    return <div>Tag not found</div>;
  }

  return (
    <div className="px-8 py-4">
      <h1 className="text-5xl font-medium font-serif mb-4">
        Related Posts - [{tag.name}]
      </h1>
      <p className="text-gray-600 mb-6">{tag.description}</p>

      {tag.posts.length > 0 ? (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex gap-4 w-auto"
          columnClassName="bg-clip-padding "
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
                <Image
                  src={post.post.mainImageUrl}
                  alt={post.post.mainImageName}
                  width={500}
                  height={300}
                  style={{ objectFit: "cover", width: "100%", height: "auto" }}
                  priority
                  className="rounded-t-[8px]"
                />
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
      )}
    </div>
  );
};

export default SingleTagPage;
