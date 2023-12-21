var express = require('express');
const Multer = require('multer');
var router = express.Router();

const {
  getAllTranslateGambar,
  getTranslateGambarById,
  getTranslateGambarByTranslate,
  addTranslateGambar,
  deleteTranslateGambar
} = require('../controllers/TranslateGambar');

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

router.get('/', getAllTranslateGambar);
router.get('/:id', getTranslateGambarById);
router.get('/satwa/:id', getTranslateGambarByTranslate);
router.post('/', multer.single('gambar'), addTranslateGambar);
router.delete('/:id', deleteTranslateGambar);

module.exports = router;