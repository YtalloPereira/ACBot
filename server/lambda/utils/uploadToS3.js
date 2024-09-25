const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { s3 } = require('../lib/aws');

module.exports.uploadToS3 = async (file) => {
  const command = new PutObjectCommand({
    Bucket: process.env.RESOURCE_PREFIX,
    Key: file.key,
    Body: file.data,
  });

  await s3.send(command);
};
