export const getUserByUsername = (objectRepository) => {
  const { userModel, moment } = objectRepository;
  return (req, res, next) => {
    const user = userModel.findOne({ username: req.params.userName });
    if (!user) {
      console.error('User missing during getUserByUsername');
      return res.redirect('/');
    }

    res.locals.user = user;
    res.locals.user.createdAtText = moment(new Date(user.createdAt)).fromNow(
      true
    );

    return next();
  };
};
