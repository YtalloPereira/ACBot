module.exports.validateImageName = (filename) => {
  // Regex to validate filename
  const regex = /^.*\.(jpg|jpeg|png)$/;
  return regex.test(filename);
};

module.exports.validateAudioName = (filename) => {
  // Regex to validate filename
  const regex = /^.*\.(mp3)$/;
  return regex.test(filename);
};
