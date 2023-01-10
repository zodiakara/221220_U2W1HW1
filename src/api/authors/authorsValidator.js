import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const authorsSchema = {
  name: {
    in: ["body"],
    isString: {
      errorMessage: "name is a mandatory field and needs to be a string",
    },
  },
  surname: {
    in: ["body"],
    isString: {
      errorMessage: "surname is a mandatory field and needs to be a string",
    },
  },
  email: {
    in: ["body"],
    isString: {
      errorMessage: "cover is a mandatory field and needs to be a string",
    },
  },
  dateOfBirth: {
    in: ["body"],
    isString: {
      errorMessage: "Birth Date is a mandatory field and needs to be a string",
    },
  },
  avatar: {
    in: ["body"],
    isString: {
      errorMessage: "avatar is a mandatory field and needs to be a string",
    },
  },
};

export const checkAuthorsSchema = checkSchema(authorsSchema);

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
