"use client"

import React, { useEffect, useState } from "react"
import { Github, Linkedin, Mail } from "lucide-react"
import Link from "next/link"
import { Post } from "@/models/post.model"

export default function AboutPage() {
  const [readerPick, setReaderPick] = useState<Post | null>(null)

  useEffect(() => {
    const fetchReaderPick = async () => {
      try {
        const response = await fetch("http://localhost:3001/post/60")
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        const data = await response.json()
        setReaderPick(data.post)
      } catch (error) {
        console.error("Failed to fetch the reader's pick:", error)
      }
    }

    fetchReaderPick()
  }, [])

  return (
    <div className="flex flex-col h-full overflow-auto pb-20">
      <div className="flex-grow py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
            <div className="lg:col-span-4 lg:border-r lg:border-green-200 lg:pr-8 mb-8 lg:mb-0">
              <h2 className="text-3xl font-bold text-black sm:text-4xl">
                Cihan IŞILDAR
              </h2>
              <p className="mt-4 text-xl text-black">Blog Writer</p>
              <div className="mt-6 flex space-x-4">
                <a
                  href="https://github.com/cihanisildar"
                  className="text-green-500 hover:text-green-600"
                  aria-label="GitHub"
                >
                  <Github size={24} />
                </a>
                <a
                  href="https://www.linkedin.com/in/cihanisildar/"
                  className="text-green-500 hover:text-green-600"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={24} />
                </a>
                <a
                  href="mailto:cihan.isildar@outlook.com"
                  className="text-green-500 hover:text-green-600"
                  aria-label="Email"
                >
                  <Mail size={24} />
                </a>
              </div>
            </div>
            <div className="lg:col-span-8">
              <div className="prose prose-lg text-black">
                <p>
                  Welcome to my blog! Here, I dive deep into character analysis
                  from movies and explore the underlying philosophies of books. I
                  enjoy examining the motivations, complexities, and emotional
                  journeys of characters, as well as interpreting the
                  philosophical messages embedded in stories. Whether it&apos;s the
                  inner workings of a film protagonist or the profound ideas in
                  literature, this blog is where I share my thoughts and analyses.
                </p>
              </div>

              <div className="mt-8">
                <h3 className="text-2xl font-semibold text-black">
                  Upcoming Topics
                </h3>
                <ul className="mt-4 list-disc list-inside text-green-700">
                  <li>
                    An in-depth analysis of Dostoevsky&apos;s <strong>Crime and Punishment</strong>
                  </li>
                  <li>Character study of <strong>Batman</strong> in <strong>The Dark Knight</strong></li>
                  <li>Exploring the philosophical themes in <strong>The Matrix</strong></li>
                </ul>
              </div>

              <div className="mt-8">
                <h3 className="text-2xl font-semibold text-black">
                  Reader&apos;s Pick
                </h3>
                <div className="mt-4 bg-gradient-to-bl from-green-100 to-yellow-200 p-6 rounded-lg border border-green-300 shadow-lg hover:shadow-xl transition-shadow">
                  {readerPick ? (
                    <>
                      <h4 className="text-2xl font-bold text-green-800">
                        <strong>{readerPick.title}</strong>
                      </h4>
                      <p className="mt-2 text-sm text-green-600">
                        {readerPick.description}
                      </p>
                      <Link href={`/posts/${readerPick.id}`}>
                        <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md text-white bg-yellow-500 hover:bg-yellow-600 transition">
                          Read More &rarr;
                        </button>
                      </Link>
                    </>
                  ) : (
                    <p className="text-gray-500">Loading...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
