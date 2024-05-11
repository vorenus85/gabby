export function checkUsernameIsUsed(objectRepository) {
  const { username, user, userModel } = objectRepository;
  if (username !== user.username) {
    const newUsername = userModel.findOne({ username });
    return !!newUsername;
  }
  return false;
}
