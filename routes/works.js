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
const checkClaims = require('../middleware/checkClaims');
const checkJwt = require('../middleware/checkJwt');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', getWorks);
router.get('/:id', getWork);

router.post(
  '/',
  checkJwt,
  checkClaims('create:work'),
  upload.single('thumbnailFile'),
  createWork
);

router.put(
  '/:id',
  checkJwt,
  checkClaims('update:work'),
  upload.single('thumbnailFile'),
  updateWork
);

router.delete('/:id', checkJwt, checkClaims('delete:work'), deleteWork);

module.exports = router;
