export function checkUsernameIsUsed(objectRepository) {
  const { username, userModel } = objectRepository;
  const newUsername = userModel.findOne({ username });
  return !!newUsername;
}
