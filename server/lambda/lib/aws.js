const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
const { RekognitionClient } = require('@aws-sdk/client-rekognition');
const { BedrockRuntimeClient } = require('@aws-sdk/client-bedrock-runtime');
const { PollyClient } = require('@aws-sdk/client-polly');
const { S3Client } = require('@aws-sdk/client-s3');
const { fromIni } = require('@aws-sdk/credential-providers');

// Define o nome do profile para carregar as credenciais ou usa undefined
const profile = process.env.PROFILE_NAME ?? undefined;

// Cria instâncias dos serviços para acessar os serviços da AWS

const dynamodb = new DynamoDBClient({
  credentials: fromIni({ profile }),
});

const dynamoDBDocClient = DynamoDBDocumentClient.from(dynamodb);

const rekognition = new RekognitionClient({
  credentials: fromIni({ profile }),
});

const bedrock = new BedrockRuntimeClient({
  credentials: fromIni({ profile }),
});

const polly = new PollyClient({
  credentials: fromIni({ profile }),
});

const s3 = new S3Client({
  credentials: fromIni({ profile }),
});

// Exporta os serviços para serem utilizados em outros módulos
module.exports = {
  dynamodb,
  dynamoDBDocClient,
  rekognition,
  bedrock,
  polly,
  s3,
};
