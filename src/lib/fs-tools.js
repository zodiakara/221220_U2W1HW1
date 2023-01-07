import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs-extra";

const { readJSON, writeJSON } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const blogpostsJSONPath = join(dataFolderPath, "blogposts.json");
const authorsJSONPath = join(dataFolderPath, "authors.json");

export const getBlogposts = () => readJSON(blogpostsJSONPath);
export const writeBlogposts = (blogposts) =>
  writeJSON(blogpostsJSONPath, blogposts);
export const getAuthors = () => {};
export const writeAuthors = () => {};
