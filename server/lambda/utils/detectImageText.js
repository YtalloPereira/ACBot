const { DetectTextCommand } = require('@aws-sdk/client-rekognition');
const { rekognition } = require('../lib/aws');

module.exports.detectImageText = async (filename) => {
  // Cria um comando para detectar texto na imagem
  const command = new DetectTextCommand({
    Image: {
      S3Object: {
        Bucket: process.env.RESOURCE_PREFIX,
        Name: filename,
      },
    },
  });

  // Envia o comando para o serviço de Rekognition
  const detectText = await rekognition.send(command);

  return detectText;
};
