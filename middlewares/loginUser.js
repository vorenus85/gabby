/**
 * email + jelszó párost ellenőrizzük, ha van ilyen user, létrehozzuk a sessiont
 *
 * @param {*} objectRepository
 * @returns
 */

export const loginUser = (objectRepository) => {
  const { userModel, SaveDB } = objectRepository;

  return (req, res, next) => {
    res.locals.errors = {};
    if (typeof req.body.email === 'undefined') {
      res.locals.errors.loginError = 'Missing email';
      return next();
    }

    if (typeof req.body.password === 'undefined') {
      res.locals.errors.loginError = 'Missing password';
      return next();
    }

    const user = userModel.findOne({
      email: req.body.email.trim().toLowerCase(),
      password: req.body.password,
    });

    if (!user) {
      res.locals.errors.loginError = 'Wrong email or password';
      return next();
    }

    req.session.userid = user.id;
    return req.session.save((err) => {
      if (err) {
        return next(err);
      }
      return next();
    });
  };
};
