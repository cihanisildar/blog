import { Tag } from "./tag.model";
import { TagsOnPosts } from "./tagsOnPosts.model";

export enum PostLength {
  SHORT = "SHORT",
  MEDIUM = "MEDIUM",
  LONG = "LONG",
}

export interface Post {
  id: number;
  title: string;
  content?: string; // Make this optional if it's nullable in your schema
  published: boolean;
  createdAt: Date;
  mainImageUrl?: string;
  mainImageName?: string;
  contentImageUrls: string[];
  updatedAt?: Date; // Make this optional if it's nullable in your schema
  tags: TagsOnPosts[]; // Update to reflect the correct relationship
  length: PostLength;
}
