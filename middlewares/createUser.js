/**
 * email + username + jelszó párossal létrehozzuk a megfelelő validációk mentés az új
felhasználót.
- email - unique
- username - unique
- password, min 6 karakter, legalább egy nagy betű, legalább 1 szám

 * @param {*} objectRepository 
 * @returns 
 */

export const createUser = (objectRepository) => {
  const { userModel, uuidv4, saveDB } = objectRepository;
  const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z]).{6,}$/;
  const emailRegex =
    /^[\w-]+(\.[\w-]+)*@[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*(\.[a-zA-Z]{2,})$/;

  return (req, res, next) => {
    if (typeof req.body.email === 'undefined') {
      return res.status(400).json({ error: 'Missing email' });
    }

    if (typeof req.body.username === 'undefined') {
      return res.status(400).json({ error: 'Missing username' });
    }

    if (typeof req.body.password === 'undefined') {
      return res.status(400).json({ error: 'Missing password' });
    }

    if (typeof req.body.passwordAgain === 'undefined') {
      return res.status(400).json({ error: 'Missing passwordAgain' });
    }

    if (!passwordRegex.test(req.body.password)) {
      return res.status(400).json({
        error:
          'Password is at least 6 characters long, contain at least one number, and contain at least one letter',
      });
    }

    if (!emailRegex.test(req.body.email)) {
      return res.status(400).json({
        error: 'Email is invalid',
      });
    }

    if (req.body.password !== req.body.passwordAgain) {
      return res.status(400).json({
        error: 'Passwords must be equal',
      });
    }

    try {
      userModel.insert({
        id: uuidv4(),
        profileImage: Math.floor(Math.random() * 10) + 1, // in public/avatar folder have 10 random avatar image from avatar_1.png to avatar_10.png assign one randomly
        email: req.body.email,
        username: req.body.username,
        fullname: '',
        location: '',
        bio: '',
        newPwdSecret: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
        followedUsers: [],
      });
    } catch (error) {
      console.error(error);
    }

    return saveDB((error) => {
      if (error) {
        return next(error);
      }

      next();
    });
  };
};
