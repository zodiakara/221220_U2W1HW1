// ******************************************** BLOG POSTS RELATED ENDPOINTS *****************************

/*
1. CREATE --> POST http://localhost:3001/blogposts/ (+ body)
2. READ (all posts)--> GET http://localhost:3001/blogposts/
3. READ (single post) --> GET http://localhost:3001/blogposts/:postId
4. UPDATE (single post) --> PUT http://localhost:3001/blogposts/:postId (+ body)
5. DELETE (single post) --> DELETE http://localhost:3001/blogposts/:postId

*/

import express from "express";
import uniqid from "uniqid";
import httpErrors from "http-errors";
import {
  checkBlogpostsSchema,
  triggerBadRequest,
} from "./blogpostsValidator.js";
import { getBlogposts, writeBlogposts } from "../../lib/fs-tools.js";

const { NotFound, Unauthorized, BadRequest } = httpErrors;

const blogpostsRouter = express.Router();

blogpostsRouter.post(
  "/",
  checkBlogpostsSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      console.log("request body:", req.body);
      const newPost = {
        ...req.body,
        createdAt: new Date(),
        id: uniqid(),
      };
      console.log(newPost);

      const postsArray = await getBlogposts();
      postsArray.push(newPost);
      await writeBlogposts(postsArray);

      res.status(200).send({ id: newPost.id });
    } catch (error) {
      next(error);
    }
  }
);
blogpostsRouter.get("/", async (req, res, next) => {
  try {
    const blogposts = await getBlogposts();
    res.send(blogposts);
  } catch (error) {
    next(error);
  }
});
blogpostsRouter.get("/:blogpostId", async (req, res, next) => {
  try {
    const blogposts = await getBlogposts();
    const blogpost = blogposts.find(
      (blogpost) => blogpost.id === req.params.blogpostId
    );
    if (blogpost) {
      res.send(blogpost);
    } else {
      next(
        NotFound(`Post with id ${req.params.blogpostId} has not been found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});
blogpostsRouter.put("/:blogpostId", async (req, res, next) => {
  const blogposts = await getBlogposts();
  const index = blogposts.findIndex(
    (blogpost) => blogpost.id === req.params.blogpostId
  );

  const oldPost = blogposts[index];
  const updatedPost = { ...oldPost, ...req.body, updatedAt: new Date() };
  blogposts[index] = updatedPost;
  await writeBlogposts(blogposts);
  res.send(updatedPost);

  try {
  } catch (error) {
    next(error);
  }
});
blogpostsRouter.delete("/:blogpostId", async (req, res, next) => {
  try {
    const blogposts = await getBlogposts();
    const remainingPosts = blogposts.filter(
      (blogpost) => blogpost.id !== req.params.blogpostId
    );
    await writeBlogposts(remainingPosts);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
export default blogpostsRouter;