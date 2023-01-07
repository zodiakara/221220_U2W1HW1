// ******************************************** BLOG POSTS RELATED ENDPOINTS *****************************

/*
1. CREATE --> POST http://localhost:3001/blogposts/ (+ body)
2. READ (all posts)--> GET http://localhost:3001/blogposts/
3. READ (single post) --> GET http://localhost:3001/blogposts/:postId
4. UPDATE (single post) --> PUT http://localhost:3001/blogposts/:postId (+ body)
5. DELETE (single post) --> DELETE http://localhost:3001/blogposts/:postId

*/

import express from "express";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import httpErrors from "http-errors";
import {
  checkBlogpostsSchema,
  triggerBadRequest,
} from "./blogpostsValidator.js";

const { NotFound, Unauthorized, BadRequest } = httpErrors;

const blogpostsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "blogposts.json"
);

const blogpostsRouter = express.Router();

const getBlogposts = (jsonPath) => JSON.parse(fs.readFileSync(jsonPath));
const writeBlogposts = (jsonPath, dataArray) =>
  fs.writeFileSync(jsonPath, JSON.stringify(dataArray));

blogpostsRouter.post(
  "/",
  checkBlogpostsSchema,
  triggerBadRequest,
  (req, res, next) => {
    try {
      console.log("request body:", req.body);
      const newPost = {
        ...req.body,
        createdAt: new Date(),
        id: uniqid(),
      };
      console.log(newPost);

      const postsArray = getBlogposts(blogpostsJSONPath);
      postsArray.push(newPost);
      writeBlogposts(blogpostsJSONPath, postsArray);

      res.status(200).send({ id: newPost.id });
    } catch (error) {
      next(error);
    }
  }
);

blogpostsRouter.get("/", (req, res, next) => {
  try {
    const blogposts = getBlogposts(blogpostsJSONPath);
    res.send(blogposts);
  } catch (error) {
    next(error);
  }
});

blogpostsRouter.get("/:blogpostId", (req, res, next) => {
  try {
    const blogposts = getBlogposts(blogpostsJSONPath);
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
blogpostsRouter.put("/:blogpostId", (req, res, next) => {
  const blogposts = getBlogposts(blogpostsJSONPath);
  const index = blogposts.findIndex(
    (blogpost) => blogpost.id === req.params.blogpostId
  );

  const oldPost = blogposts[index];
  const updatedPost = { ...oldPost, ...req.body, updatedAt: new Date() };
  blogposts[index] = updatedPost;
  writeBlogposts(blogpostsJSONPath, blogposts);
  res.send(updatedPost);

  try {
  } catch (error) {
    next(error);
  }
});

blogpostsRouter.delete("/:blogpostId", (req, res, next) => {
  try {
    const blogposts = getBlogposts(blogpostsJSONPath);
    const remainingPosts = blogposts.filter(
      (blogpost) => blogpost.id !== req.params.blogpostId
    );
    writeBlogposts(blogpostsJSONPath, remainingPosts);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
export default blogpostsRouter;
