import { authUser } from '../middlewares/authUser.js';
import { getPosts } from '../middlewares/getPosts.js';
import { search } from '../middlewares/search.js';
import { getPostsById } from '../middlewares/getPostsById.js';
import { getPostByUserId } from '../middlewares/getPostByUserId.js';
import { getUsersById } from '../middlewares/getUsersById.js';
import { doFollow } from '../middlewares/doFollow.js';
import { doNotFollow } from '../middlewares/doNotFollow.js';
import { getFollowingPosts } from '../middlewares/getFollowingPosts.js';
import { createPost } from '../middlewares/createPost.js';
import { deletePost } from '../middlewares/deletePost.js';
import { updatePost } from '../middlewares/updatePost.js';
import { deletePostImage } from '../middlewares/deletePostImage.js';
import { updateUser } from '../middlewares/updateUser.js';
import { updatePwd } from '../middlewares/updatePwd.js';
import { setNewPwdToken } from '../middlewares/setNewPwdToken.js';
import { getPwdToken } from '../middlewares/getPwdToken.js';
import { loginUser } from '../middlewares/loginUser.js';
import { createUser } from '../middlewares/createUser.js';

export function addRoutes(app) {
  const objectRepository = {};

  // Regisztrációs adatok form
  app.post('/register', createUser(objectRepository), (req, res, next) => {
    res.render('layout', { page: 'home' });
  });

  // Bejelentkezési adatok form
  app.post('/login', loginUser(objectRepository), (req, res, next) => {
    res.render('layout', { page: 'home' });
  });

  // GRPR screen
  app.get('/gdpr', (req, res, next) => {
    res.render('layout', { page: 'gdpr' });
  });

  // Új jelszó létrehozása form
  app.post(
    '/newPassword/:uniqueHash',
    updatePwd(objectRepository),
    setNewPwdToken(objectRepository),
    (req, res, next) => {
      res.render('layout', { page: 'createNewPassword' }); // param sikeres módosításhoz
    }
  );

  // Új jelszó létrehozása screen
  app.get(
    '/new-password/:uniqueHash',
    getPwdToken(objectRepository),
    (req, res, next) => {
      res.render('layout', { page: 'createNewPassword' });
    }
  );

  // lost password form
  app.post('/lostPassword', getPwdToken(objectRepository), (req, res, next) => {
    res.redirect('/lost-password'); // + param??
  });

  // lost password screen
  app.get('/lost-password', (req, res, next) => {
    res.render('layout', { page: 'lostPassword', isLoggedIn: true });
  });

  // Felhasználó jelszavának módosítása űrlap
  app.post(
    '/editUserPassword',
    authUser(objectRepository),
    updatePwd(objectRepository),
    setNewPwdToken(objectRepository),
    (req, res, next) => {
      res.render('layout', { page: 'profile', isLoggedIn: true }); // plusz param sikeres jelszómódosítás
    }
  );

  // Felhasználó adatainak módosítása űrlap
  app.post(
    '/editUser',
    authUser(objectRepository),
    updateUser(objectRepository),
    (req, res, next) => {
      res.render('layout', { page: 'profile', isLoggedIn: true }); // plusz param sikeres adatmódosítás
    }
  );

  // Felhasználó beállításai oldal.
  app.get('/editUser', authUser(objectRepository), (req, res, next) => {
    res.render('layout', { page: 'profile', isLoggedIn: true });
  });

  // Felhasználó profil oldala
  app.get(
    '/user/:userName',
    authUser(objectRepository),
    getPostByUserId(objectRepository),
    getUsersById(objectRepository),
    (req, res, next) => {
      res.render('layout', { page: 'user', isLoggedIn: true });
    }
  );

  // Post létrehozása modal
  app.post(
    '/posts/create',
    authUser(objectRepository),
    createPost(objectRepository),
    (req, res, next) => {
      res.render('layout', { page: 'home', isLoggedIn: true });
    }
  );

  // Posthoz tartozó kép törlése
  app.post(
    '/posts/deleteImage/:id',
    authUser(objectRepository),
    getPostsById(objectRepository),
    deletePostImage(objectRepository),
    (req, res, next) => {
      // hova redirekteljen??
      res.render('layout', { page: 'home', isLoggedIn: true });
    }
  );

  // post szerkesztése űrlap
  app.post(
    '/posts/update/:id',
    authUser(objectRepository),
    getPostsById(objectRepository),
    updatePost(objectRepository),
    (req, res, next) => {
      res.redirect('/posts/get/:id'); // + param sikeres szerkesztés
    }
  );

  // post szerkesztése oldal
  app.get(
    '/posts/get/:id',
    authUser(objectRepository),
    getPostsById(objectRepository),
    (req, res, next) => {
      res.render('layout', { page: 'editPost', isLoggedIn: true });
    }
  );

  // post törlése
  app.post(
    '/posts/delete/:id',
    authUser(objectRepository),
    getPostsById(objectRepository),
    deletePost(objectRepository),
    (req, res, next) => {
      res.render('layout', { page: 'home', isLoggedIn: true });
    }
  );

  // Bekövetett felhasználók listája
  app.get(
    '/following/:username',
    authUser(objectRepository),
    getFollowingPosts(objectRepository),
    (req, res, next) => {
      res.render('layout', { page: 'following', isLoggedIn: true });
    }
  );

  // felhasználó kikövetése
  app.post(
    '/unfollow/:followId',
    authUser(objectRepository),
    doNotFollow(objectRepository),
    (req, res, next) => {
      res.render('layout', { page: 'home', isLoggedIn: true });
    }
  );

  // felhasználó követése
  app.post(
    '/follow/:followId',
    authUser(objectRepository),
    doFollow(objectRepository),
    (req, res, next) => {
      res.render('layout', { page: 'home', isLoggedIn: true });
    }
  );

  // search form
  app.get('/searchForm', (req, res, next) => {
    const searchParam = req.searchParam;
    res.redirect(`/search/?searchParam=${searchParam}`);
  });

  // search page
  app.get(
    '/search',
    search(objectRepository),
    getPostsById(objectRepository),
    getUsersById(objectRepository),
    (req, res, next) => {
      res.render('layout', { page: 'search' });
    }
  );

  // homepage
  app.get(
    '/',
    authUser(objectRepository),
    getPosts(objectRepository),
    (req, res, next) => {
      res.render('layout', { page: 'home', isLoggedIn: true });
    }
  );
}
