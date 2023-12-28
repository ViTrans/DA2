const Category = require('../../models/category');
// get all categories
const getAll = async (req, res) => {
  try {
    const categories = await Category.find();

    res.status(200).json({
      data: categories,
    });
  } catch (error) {
    res.status(500);
  }
};

// get  category by id
const getbyId = async (req, res) => {
  const id = req.params.id;
  const categories = await Category.findById(id);
  res.status(200).json(categories);
};

const delCate = async (req, res) => {
  try {
    const id = req?.params?.id;
    if (!id) return res.status(400);
    const category = await Category.findByIdAndDelete(req.params.id, { new: true });

    res.status(200).json({
      code: 200,
      data: category,
    });
  } catch (error) {
    res.status(500);
  }
};

// add

const create = async (req, res) => {
  try {
    const data = {
      title: req.body.title,
    };
    const category = await Category.create(data);
    res.status(201).json({
      code: 201,
      data: category,
    });
  } catch (error) {
    res.status(500);
  }
};

// updated

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const data = {
      title: req.body.title,
    };
    const category = await Category.findByIdAndUpdate(id, data);

    res.status(200).json({
      code: 200,
      data: category,
    });
  } catch (error) {
    res.status(500);
  }
};
module.exports = { getAll, getbyId, create, update, delCate };
