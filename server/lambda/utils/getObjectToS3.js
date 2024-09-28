const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { s3 } = require('../lib/aws');

module.exports.getObjectToS3 = async (path) => {
  // Cria o comando para pegar o objeto no S3
  const command = new GetObjectCommand({
    Bucket: process.env.RESOURCE_PREFIX,
    Key: path,
  });

  // Gera a URL assinada
  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3000 });
  return signedUrl;
};
