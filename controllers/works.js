const Work = require('../models/work');
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../config/s3');
const { randomImageName, getImageUrl } = require('../utils');

const bucketName = process.env.APP_AWS_BUCKET_NAME;

const getWorks = async (req, res) => {
  const works = await Work.find().lean();

  for (const work of works) {
    work.thumbnailUrl = await getImageUrl(work.thumbnail);
  }

  res.json(works);
};

const createWork = async (req, res) => {
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
};

const getWork = async (req, res) => {
  const work = await Work.findById(req.params.id).lean();

  work.thumbnailUrl = await getImageUrl(work.thumbnail);

  res.json(work);
};

const updateWork = async (req, res) => {
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
};

const deleteWork = async (req, res) => {
  const work = await Work.findById(req.params.id);

  const params = {
    Bucket: bucketName,
    Key: work.thumbnail,
  };

  const command = new DeleteObjectCommand(params);
  await s3.send(command);

  await work.remove();
  res.sendStatus(200);
};

module.exports = {
  getWorks,
  createWork,
  getWork,
  updateWork,
  deleteWork,
};
