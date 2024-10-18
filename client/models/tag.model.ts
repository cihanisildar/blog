import { TagsOnPosts } from "./tagsOnPosts.model";


export interface Tag {
    id: number;
    name: string;
    description: string;
    posts: TagsOnPosts[];
  }
  