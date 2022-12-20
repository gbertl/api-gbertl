const Work = require('../models/work');
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const crypto = require('crypto');

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  region,
});

const randomImageName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString('hex');

const getWorks = async (req, res) => {
  const works = await Work.find().lean();

  for (const work of works) {
    const params = {
      Bucket: bucketName,
      Key: work.thumbnail,
    };

    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    work.thumbnailUrl = url;
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

  const params = {
    Bucket: bucketName,
    Key: work.thumbnail,
  };

  const command = new GetObjectCommand(params);
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  work.thumbnailUrl = url;

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
