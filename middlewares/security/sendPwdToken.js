/**
 * Új jelszó kérése esetén, ha matchel az email kiküldjük az email címre az új token-t. Beállítjuk a pwdTokenDeadline mezőt currentTime + 3 órára
 * @param {*} objectRepository
 * @returns
 */

import { addHours, emailRegex } from '../utils.js';

export const sendPwdToken = (objectRepository) => {
  const { userModel, uuidv4, saveDB } = objectRepository;
  return (req, res, next) => {
    const { email } = req.body;

    if (!emailRegex.test(email)) {
      res.locals.error = 'INVALID_EMAIL';
      console.error(res.locals.error);
      return next();
    }

    const user = userModel.findOne({
      email: email.trim().toLowerCase(),
    });

    res.locals.message = 'RESET_PWD_EMAIL';

    // if user not found create fake token and leave middleware chain
    if (!user) {
      res.locals.pwdToken = uuidv4();
      return next();
    }

    if (user) {
      const { newPwdSecret } = user;

      const updatedAt = new Date();
      const updatedUser = {
        ...user,
        pwdTokenDeadline: addHours(new Date(), 3),
        updatedAt,
      };

      userModel.update(updatedUser);

      return saveDB((error) => {
        if (error) {
          return next(error);
        }
        res.locals.pwdToken = newPwdSecret;
        next();
      });
    }

    return next();
  };
};
