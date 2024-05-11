export function checkEmailIsUsed(objectRepository) {
  const { email, user, userModel } = objectRepository;
  if (email !== user.email) {
    const newEmail = userModel.findOne({ email });
    return !!newEmail;
  }
  return false;
}
