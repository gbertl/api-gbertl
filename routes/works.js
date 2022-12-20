const express = require('express');
const multer = require('multer');
const router = express.Router();
const {
  getWorks,
  createWork,
  getWork,
  updateWork,
  deleteWork,
} = require('../controllers/works');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', getWorks);
router.get('/:id', getWork);

router.post('/', upload.single('thumbnailFile'), createWork);

router.put('/:id', upload.single('thumbnailFile'), updateWork);

router.delete('/:id', deleteWork);

module.exports = router;
