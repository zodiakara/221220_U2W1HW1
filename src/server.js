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
import createHttpError from "http-errors";

const server = express();
const port = process.env.PORT;

const publicFolderPath = join(process.cwd(), "./public");

const whitelist = [
  process.env.BE_URL,
  process.env.FE_DEV_URL,
  process.env.FE_PROD_URL,
];

const corsOpts = {
  // cors midleware that check if the webpage address is on the whitelist
  origin: (origin, corsNext) => {
    console.log("current origin:", origin);
    if (whitelist.indexOf(origin) !== -1) {
      // if the index is not empty, hence the address is on the white list -> continue
      corsNext(null, true);
    } else {
      // if it is not -> error
      corsNext(
        createHttpError(400, `Origin ${origin} is not on the whitelist!!`)
      );
    }
  },
};

server.use(express.static(publicFolderPath));
server.use(cors());
server.use(express.json()); // adding this line to define all the endpoints

//endpoints:
server.use("/authors", authorsRouter);
server.use("/blogposts", blogpostsRouter);
server.use("/blogposts", filesRouter);

// error handlers:
server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

server.listen(port, () => {
  console.log(`this server is running on port ${port}`);
  console.table(listEndpoints(server));
});
