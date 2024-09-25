const path = require('node:path');
const fs = require('node:fs');
const { uploadToS3 } = require('../lambda/utils/uploadToS3');

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

const storageInBucket = async (file) => {
  // Lê o arquivo e chama a função para armazenar no S3
  const data = fs.readFileSync(file.path);
  await uploadToS3({ key: `documents/${file.name}`, data });
};

(async () => {
  try {
    // Armazena os arquivos no S3
    await Promise.all(
      files.map(async (file) => {
        await storageInBucket(file);
      })
    );

    console.log('Documentos armazenados com sucesso!');
  } catch (error) {
    console.log(error);
  }
})();
