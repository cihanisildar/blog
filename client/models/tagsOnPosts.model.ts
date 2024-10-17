import { Post } from "./post.model";
import { Tag } from "./tag.model";

export interface TagsOnPosts {
    post: Post;
    postId: number;
    tag: Tag;
    tagId: number;
    assignedAt: Date;
    assignedBy: string;
  }