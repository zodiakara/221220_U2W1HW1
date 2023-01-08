import express from "express";
import authorsRouter from "./api/authors/index.js";
import blogpostsRouter from "./api/blogposts/index.js";
import filesRouter from "./api/files/index.js";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import { join } from "path";
import {
  badRequestHandler,
  genericErrorHandler,
  notFoundHandler,
  unauthorizedHandler,
} from "./errorHandlers.js";

const server = express();
const port = 3001;

const publicFolderPath = join(process.cwd(), "./public");

server.use(express.static(publicFolderPath));
server.use(cors());
server.use(express.json()); // adding this line to define all the endpoints

//endpoints:
server.use("/authors", authorsRouter);
server.use("/blogposts", blogpostsRouter);
server.use("/files", filesRouter);

// error handlers:
server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

server.listen(port, () => {
  console.log(`this server is running on port ${port}`);
  console.table(listEndpoints(server));
});
