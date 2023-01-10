import { getBlogposts, writeBlogposts } from "../lib/fs-tools.js";
import uniqid from "uniqid";

//post
export const saveNewPost = async (newPostData) => {
  const posts = await getBlogposts();
  const newPost = {
    ...newPostData,
    createdAt: new Date(),
    id: uniqid(),
    comments: [],
  };
  posts.push(newPost);
  await writeBlogposts(posts);

  return newPost.id;
};

// get all
export const findPosts = async () => getBlogposts();

// get by id
export const findPostById = async (id) => {
  const posts = await getBlogposts();
  const post = posts.find((post) => post.id === id);
  return post;
};

// put
export const findPostByIdAndUpdate = async (blogpostId, updates) => {
  const posts = await getBlogposts();
  const index = posts.findIndex((post) => post.id === blogpostId);

  if (index !== -1) {
    posts[index] = { ...posts[index], ...updates, updatedAt: new Date() };
    await writeBlogposts(posts);
    return posts[index];
  } else {
    return null;
  }
};

//delete
export const findPostByIdAndDelete = async (blogpostId) => {
  const posts = await getBlogposts();
  const post = await findPostById(blogpostId);

  if (post) {
    const remainingPosts = posts.filter((post) => post.id !== blogpostId);
    await writeBlogposts(remainingPosts);
    return post;
  } else {
    return null;
  }
};
