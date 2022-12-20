import express from "express";

const server = express();
const port = 3001;

server.use(express.json()); // adding this line to define all the endpoints

server.listen(port, () => {
  console.log(`this server is running on port ${port}`);
});
