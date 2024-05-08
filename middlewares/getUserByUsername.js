export const getUserByUsername = (objectRepository) => {
  const { userModel, moment } = objectRepository;
  return (req, res, next) => {
    console.log(req.params.userName);
    const user = userModel.findOne({ username: req.params.userName });
    if (!user) {
      return res.redirect('/');
    }

    res.locals.user = user;
    res.locals.user.createdAtText = moment(new Date(user.createdAt)).fromNow(
      true
    );

    return next();
  };
};
