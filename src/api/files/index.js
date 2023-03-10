import express from "express";
import multer from "multer";
import { pipeline } from "stream";
import { extname } from "path";
import {
  getAuthors,
  writeAuthors,
  saveAuthorsAvatars,
} from "../../lib/fs-tools.js";
import { findPostById } from "../../db/postTools.js";
import { getPDFReadableStream } from "../../lib/pdf-tools.js";

const filesRouter = express.Router();

//creating two endpoints one to upload single file and one tu upload multiple files
// SAME LOGIC IN CREATING ROUTER: router.method(endpoint, async (req,res,next) => {try catch})

filesRouter.post(
  "/:authorId/single",
  multer().single("avatar"),
  async (req, res, next) => {
    // multer().single('prop') 'prop' must match the exact name of the field appended in the formData object coming from the FE
    // if these two don't match, multer won't find the file
    try {
      // adding a picture to the author object:
      const originalFileNameExtension = extname(req.file.originalname);
      const fileName = req.params.authorId + originalFileNameExtension;

      await saveAuthorsAvatars(fileName, req.file.buffer);

      const url = `http://localhost:3001/img/authors/${fileName}`;

      const authors = await getAuthors();

      const index = authors.findIndex(
        (author) => author.id === req.params.authorId
      );
      if (index !== -1) {
        const oldAuthor = authors[index];
        const avatar = { avatar: url };
        // just avatar here ?

        const updatedAuthor = {
          ...oldAuthor,
          avatar,
          updatedAt: new Date(),
        };
        authors[index] = updatedAuthor;

        await writeAuthors(authors);
      }

      res.send("file saved");

      //console.log("FILE", req.file.buffer);
      //saveAA function takes two parameters: filename and fileAsABuffer, so we need to pass these here:

      //res.send("stupid res for now");
    } catch (error) {
      next(error);
    }
  }
);

filesRouter.post(
  "/multiple",
  multer().array("avatars"),
  async (req, res, next) => {
    try {
      console.log("files", req.files);
      await Promise.all(
        req.files.map((file) =>
          saveAuthorsAvatars(file.originalname, file.buffer)
        )
      );
      res.send("files uploaded");
    } catch (error) {
      next(error);
    }
  }
);

filesRouter.get("/:blogpostId/pdf", async (req, res, next) => {
  try {
    const post = await findPostById(req.params.blogpostId);
    if (post) {
      res.setHeader("Content-Disposition", "attachment; filename=test.pdf");
      const source = getPDFReadableStream(post);
      const destination = res;
      pipeline(source, destination, (err) => {
        if (err) console.log(err);
      });
    } else {
      next(
        NotFound(`Post with id ${req.params.blogpostId} has not been found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});
export default filesRouter;
