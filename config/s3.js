const { S3Client } = require('@aws-sdk/client-s3');

const region = process.env.APP_AWS_BUCKET_REGION;
const accessKeyId = process.env.APP_AWS_ACCESS_KEY;
const secretAccessKey = process.env.APP_AWS_SECRET_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  region,
});

module.exports = s3;
