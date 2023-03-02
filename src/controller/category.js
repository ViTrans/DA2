const Category = require('../models/category');

// create a new category
const createCaregory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    console.log('create category', category);
    res.redirect('/categories');
  } catch (error) {
    console.log(error);
    res.render('/create-category', { category });
  }
};

// form
const newForm = (req, res, next) => {
  res.render('create-category', { title: 'new Category' });
};

// list
const list = async (req, res, next) => {
  try {
    const categories = await Category.find();
    console.log(categories);
    res.render('category', { title: 'Category', categories });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createCaregory, newForm, list };
