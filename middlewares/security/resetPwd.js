/**
 * Jelszó visszaállítás esetén itt mentjuk el az új jelszót.
 * @param {*} objectRepository
 * @returns
 */
import bcrypt from 'bcryptjs';
import { passwordRegex } from '../utils.js';

export const resetPwd = (objectRepository) => {
  const { userModel, uuidv4, saveDB } = objectRepository;

  return (req, res, next) => {
    const pwdToken = req.body?.pwdToken;
    res.locals.pwdToken = pwdToken;

    if (pwdToken === 'undefined') {
      res.locals.error = 'MISSING_PWD_TOKEN';
      console.error(res.locals.error);
      return next();
    }

    if (typeof req.body.password === 'undefined') {
      res.locals.error = 'MISSING_PASSWORD';
      console.error(res.locals.error);
      return next();
    }

    if (typeof req.body.passwordAgain === 'undefined') {
      res.locals.error = 'MISSING_PASSWORD_AGAIN';
      console.error(res.locals.error);
      return next();
    }

    if (!passwordRegex.test(req.body.password)) {
      res.locals.error = 'PASSWORD_REGEX';
      console.error(res.locals.error);
      return next();
    }

    if (req.body.password !== req.body.passwordAgain) {
      res.locals.error = 'PASSWORD_NOT_EQUAL';
      console.error(res.locals.error);
      return next();
    }
    const user = userModel.findOne({ newPwdSecret: pwdToken });
    const pwdHash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    const updatedAt = new Date();
    const updatedUser = {
      ...user,
      password: pwdHash,
      newPwdSecret: uuidv4(),
      updatedAt,
    };

    userModel.update(updatedUser);

    return saveDB((error) => {
      if (error) {
        return next(error);
      }
      next();
    });
  };
};
