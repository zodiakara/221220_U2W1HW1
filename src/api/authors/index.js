// ******************************************** USERS RELATED ENDPOINTS *****************************

/*
1. CREATE --> POST http://localhost:3001/users/ (+ body)
2. READ --> GET http://localhost:3001/users/
3. READ (single user) --> GET http://localhost:3001/users/:userId
4. UPDATE (single user) --> PUT http://localhost:3001/users/:userId (+ body)
5. DELETE (single user) --> DELETE http://localhost:3001/users/:userId

*/

import express from "express";
import uniqid from "uniqid";
import HttpError from "http-errors";
import { getAuthors, writeAuthors } from "../../lib/fs-tools.js";
import { checkAuthorsSchema, triggerBadRequest } from "./authorsValidator.js";

const { NotFound } = HttpError;

// ALL OF THE ABOVE MOVED TO THE "fs-tools" folder - CLEARER CODE
// const authorsJSONPath = join(
//   dirname(fileURLToPath(import.meta.url)),
//   "authors.json"
// );

// console.log("target --->", authorsJSONPath);

const authorsRouter = express.Router();

//1. POST add an author http://localhost:3001/authors/
authorsRouter.post("/", async (request, response, next) => {
  try {
    // response.send({ message: "hello, I am the post route" });
    // 1. read the request body to obtain new user's data
    // console.log("request body:", request.body);
    // 2. add some server generated info (we add backend info HERE:)

    const { name, surname, email, dateOfBirth } = request.body;
    const newAuthor = {
      ...request.body,
      id: uniqid(),
      createdAt: new Date(),
      updatedAt: new Date(),
      avatar: `https://ui-avatars.com/api/?name=${name}+${surname}`,
    };
    console.log("new author", newAuthor);
    // 3. read the content of the authors.json file,
    const authorsArray = await getAuthors();
    const checkEmail = authorsArray.find(
      (author) => author.email === newAuthor.email
    );

    if (checkEmail) {
      return response.status(400).send({ error: "email in use!" });
    } else {
      // 4. push the user to the arr:
      authorsArray.push(newAuthor);
      // 5.write the array back into the file:
      await writeAuthors(authorsArray); // first we call the json, then we change the auth. array to string!!
      // 6. send back the response
      response.status(200).send({ id: newAuthor.id });
    }
  } catch (error) {
    next(error);
  }
});

//2. GET all the authors http://localhost:3001/authors/
authorsRouter.get("/", async (request, response, next) => {
  try {
    const authors = await getAuthors();
    response.send(authors);
  } catch (error) {
    next(error);
  }
});

//3. GET a single author http://localhost:3001/authors/:authorId
authorsRouter.get("/:authorId", async (request, response, next) => {
  try {
    // response.send({ message: "hello, I am the GET single author route" });
    // get the user from the URL
    const authorId = request.params.authorId;
    console.log("AUTHOR ID:", authorId);
    //read the file --> getting an array
    const authorsArr = await getAuthors(); //get the authors array --> find the requested one (ID)

    const author = authorsArr.find((author) => author.id === authorId);
    // don't forget to send it back as RESPONSE:
    if (author) {
      response.send(author);
    } else {
      next(NotFound(`Author with id ${request.params.authorId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

//4. PUT a single author http://localhost:3001/authors/:authorId
authorsRouter.put(
  "/:authorId",
  checkAuthorsSchema,
  triggerBadRequest,
  async (request, response, next) => {
    try {
      // response.send({ message: "hello, I am the UPDATE single author route" });
      const authorsArr = await getAuthors(); //get the authors array --> find the requested one (ID)
      const index = authorsArr.findIndex(
        (author) => author.id === request.params.authorId
      );
      const oldAuthor = authorsArr[index];
      const updatedAuthor = {
        ...oldAuthor,
        ...request.body,
        updatedAt: new Date(),
      };
      authorsArr[index] = updatedAuthor;
      await writeAuthors(authorsArr);
      response.send(updatedAuthor);
    } catch (error) {
      next(error);
    }
  }
);

//5. DELETE a single author http://localhost:3001/authors/:authorId
authorsRouter.delete("/:authorId", async (request, response, next) => {
  try {
    const authorsArr = await getAuthors(); //get the authors array --> find the requested one (ID)
    // new arr filtering out the DELETED item
    const remainingAuthorsArr = authorsArr.filter(
      (author) => author.id !== request.params.authorId
    );
    // now write it down again:
    await writeAuthors(remainingAuthorsArr);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

//6. POST AUTHOR AVATAR:
//URL: http://localhost:3001/authors/:authorId/uploadAvatar

export default authorsRouter;
