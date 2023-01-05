import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const blogpostsSchema = {
  category: {
    in: ["body"],
    isString: {
      errorMessage: "category is a mandatory field and needs to be a string",
    },
  },
  title: {
    in: ["body"],
    isString: {
      errorMessage: "title is a mandatory field and needs to be a string",
    },
  },
  cover: {
    in: ["body"],
    isString: {
      errorMessage: "cover is a mandatory field and needs to be a string",
    },
  },
  "readTime.value": {
    in: ["body"],
    isNumeric: {
      errorMessage:
        "read time value is a mandatory field and needs to be a number",
    },
  },
  "readTime.unit": {
    in: ["body"],
    isString: {
      errorMessage:
        "read time unit is a mandatory field and needs to be a string",
    },
  },
  "author.name": {
    in: ["body"],
    isString: {
      errorMessage: "author name is a mandatory field and needs to be a string",
    },
  },
  "author.avatar": {
    in: ["body"],
    isString: {
      errorMessage:
        "author avatar is a mandatory field and needs to be a string",
    },
  },
  content: {
    in: ["body"],
    isString: {
      errorMessage: "content is a mandatory field and needs to be a string",
    },
  },
};

export const checkBlogpostsSchema = checkSchema(blogpostsSchema);

export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors.array());
  if (!errors.isEmpty()) {
    next(
      createHttpError(400, "error during validation", {
        errorsList: errors.array(),
      })
    );
  } else {
    next();
  }
};
