/**
 * Email alapján kinyerjük a tokent a jelszó megújításához.
 */

export const getPwdToken = (objectRepository) => {
  const { userModel } = objectRepository;

  return (req, res, next) => {
    const pwdToken = req.params?.pwdToken;
    res.locals.cryptedEmail = '';

    if (pwdToken === 'undefined') {
      res.locals.error = 'MISSING_PWD_TOKEN';
      console.error(res.locals.error);
      return next();
    }

    const user = userModel.findOne({ newPwdSecret: pwdToken });

    if (!user) {
      res.locals.error = 'USER_NOT_FOUND';
      console.error(res.locals.error);
      return next();
    }

    const now = new Date();
    if (new Date(user.pwdTokenDeadline).getTime() < now.getTime()) {
      res.locals.error = 'PWD_TOKEN_EXPIRED';
      console.error(res.locals.error);
      return next();
    }

    const splittedEmail = user.email.split('');
    res.locals.cryptedEmail = splittedEmail[0] + '****@****.***';

    return next();
  };
};
