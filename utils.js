const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const crypto = require('crypto');
const s3 = require('./config/s3');

const getImageUrl = async (objectKey) => {
  try {
    const params = {
      Bucket: process.env.APP_AWS_BUCKET_NAME,
      Key: objectKey,
    };

    let signingDate = new Date();
    signingDate.setUTCHours(0, 0, 0, 0);
    signingDate.setUTCDate(signingDate.getUTCDate() - 1);

    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3, command, {
      expiresIn: 3 * 3600 * 24,
      signingDate,
    });

    return Promise.resolve(url);
  } catch (e) {
    return Promise.reject(e.message);
  }
};

const randomImageName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString('hex');

module.exports = { getImageUrl, randomImageName };
