import express from "express";
import authorsRouter from "../api/authors/index.js";
import blogpostsRouter from "../api/blogposts/index.js";
import listEndpoints from "express-list-endpoints";
import cors from "cors";

const server = express();
const port = 3001;

server.use(cors());
server.use(express.json()); // adding this line to define all the endpoints

server.use("/authors", authorsRouter);
server.use("/blogposts", blogpostsRouter);

server.listen(port, () => {
  console.log(`this server is running on port ${port}`);
  console.table(listEndpoints(server));
});
