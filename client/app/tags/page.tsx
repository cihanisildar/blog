"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tag } from "@/models/tag.model";
import { TagIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(20, "Name must be 50 characters or less"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(200, "Description must be 200 characters or less"),
});

const TagsPage = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3001/tag", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setTags(data.tags);
        }
      })
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:3001/tag/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Tag created successfully:", data.tag);
        setTags((prevTags) => [...prevTags, data.tag]);
        form.reset();
        setIsDialogOpen(false);
      } else {
        console.error("Failed to create tag:", data.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-8 py-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-5xl font-medium font-serif text-black">Tags</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-4">
        {tags.map((tag) => (
          <Link key={tag.id} href={`/tags/${tag.id}`} className="block group">
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
              <div className="bg-green-50 px-5 py-3">
                <span className="text-green-700 text-sm font-medium group-hover:text-green-800 transition-colors duration-300">
                  View Tag →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TagsPage;