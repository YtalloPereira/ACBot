const { GetCommand } = require('@aws-sdk/lib-dynamodb');
const { polly, dynamoDBDocClient } = require('../lib/aws');
const crypto = require('crypto');
const { SynthesizeSpeechCommand } = require('@aws-sdk/client-polly');
const { uploadToS3 } = require('./uploadToS3');
const { saveToDynamoDB } = require('./saveToDynamoDB');
const { Buffer } = require('buffer');
const { getObjectToS3 } = require('./getObjectToS3');

module.exports.generateAudio = async (input) => {
  // Gera o hash do texto de entrada
  const hash = crypto.createHash('sha256').update(input).digest('hex');

  // Cria o comando para verificar se o áudio já foi gerado e guardado no DynamoDB
  const getCommand = new GetCommand({
    TableName: `${process.env.RESOURCE_PREFIX}-audios`,
    Key: { phraseHash: hash },
  });

  // Busca o áudio no DynamoDB
  const dynamoDbResponse = await dynamoDBDocClient.send(getCommand);

  // Se o áudio já foi gerado, retorna a URL
  if (dynamoDbResponse.Item) {
    // Pega a URL do audio do s3 assinada
    const audioUrl = await getObjectToS3(dynamoDbResponse.Item.audioPath);

    return audioUrl;
  }

  // Se o áudio não foi gerado, cria o comando de SynthesizeSpeech do Polly para sintetizar a fala
  const synthetizeSpeechCommand = new SynthesizeSpeechCommand({
    OutputFormat: 'mp3',
    Text: input,
    VoiceId: 'Vitoria',
  });

  // Sintetiza a fala com o Polly
  const pollyResponse = await polly.send(synthetizeSpeechCommand);

  // Extrai o áudio da resposta do Polly
  const bytesArray = await pollyResponse.AudioStream.transformToByteArray();

  const audioBuffer = await Buffer.from(bytesArray);

  // Cria o hash do áudio
  const audioPath = `uploads/audios/${hash}.mp3`;

  // Salva o áudio no S3
  await uploadToS3({
    key: audioPath,
    data: audioBuffer,
  });

  // Pega a URL do audio do s3 assinada
  const audioUrl = await getObjectToS3(audioPath);

  // Salva no DynamoDB
  await saveToDynamoDB({
    table: 'audios',
    item: {
      phraseHash: hash,
      audioPath,
    },
  });

  // Retorna a URL do S3
  return audioUrl;
};
