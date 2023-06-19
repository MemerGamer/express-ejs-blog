import { __dirname } from "../app.js";
import CategoryModel from "../models/CategoryModel.js";

async function getAllCategories(req, res, _next) {
  const categories = await CategoryModel.getAll();

  res.status(200).json(categories);
}

export default {
  getAllCategories,
};
