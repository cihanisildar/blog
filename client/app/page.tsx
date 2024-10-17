"use client"

import React, { useEffect, useState } from "react";
import { FileText, User, ArrowRight } from "lucide-react";
import { Post } from "@/models/post.model";
import Link from "next/link";

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/post/latest-posts", {
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

  return (
    <div className="bg-gradient-to-b from-green-50 to-white min-h-screen">
      <div className="mx-auto max-w-6xl h-full flex items-center justify-center flex-col py-16">
        <header className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Cihan's Dev Blog
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Software Engineer | Tech Blogger
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
            <div className="space-y-4">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.id}`}
                  className="block bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-green-100"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
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
  );
};

export default HomePage;