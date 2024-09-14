const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { fromIni } = require('@aws-sdk/credential-providers');

const client = new DynamoDBClient({
  region: process.env.REGION,
  credentials: fromIni({ profile: process.env.PROFILE_NAME }),
});

module.exports.dynamodb = client;
