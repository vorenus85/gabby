/**
 * Új jelszó kérése esetén itt mentjük el az új jelszót hashelve.
 * @param {*} objectRepository
 * @returns
 */

import bcrypt from 'bcryptjs';
import { passwordRegex } from '../utils.js';

export const updatePwd = (objectRepository) => {
  const { userModel, saveDB } = objectRepository;
  return (req, res, next) => {
    const { password, newPassword, newPasswordAgain } = req.body;

    const user = userModel.findOne({
      email: req.session.loggedInUser.email.trim().toLowerCase(),
      // password,
    });

    // Load hash from your password DB.

    console.log(password);
    console.log(user.password);

    bcrypt.compare(password, user.password, function (err, result) {
      if (!result) {
        res.locals.error = 'WRONG_PASSWORD';
        console.error(res.locals.error);
        return next();
      }
    });

    if (!passwordRegex.test(newPassword)) {
      res.locals.error = 'PASSWORD_REGEX';
      console.error(res.locals.error);
      return next();
    }

    if (newPassword !== newPasswordAgain) {
      res.locals.error = 'PASSWORD_NOT_EQUAL';
      console.error(res.locals.error);
      return next();
    }

    console.log('eljut idáig');
    const pwdHash = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
    console.log(pwdHash);
    const updatedAt = new Date();
    const updatedUser = {
      ...user,
      password: pwdHash,
      updatedAt,
    };

    userModel.update(updatedUser);

    return saveDB((error) => {
      if (error) {
        return next(error);
      }
      req.session.loggedInUser = updatedUser;
      res.locals.message = 'USER_PASSWORD_SUCCESSFULLY_UPDATED';
      next();
    });
  };
};
