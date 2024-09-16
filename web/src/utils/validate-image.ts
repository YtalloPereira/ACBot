export const validateImage = async (file: File) => {
  const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png'];

  if (!allowedTypes.includes(file.type)) {
    return true;
  }

  return false;
};
