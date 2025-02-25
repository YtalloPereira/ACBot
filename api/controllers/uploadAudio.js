const { makeResponse } = require('../lib/response');
const { validateAudioName } = require('../lib/validation');
const { makeSignedUrl } = require('../lib/upload');

module.exports.handler = async (event) => {
  try {
    // Get filename in event
    const { filename } = JSON.parse(event.body);

    // Check if the file name is provided
    if (!filename) {
      return makeResponse(400, { message: 'File name is required' });
    }

    // Check if the filename is valid
    if (!validateAudioName(filename)) {
      return makeResponse(400, {
        message: 'Invalid file format. Only .mp3 is allowed',
      });
    }

    // Generate a signed URL for the client to upload the file
    const { objectKey, signedUrl } = await makeSignedUrl(filename, 'audios');

    return makeResponse(200, {
      filename: objectKey,
      url: signedUrl,
    });
  } catch (error) {
    return makeResponse(500, {
      message: 'Error generating signed URL',
      error: error.message,
    });
  }
};
