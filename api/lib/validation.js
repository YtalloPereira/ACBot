module.exports.validateImageName = (filename) => {
  // Regex to validate filename
  const regex = /^[a-zA-Z0-9-_]+\.(jpg|jpeg|png)$/;
  return regex.test(filename);
}
