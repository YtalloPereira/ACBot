const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { s3 } = require('../lambda/lib/aws');
const path = require('node:path');
const fs = require('node:fs');

const storageDocumentsInS3 = async (file) => {
  // Cria o comando para armazenar os documentos no S3
  const command = new PutObjectCommand({
    Bucket: process.env.RESOURCE_PREFIX,
    Key: `documents/${file.name}`,
    Body: file.data,
  });

  // Envia o comando para o S3
  await s3.send(command);
};

(async () => {
  try {
    // Array com os documentos a serem armazenados
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

    // Armazena os arquivos no S3
    await Promise.all(
      files.map(async (file) => {
        // Lê o arquivo e chama a função para armazenar no S3
        const data = fs.readFileSync(file.path);
        await storageDocumentsInS3({ name: file.name, data });
      })
    );

    console.log('Documentos armazenados com sucesso!');
  } catch (error) {
    console.log(error);
  }
})();
