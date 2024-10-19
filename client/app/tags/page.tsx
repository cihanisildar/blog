"use client";

import { Input } from "@/components/ui/input";
import { Tag } from "@/models/tag.model";
import { TagIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { PostCardSkeletonGrid } from "@/components/skeletons/post-card-skeleton";

const TagsPage = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tag`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setTags(data.tags);
          setFilteredTags(data.tags);
        }
      })
      .catch((error) => console.error("Error fetching tags:", error))
      .finally(() => {
        setLoading(false); 
      });
  }, []);

  // Search function
  const searchTags = (query: string) => {
    if (query) {
      const filtered = tags.filter((tag) =>
        tag.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredTags(filtered);
    } else {
      setFilteredTags(tags); // Reset to original tags
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear the previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set a new timeout for debouncing
    debounceRef.current = setTimeout(() => {
      searchTags(query);
    }, 300);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white pb-20">
      <div className="flex-shrink-0 px-8 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-5xl font-medium font-serif text-black">Tags</h1>
          <Input
            type="search"
            placeholder="Search tags..."
            value={searchQuery}
            onChange={handleSearch}
            className="md:w-[100px] lg:w-[300px]"
          />
        </div>
      </div>
      <div className="flex-grow overflow-y-auto px-8 py-4">
        {loading ? (
          <PostCardSkeletonGrid count={8} />
        ) : filteredTags.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>No tags found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-4">
            {filteredTags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tags/${tag.id}`}
                className="block group"
              >
                <div className="h-48 bg-white flex flex-col justify-between rounded-lg shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1 border border-green-100">
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-lg font-semibold text-green-800 mb-2 truncate max-w-[70%]">
                        {tag.name}
                      </h3>
                      <div className="flex items-center text-sm text-green-600 whitespace-nowrap">
                        <TagIcon className="mr-2 h-4 w-4" />
                        {tag.posts.length} posts
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 overflow-hidden overflow-ellipsis line-clamp-3 break-words">
                      {tag.description}
                    </p>
                  </div>
                  <div className="bg-green-50 px-5 py-2">
                    <span className="text-green-700 text-sm font-medium group-hover:text-green-800 transition-colors duration-300">
                      View Tag →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TagsPage;
