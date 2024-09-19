const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
const { RekognitionClient } = require('@aws-sdk/client-rekognition');
const { BedrockRuntimeClient } = require('@aws-sdk/client-bedrock-runtime');
const { PollyClient } = require('@aws-sdk/client-polly');
const { fromIni } = require('@aws-sdk/credential-providers');

const profile = process.env.PROFILE_NAME ?? undefined;

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

module.exports = {
  dynamodb,
  dynamoDBDocClient,
  rekognition,
  bedrock,
  polly,
};
