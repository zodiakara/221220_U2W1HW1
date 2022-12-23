// ******************************************** BLOG POSTS RELATED ENDPOINTS *****************************

/*
1. CREATE --> POST http://localhost:3001/blogposts/ (+ body)
2. READ (all posts)--> GET http://localhost:3001/blogposts/
3. READ (single post) --> GET http://localhost:3001/blogposts/:postId
4. UPDATE (single post) --> PUT http://localhost:3001/blogposts/:postId (+ body)
5. DELETE (single post) --> DELETE http://localhost:3001/blogposts/:postId

*/

import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";

const blogpostsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "blogposts.json"
);
console.log(blogpostsJSONPath);

const blogpostsRouter = express.Router();

blogpostsRouter.post("/", (req, res) => {
  console.log("request body:", req.body);
  const newPost = {
    ...req.body,
    createdAt: new Date(),
    id: uniqid(),
  };
  console.log(newPost);

  const postsArray = JSON.parse(fs.readFileSync(blogpostsJSONPath));
  postsArray.push(newPost);
  fs.writeFileSync(blogpostsJSONPath, JSON.stringify(postsArray));

  res.status(200).send({ id: newPost.id });
});

blogpostsRouter.get("/", (req, res) => {
  const fileContent = fs.readFileSync(blogpostsJSONPath);
  const blogposts = JSON.parse(fileContent);
  res.send(blogposts);
});

export default blogpostsRouter;
