import { getBlogposts, writeBlogposts } from "../lib/fs-tools.js";
import uniqid from "uniqid";

export const saveNewComment = async (blogpostId, newCommentData) => {
  // push the new comment into existing posts array into the current post (by ID)
  const posts = await getBlogposts();
  const index = posts.findIndex((post) => post.id === blogpostId);

  if (index !== -1) {
    posts[index].comments.push({
      ...newCommentData,
      id: uniqid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await writeBlogposts(posts);
    return posts[index];
  } else {
    return null; // if there is no matching post to add a comment to -> return null
  }
};

export const findComments = () => {};
export const findCommentById = () => {};
export const findCommentByIdAndUpdate = () => {};
export const findCommentByIdAndDelete = () => {};
