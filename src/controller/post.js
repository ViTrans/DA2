// list
const list = async (req, res, next) => {
  
  res.render('./admin/posts/index', { title: 'Post' });
};
const listAll = async (req, res, next) => {
  res.render('./admin/posts/admin', { title: 'Post' });
};

const addEdit = async (req, res, next) => {
  res.render('./admin/posts/add-edit', { title: 'Add-edit Post' });
};

module.exports = { addEdit, list, listAll };
