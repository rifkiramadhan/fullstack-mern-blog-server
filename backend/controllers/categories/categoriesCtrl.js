const expressAsyncHandler = require('express-async-handler');
const Category = require('../../model/category/Category');

const createCategoryCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const category = await Category.create({
      user: req.user._id,
      title: req.body.title,
    });

    res.json(category);
  } catch (error) {
    res.json(error);
  }
});

// Fetch Category
const fetchCategoriesCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({})
      .populate('user')
      .sort('-createdAt');

    res.json(categories);
  } catch (error) {
    res.json(error);
  }
});

// Fetch All Categories
const fetchCategoryCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id)
      .populate('user')
      .sort('-createdAt');

    res.json(category);
  } catch (error) {
    res.json(error);
  }
});

// Update Category
const updateCategoryCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findByIdAndUpdate(
      id,
      {
        title: req?.body?.title,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.json(category);
  } catch (error) {
    res.json(error);
  }
});

// Delete Category
const deleteCategoryCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findByIdAndDelete(id);
    res.json(category);
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  createCategoryCtrl,
  fetchCategoriesCtrl,
  fetchCategoryCtrl,
  updateCategoryCtrl,
  deleteCategoryCtrl,
};
