const Work = require('../models/work');
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../config/s3');
const { randomImageName, getImageUrl } = require('../utils');

const bucketName = process.env.APP_AWS_BUCKET_NAME;

const getWorks = async (req, res) => {
  try {
    let query = Work.find().lean();

    if (req.query.sort) {
      query = query.sort(req.query.sort);
    }

    const works = await query;

    for (const work of works) {
      work.thumbnailUrl = await getImageUrl(work.thumbnail);
    }

    res.json(works);
  } catch (e) {
    console.log(e.message);
    res.status(400).json({ message: e.message });
  }
};

const createWork = async (req, res) => {
  try {
    const body = req.body;

    if (req.file) {
      const thumbnailName = randomImageName();

      const params = {
        Bucket: bucketName,
        Key: thumbnailName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      const command = new PutObjectCommand(params);
      await s3.send(command);
      body.thumbnail = thumbnailName;
    }

    const work = await Work.create(body);

    res.json(work);
  } catch (e) {
    console.log(e.message);
    res.status(400).json(e.errors);
  }
};

const getWork = async (req, res) => {
  try {
    const work = await Work.findById(req.params.id).lean();

    work.thumbnailUrl = await getImageUrl(work.thumbnail);

    res.json(work);
  } catch (e) {
    console.log(e.message);
    res.status(400).json({ message: e.message });
  }
};

const updateWork = async (req, res) => {
  try {
    const body = req.body;

    if (req.file) {
      const { thumbnail } = await Work.findById(req.params.id);

      const params = {
        Bucket: bucketName,
        Key: thumbnail,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      const command = new PutObjectCommand(params);
      await s3.send(command);
    }

    await Work.findByIdAndUpdate(req.params.id, body);
    res.sendStatus(200);
  } catch (e) {
    console.log(e.message);
    res.status(400).json(e.errors);
  }
};

const deleteWork = async (req, res) => {
  try {
    const work = await Work.findById(req.params.id);

    const params = {
      Bucket: bucketName,
      Key: work.thumbnail,
    };

    const command = new DeleteObjectCommand(params);
    await s3.send(command);

    await work.remove();
    res.sendStatus(200);
  } catch (e) {
    console.log(e.message);
    res.status(400).json(e.errors);
  }
};

module.exports = {
  getWorks,
  createWork,
  getWork,
  updateWork,
  deleteWork,
};
