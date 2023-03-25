const { Router } = require('express');
const router = Router();

// get all
router.get('/', (req, res) => {
  res.json({
    message: 'get all post',
  });
});
// get by id
router.get('/:id', (req, res) => {
  res.json({
    message: 'get by id',
  });
});

module.exports = router;
