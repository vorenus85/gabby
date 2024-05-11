export function checkEmailIsUsed(objectRepository) {
  const { email, userModel } = objectRepository;
  const newEmail = userModel.findOne({ email });
  return !!newEmail;
}
