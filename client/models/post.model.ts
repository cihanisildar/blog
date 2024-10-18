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
  content?: string;
  description?: string;
  published: boolean;
  createdAt: Date;
  mainImageUrl?: string;
  mainImageName?: string;
  contentImageUrls: string[];
  updatedAt?: Date; 
  tags: TagsOnPosts[]; 
  length: PostLength;
}
