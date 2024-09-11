const { PutObjectCommand, S3Client } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { randomUUID } = require('crypto');

const s3 = new S3Client();

module.exports.makeSignedUrl = async (filename) => {
  // Generate a unique object key
  const objectKey = randomUUID().concat(`_${filename.replace(/ /g, '_')}`);

  // Create a PutObjectCommand
  const command = new PutObjectCommand({
    Bucket: `${process.env.RESOURCE_PREFIX}-bt`,
    Key: objectKey, // Generate a random UUID to avoid collisions
  });

  // Generate a signed URL for the client to upload the file
  const signedUrl = await getSignedUrl(s3, command, {
    expiresIn: 120, // 2 min
  });

  return { objectKey, signedUrl };
};
