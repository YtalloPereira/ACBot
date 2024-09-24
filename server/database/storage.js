const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { s3 } = require('../lambda/lib/aws');
const path = require('node:path');
const fs = require('node:fs');

const storageDocumentsInS3 = async (file) => {
  // Create a PutObjectCommand
  const command = new PutObjectCommand({
    Bucket: process.env.RESOURCE_PREFIX,
    Key: `documents/${file.name}`,
    Body: file.data,
  });

  // Upload the file to S3
  await s3.send(command);
};

(async () => {
  try {
    // Array of files to be stored in S3
    const files = [
      {
        name: 'Anexo_III.pdf',
        path: path.resolve(__dirname, '../../assets/docs/Anexo_III.pdf'),
      },
      {
        name: 'Anexo_IV.pdf',
        path: path.resolve(__dirname, '../../assets/docs/Anexo_IV.pdf'),
      },
    ];

    // Store the files in S3
    await Promise.all(
      files.map(async (file) => {
        const data = fs.readFileSync(file.path);
        await storageDocumentsInS3({ name: file.name, data });
      })
    );

    console.log('Documentos armazenados com sucesso!');
  } catch (error) {
    console.log(error);
  }
})();
