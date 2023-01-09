import { getBlogposts, writeBlogposts } from "../lib/fs-tools.js";
import uniqid from "uniqid";

export const saveNewPost = async (newPostData) => {
  const posts = await getBlogposts();
  const newPost = {
    ...newPostData,
    createdAt: new Date(),
    postId: uniqid(),
    comments: [],
  };
  posts.push(newPost);
  await writeBlogposts(posts);

  return newPost.postId;
};

export const findPosts = async () => getBlogposts();

export const findPostById = async (id) => {
  const posts = await getBlogposts();
  const post = posts.find((post) => post.postId === id);
  return post;
};

export const findPostByIdAndUpdate = async () => {};

export const findPostByIdAndDelete = async () => {};
