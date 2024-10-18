"use client";

import { Post } from "@/models/post.model";
import { ArrowRight, FileText, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    console.log("Backend URL:", process.env.NEXT_PUBLIC_BACKEND_URL);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/post/latest-posts`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          console.log(data);
          setPosts(data.posts);
        }
      })
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  console.log(posts);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gradient-to-b from-green-50 to-white">
      <div className="flex-grow overflow-y-auto">
        <div className="mx-auto max-w-6xl flex flex-col py-16 px-4 sm:px-6 lg:px-8">
          <header className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Cihan&apos;s Blog
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Software Engineer | Blogger
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/about"
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                <User className="mr-2" size={20} />
                About Me
              </Link>
              <Link
                href="/posts"
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
              >
                <FileText className="mr-2" size={20} />
                Blog
              </Link>
            </div>
          </header>

          <main className="mt-16 w-full">
            <section className="w-full">
              <h2 className="text-2xl font-semibold w-full text-gray-900 mb-6">
                Recent Blog Posts
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/posts/${post.id}`}
                    className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-green-100 flex flex-col justify-between h-full"
                  >
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {post.title}
                      </h3>
                      {post.description ? (
                        <div className="text-sm text-gray-600 line-clamp-3">
                          {post.description.substring(0, 150) + "..."}
                        </div>
                      ) : (
                        <p>No description available.</p>
                      )}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                      <ArrowRight className="text-green-600" size={16} />
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Link
                  href="/posts"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                >
                  View all posts
                  <ArrowRight className="ml-2" size={16} />
                </Link>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
