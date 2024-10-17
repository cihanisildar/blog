"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ImageOffIcon } from "lucide-react";
import { Post } from "@/models/post.model";
import { cn } from "@/lib/utils";
import Masonry from "react-masonry-css";
import SearchInput from "@/components/search-input";
import debounce from "lodash/debounce";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

const PostsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("http://localhost:3001/post", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.status === "success") {
        setPosts(data.posts);
        setFilteredPosts(data.posts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const searchPosts = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3001/search?q=${encodeURIComponent(query)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        setFilteredPosts(data.posts);
      }
    } catch (error) {
      console.error("Error searching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query) {
        searchPosts(query);
      } else {
        setFilteredPosts(posts);
      }
    }, 300),
    [posts]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <div className="w-full overflow-y-auto">
      <div className="flex justify-between items-center px-8 py-4">
        <h1 className="text-5xl font-medium font-serif">Posts</h1>
        <div className="flex items-center gap-4">
          <Input
            type="search"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={handleSearch}
            className="md:w-[100px] lg:w-[300px]"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="flex justify-center items-center h-64 max-w-3xl mx-auto">
          <p className="text-center text-lg text-gray-700">
            No posts matched your search. Try different keywords or check back
            soon for new content. The perfect post might be just around the
            corner!
          </p>
        </div>
      ) : (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex gap-4 w-auto px-8"
          columnClassName="bg-clip-padding"
        >
          {filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                href={`/posts/${post.id}`}
                className={cn(
                  "block mb-4 overflow-hidden border hover:shadow-xl transition duration-200 rounded-[8px]"
                )}
              >
                <div className="relative w-full">
                  {post.mainImageUrl && post.mainImageName ? (
                    <Image
                      src={post.mainImageUrl}
                      alt={post.mainImageName}
                      width={500}
                      height={300}
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "auto",
                      }}
                      className="rounded-t-[8px]"
                      priority
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-40 bg-slate-50">
                      <ImageOffIcon />
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h2 className="text-lg font-semibold">{post.title}</h2>
                  <p className="text-sm text-gray-600">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </Masonry>
      )}
    </div>
  );
};

export default PostsPage;
