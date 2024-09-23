const { GetCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { polly, dynamoDBDocClient, s3 } = require('../lib/aws');
const crypto = require('crypto');

// Função para gerar o hash da frase
const generateHash = (phrase) => {
  return crypto.createHash('sha256').update(phrase).digest('hex');
};

// Função para salvar o áudio no S3
const uploadToS3 = async (audioBuffer, key) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: audioBuffer,
    ContentType: 'audio/mpeg',
    ACL: 'public-read',
  };

  const result = await s3.upload(params).promise();
  return result.Location; // Retorna a URL do arquivo no S3
};

// Função para salvar no DynamoDB
const saveToDynamoDB = async (hash, s3Url) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Item: {
      phraseHash: hash,
      audioUrl: s3Url,
    },
  };

  await dynamoDBDocClient.send(new PutCommand(params));
};

// Função principal de geração e verificação do áudio
const generateOrFetchAudio = async (phrase) => {
  const hash = generateHash(phrase);

  // Verificar no DynamoDB
  const getParams = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Key: { phraseHash: hash },
  };

  const data = await dynamoDBDocClient.send(new GetCommand(getParams));

  // Se o áudio já foi gerado, retorna a URL
  if (data.Item) {
    return data.Item.audioUrl;
  }

  // Se não, gera o áudio com Polly
  const pollyParams = {
    OutputFormat: 'mp3',
    Text: phrase,
  };

  const pollyResponse = await polly.synthesizeSpeech(pollyParams).promise();
  const audioBuffer = pollyResponse.AudioStream;

  // Salva o áudio no S3
  const s3Key = `audio/${hash}.mp3`;
  const s3Url = await uploadToS3(audioBuffer, s3Key);

  // Salva no DynamoDB
  await saveToDynamoDB(hash, s3Url);

  // Retorna a URL do S3
  return s3Url;
};

// Função Lambda handler
module.exports.generateAudio = async (event) => {
  try {
    const phrase = event.inputTranscript || "Nenhuma frase fornecida";

    // Chama a função para verificar ou gerar o áudio
    const audioUrl = await generateOrFetchAudio(phrase);

    // Responde ao Amazon Lex com a URL do áudio gerado
    return {
      sessionAttributes: event.sessionAttributes,
      dialogAction: {
        type: 'Close',
        fulfillmentState: 'Fulfilled',
        message: {
          contentType: 'PlainText',
          content: `Aqui está o link do áudio: ${audioUrl}`,
        },
      },
    };
  } catch (error) {
    console.error("Erro ao gerar o áudio:", error);
    return {
      sessionAttributes: event.sessionAttributes,
      dialogAction: {
        type: 'Close',
        fulfillmentState: 'Failed',
        message: {
          contentType: 'PlainText',
          content: 'Houve um erro ao processar sua solicitação.',
        },
      },
    };
  }
};
