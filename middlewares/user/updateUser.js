/**
 * A felhasználó általános adatainak módosítása, jelszó kivételével.
 *
 * @param {*} objectRepository
 * @returns
 */

export const updateUser = (objectRepository) => {
  const { userModel, saveDB } = objectRepository;
  return (req, res, next) => {
    const user = req.session.loggedInUser;
    const { fullname, username, email, bio, location } = req.body;
    const updatedAt = new Date();

    // check username collision
    if (username !== user.username) {
      const newUsername = userModel.findOne({ username });
      if (newUsername) {
        res.locals.errors.updateUser = `${username} has been already taken, please choose another username`;
        return next();
      }
    }

    // check email collision
    if (email !== user.email) {
      const newUserEmail = userModel.findOne({ username });
      if (newUserEmail) {
        res.locals.errors.updateUser = `${email} has been already taken, please choose another email`;
        return next();
      }
    }

    const updatedUser = {
      ...user,
      fullname,
      username,
      email,
      bio,
      location,
      updatedAt,
    };

    userModel.update(updatedUser);

    return saveDB((error) => {
      if (error) {
        return next(error);
      }
      req.session.loggedInUser = updatedUser;
      res.locals.messages.successUpdateUser = 'User data successfully updated';
      next();
    });
  };
};
