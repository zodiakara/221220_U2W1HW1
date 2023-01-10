import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs-extra";

const { readJSON, writeJSON, writeFile } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const publicAuthorsFolderPath = join(process.cwd(), "./public/img/authors");
const publicPostsFolderPath = join(process.cwd(), "./public/img/blogposts");

// console.log("current working directory:", process.cwd());
// console.log("public folder path", publicFolderPath);
// console.log(dataFolderPath);

const blogpostsJSONPath = join(dataFolderPath, "blogposts.json");
const authorsJSONPath = join(dataFolderPath, "authors.json");

export const getBlogposts = () => readJSON(blogpostsJSONPath);
export const writeBlogposts = (blogposts) =>
  writeJSON(blogpostsJSONPath, blogposts);
export const getAuthors = () => readJSON(authorsJSONPath);
export const writeAuthors = (authors) => writeJSON(authorsJSONPath, authors);

export const saveAuthorsAvatars = (fileName, contentAsABuffer) =>
  writeFile(join(publicAuthorsFolderPath, fileName), contentAsABuffer);

export const savePostsCoverPictures = (fileName, contentAsABuffer) =>
  writeFile(join(publicPostsFolderPath, fileName), contentAsABuffer);
