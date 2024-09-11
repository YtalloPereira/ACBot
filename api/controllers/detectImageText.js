const { RekognitionClient, DetectTextCommand } = require('@aws-sdk/client-rekognition');

const rekognition = new RekognitionClient();

module.exports.handler = async (event) => {
  try {
    const { filename } = JSON.parse(event.body);

    // Check if the file name is provided
    if (!filename) {
      return makeResponse(400, { message: 'File name is required' });
    }

    // Check if the file name is provided
    if (!validateFilename(filename)) {
      return makeResponse(400, {
        message: 'Invalid file format. Only .png, .jpg, and .jpeg are allowed',
      });
    }

    // Create a DetectTextCommand
    const command = new DetectTextCommand({
      Image: {
        S3Object: {
          Bucket: `${process.env.RESOURCE_PREFIX}-bt`,
          Name: filename,
        },
      },
    });

    // Detect text in the image
    const detectText = await rekognition.send(command);

    return makeResponse(200, { text: detectText });
  } catch (error) {
    return makeResponse(500, {
      message: 'Error detecting text in the image',
      error: error.message,
    });
  }
};
