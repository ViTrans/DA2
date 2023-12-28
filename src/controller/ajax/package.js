const Package = require('../../models/package');

const create = async (req, res) => {
  try {
    const formatPrice = req?.body?.price.replace(/\D/g, '');
    const price = +formatPrice || 0;

    const data = {
      name: req.body.name,
      description: req.body.description,
      price,
      duration: +req.body.duration,
      user_id: req?.user?.id,
    };
    const package = await Package.create(data);
    res.status(201).json({
      code: 201,
      data: package,
    });
  } catch (error) {
    res.status(500);
  }
};
const getAll = async (req, res) => {
  try {
    const packages = await Package.find();
    res.status(200).json({
      code: 200,
      data: packages,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: 'Something Went Wrong',
    });
  }
};

const getbyId = async (req, res) => {
  try {
    const id = req.params.id;
    const pack = await Package.findById(id);
    res.status(200).json(pack);
  } catch (error) {
    res.status(500);
  }
};
const update = async (req, res) => {
  try {
    const formatPrice = req?.body?.price.replace(/\D/g, '');
    const price = +formatPrice || 0;
    const { id } = req.params;

    const data = {
      name: req.body.name,
      description: req?.body?.description,
      price,
      duration: +req?.body?.duration,
    };
    const package = await Package.findByIdAndUpdate(id, data);

    res.status(200).json({
      code: 200,
      data: package,
    });
  } catch (error) {
    res.status(500);
  }
};
module.exports = { getAll, getbyId, update, create };
