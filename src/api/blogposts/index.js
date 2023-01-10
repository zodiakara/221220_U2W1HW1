// ******************************************** BLOG POSTS RELATED ENDPOINTS *****************************

/*
1. CREATE --> POST http://localhost:3001/blogposts/ (+ body)
2. READ (all posts)--> GET http://localhost:3001/blogposts/
3. READ (single post) --> GET http://localhost:3001/blogposts/:postId
4. UPDATE (single post) --> PUT http://localhost:3001/blogposts/:postId (+ body)
5. DELETE (single post) --> DELETE http://localhost:3001/blogposts/:postId

*/

import express from "express";
import multer from "multer";
import { extname } from "path";
import httpErrors from "http-errors";
import {
  checkBlogpostsSchema,
  triggerBadRequest,
} from "./blogpostsValidator.js";
import {
  getBlogposts,
  writeBlogposts,
  savePostsCoverPictures,
} from "../../lib/fs-tools.js";
import {
  saveNewPost,
  findPosts,
  findPostById,
  findPostByIdAndUpdate,
  findPostByIdAndDelete,
} from "../../db/postTools.js";
import { saveNewComment } from "../../db/commentsTools.js";

const { NotFound, Unauthorized, BadRequest } = httpErrors;

const blogpostsRouter = express.Router();

// POST NEW BLOGPOST
blogpostsRouter.post(
  "/",
  checkBlogpostsSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const id = await saveNewPost(req.body);
      res.status(200).send({ id });
    } catch (error) {
      next(error);
    }
  }
);

// GET ALL BLOGPOSTS
blogpostsRouter.get("/", async (req, res, next) => {
  try {
    const blogposts = await findPosts();
    res.send(blogposts);
  } catch (error) {
    next(error);
  }
});

// GET A SINGLE BLOGPOST
blogpostsRouter.get("/:blogpostId", async (req, res, next) => {
  try {
    const post = await findPostById(req.params.blogpostId);
    if (post) {
      res.send(post);
    } else {
      next(
        NotFound(`Post with id ${req.params.blogpostId} has not been found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

// PUT NEW BLOG PUT
blogpostsRouter.put("/:blogpostId", async (req, res, next) => {
  // const blogposts = await getBlogposts();
  // const index = blogposts.findIndex(
  //   (blogpost) => blogpost.id === req.params.blogpostId
  // );

  // const oldPost = blogposts[index];
  // const updatedPost = { ...oldPost, ...req.body, updatedAt: new Date() };
  // blogposts[index] = updatedPost;
  // await writeBlogposts(blogposts);
  // res.send(updatedPost);

  try {
    const updatedPost = await findPostByIdAndUpdate(
      req.params.blogpostId,
      req.body
    );

    if (updatedPost) {
      res.send(updatedPost);
    } else {
      next(
        NotFound(`Post with id ${req.params.blogpostId} has not been found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

// DELETE
blogpostsRouter.delete("/:blogpostId", async (req, res, next) => {
  try {
    // const blogposts = await getBlogposts();
    // const remainingPosts = blogposts.filter(
    //   (blogpost) => blogpost.id !== req.params.blogpostId
    // );
    // await writeBlogposts(remainingPosts);
    // res.status(204).send();
    const updatedPost = await findPostByIdAndDelete(req.params.blogpostId);
    if (updatedPost) {
      res.status(204).send();
    } else {
      next(
        NotFound(`Post with id ${req.params.blogpostId} has not been found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

//6. PATCH BLOG COVER
//URL: http://localhost:3001/blogPosts/:blogPostiD/uploadCover
blogpostsRouter.post(
  "/:blogpostId/uploadCover",
  multer().single("uploadCover"),
  async (req, res, next) => {
    try {
      const originalFileNameExtension = extname(req.file.originalname);
      const fileName = req.params.blogpostId + originalFileNameExtension;

      await savePostsCoverPictures(fileName, req.file.buffer);
      const url = `http://localhost:3001/img/blogposts/${fileName}`;

      const blogposts = await getBlogposts();
      const index = blogposts.findIndex(
        (blogpost) => blogpost.id === req.params.blogpostId
      );

      if (index !== -1) {
        const oldPost = blogposts[index];

        const updatedPost = {
          ...oldPost,
          ...req.body,
          cover: url,
          updatedAt: new Date(),
        };
        blogposts[index] = updatedPost;
        await writeBlogposts(blogposts);
      }
      res.send("file saved!");
    } catch (error) {
      next(error);
    }
  }
);
// **************************************COMMENTS CRUD

blogpostsRouter.post("/:blogpostId/comments", async (req, res, next) => {
  try {
    const review = await saveNewComment(req.params.blogpostId, req.body);

    if (review) {
      res.send.review;
    } else {
      next(
        NotFound(`Post with id ${req.params.blogpostId} has not been found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default blogpostsRouter;
