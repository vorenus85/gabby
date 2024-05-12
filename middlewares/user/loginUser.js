/**
 * email + jelszó párost ellenőrizzük, ha van ilyen user, létrehozzuk a sessiont
 *
 * @param {*} objectRepository
 * @returns
 */

export const loginUser = (objectRepository) => {
  const { userModel, moment } = objectRepository;

  return (req, res, next) => {
    if (typeof req.body.email === 'undefined') {
      res.locals.error = 'MISSING_EMAIL';
      console.error(res.locals.error);
      return next();
    }

    if (typeof req.body.password === 'undefined') {
      res.locals.error = 'MISSING_PASSWORD';
      console.error(res.locals.error);
      return next();
    }

    const user = userModel.findOne({
      email: req.body.email.trim().toLowerCase(),
      password: req.body.password,
    });

    if (!user) {
      res.locals.error = 'LOGIN_ERROR';
      console.error(res.locals.error);
      return next();
    }

    user.createdAtText = moment(user.createdAt).fromNow();

    req.session.userId = user.id;
    req.session.loggedInUser = user;
    return req.session.save((err) => {
      if (err) {
        return next(err);
      }

      return next();
    });
  };
};
