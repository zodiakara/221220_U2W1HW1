import express from "express";
import multer from "multer";
import { saveAuthorsAvatars } from "../../lib/fs-tools.js";

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
      console.log("FILE", req.file.buffer);
      //saveAA function takes two parameters: filename and fileAsABuffer, so we need to pass these here:
      await saveAuthorsAvatars(req.file.originalname, req.file.buffer);
      res.send("stupid res for now");
    } catch (error) {
      next(error);
    }
  }
);

filesRouter.post("/multiple", multer().array(), async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

export default filesRouter;
