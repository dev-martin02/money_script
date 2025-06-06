import express from "express";
import { check_user } from "../../shared/middleware/checkUser.js";
import {
  delete_categorys,
  get_category,
  post_category,
  put_category,
} from "./controllers.js";
const categories_Router = express.Router();

categories_Router
  .route("/categories")
  .all(check_user)
  .get(get_category)
  .post(post_category)
  .put(put_category)
  .delete(delete_categorys);

export default categories_Router;
