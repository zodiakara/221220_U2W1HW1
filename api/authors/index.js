// ******************************************** USERS RELATED ENDPOINTS *****************************

/*
1. CREATE --> POST http://localhost:3001/users/ (+ body)
2. READ --> GET http://localhost:3001/users/
3. READ (single user) --> GET http://localhost:3001/users/:userId
4. UPDATE (single user) --> PUT http://localhost:3001/users/:userId (+ body)
5. DELETE (single user) --> DELETE http://localhost:3001/users/:userId

*/

import express from "express";
import fs from "fs"; // core module FILE SYSTEM
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";

const authorsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "authors.json"
);

console.log("target --->", authorsJSONPath);

const authorsRouter = express.Router();

//1. POST add an author http://localhost:3001/authors/
authorsRouter.post("/", (request, response) => {
  try {
    //   response.send({ message: "hello, I am the post route" });
    // 1. read the request body to obtain new user's data
    console.log("request body:", request.body);
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
    const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));
    // 4. push the user to the arr:
    authorsArray.push(newAuthor);
    // 5.write the array back into the file:
    fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray)); // first we call the json, then we change the auth. array to string!!
    // 6. send back the response
    response.status(200).send({ id: newAuthor.id });
  } catch (error) {
    response.send(500).send({ message: error.message });
  }
});

//2. GET all the authors http://localhost:3001/authors/
authorsRouter.get("/", async (request, response) => {
  try {
    const fileContent = fs.readFileSync(authorsJSONPath); // gives you files as buffer format
    const authors = JSON.parse(fileContent);
    response.send(authors);
  } catch (error) {
    response.send(500).send({ message: error.message });
  }
});

//3. GET a single author http://localhost:3001/authors/:authorId
authorsRouter.get("/:authorId", async (request, response) => {
  try {
    // response.send({ message: "hello, I am the GET single author route" });
    // get the user from the URL
    const authorId = request.params.authorId;
    console.log("AUTHOR ID:", authorId);
    //read the file --> getting an array
    const authorsArr = JSON.parse(fs.readFileSync(authorsJSONPath)); //get the authors array --> find the requested one (ID)

    const author = authorsArr.find((author) => author.id === authorId);

    // don't forget to send it back as RESPONSE:
    response.send(author);
  } catch (error) {
    response.send(500).send({ message: error.message });
  }
});

//4. PUT a single author http://localhost:3001/authors/:authorId
authorsRouter.put("/:authorId", (request, response) => {
  try {
    // response.send({ message: "hello, I am the UPDATE single author route" });
    const authorsArr = JSON.parse(fs.readFileSync(authorsJSONPath)); //get the authors array --> find the requested one (ID)
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

    fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArr));

    response.send(updatedAuthor);
  } catch (error) {
    response.send(500).send({ message: error.message });
  }
});

//5. DELETE a single author http://localhost:3001/authors/:authorId
authorsRouter.delete("/:authorId", (request, response) => {
  try {
    // response.send({ message: "hello, I am the DELETE single author route" });
    const authorsArr = JSON.parse(fs.readFileSync(authorsJSONPath)); //get the authors array --> find the requested one (ID)
    // new arr filtering out the DELETED item
    const remainingAuthorsArr = authorsArr.filter(
      (author) => author.id !== request.params.userId
    );
    // now we need to write it down again:
    fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingAuthorsArr));

    response.status(204).send();
  } catch (error) {
    response.send(500).send({ message: error.message });
  }
});

export default authorsRouter;
