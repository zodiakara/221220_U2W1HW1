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

export const findComments = async (blogpostId) => {
  const posts = await getBlogposts();
  const index = posts.findIndex((post) => post.id === blogpostId);

  if (index !== -1) {
    return posts[index].comments;
  } else {
    return null;
  }
};

export const findCommentById = (blogpostId, commentId, update) => {};

//to add: update PUT method
export const findCommentByIdAndUpdate = () => {};

export const findCommentByIdAndDelete = async (blogpostId, commentId) => {
  const posts = await getBlogposts();
  const index = posts.findIndex((post) => post.id === blogpostId);
  if (index !== -1) {
    const commentIndex = posts[index].comments.findIndex(
      (comment) => comment.id === commentId
    );
    if (commentIndex !== -1) {
      posts[index].comments = posts[index].comments.filter(
        (comment) => comment.id !== commentId
      );
      await writeBlogposts(posts);
      return posts[index].comments;
    } else {
      throw new createHttpError(404, `Comment with id ${commentId} not found!`);
    }
  } else {
    throw new createHttpError(404, `Comment with id ${commentId} not found!`);
  }
};
