const express = require('express');
const {
  createCategoryCtrl,
  fetchCategoriesCtrl,
  fetchCategoryCtrl,
  updateCategoryCtrl,
  deleteCategoryCtrl,
} = require('../../controllers/categories/categoriesCtrl');
const authMiddleware = require('../../middlewares/auth/authMiddleware');
const categoriesRoutes = express.Router();

categoriesRoutes.post('/', authMiddleware, createCategoryCtrl);
categoriesRoutes.get('/', authMiddleware, fetchCategoriesCtrl);
categoriesRoutes.get('/:id', authMiddleware, fetchCategoryCtrl);
categoriesRoutes.put('/:id', authMiddleware, updateCategoryCtrl);
categoriesRoutes.delete('/:id', authMiddleware, deleteCategoryCtrl);

module.exports = categoriesRoutes;
