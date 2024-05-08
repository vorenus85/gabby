import { v4 as uuidv4 } from 'uuid';
import { authUser } from '../middlewares/authUser.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { getPosts } from '../middlewares/getPosts.js';
import { search } from '../middlewares/search.js';
import { getPostsById } from '../middlewares/getPostsById.js';
import { getPostByUserId } from '../middlewares/getPostByUserId.js';
import { getUsersById } from '../middlewares/getUsersById.js';
import { getLoggedInUser } from '../middlewares/getLoggedInUser.js';
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
import { logoutUser } from '../middlewares/logoutUser.js';
import { createUser } from '../middlewares/createUser.js';

import moment from 'moment';

export function addRoutes(app, { postModel, userModel, saveDB }) {
  const objectRepository = {
    postModel,
    userModel,
    uuidv4,
    saveDB,
    db: {
      posts: [
        {
          id: '1',
          createdBy: '1',
          creatorUsername: 'johndoe',
          creatorImage: '3',
          content: 'Lorem ispum dolor sit amet',
          createdAt: moment(new Date('2024-05-02 10:10:20')).fromNow(true),
        },
        {
          id: '2',
          createdBy: '3',
          creatorImage: '2',
          creatorUsername: 'barbara85',
          content:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui dicta minus molestiae vel beatae natus eveniet ratione.',
          createdAt: moment(new Date('2024-05-03 06:15:20')).fromNow(true),
        },
        {
          id: '3',
          createdBy: '1',
          creatorImage: '3',
          creatorUsername: 'johndoe',
          content:
            'Qui dicta minus molestiae vel beatae natus eveniet ratione.',
          createdAt: moment(new Date('2024-05-02 12:20:20')).fromNow(true),
        },
        {
          id: '4',
          createdBy: '3',
          creatorImage: '2',
          creatorUsername: 'barbara85',
          content:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui dicta minus molestiae vel beatae natus eveniet ratione.',
          createdAt: moment(new Date('2024-05-03 06:15:20')).fromNow(true),
        },
      ],
    },
    userData: {
      id: 'asdasd-asdasdasd-asdasd',
      profileImage: '2',
      email: 'john@doe.com',
      username: '@johndoe',
      fullname: 'John Doe',
      location: 'Budapest',
      bio: 'This is my one line bio',
      newPwdSecret: 'asdas-das-da-sd-as-d-asd-asd',
      createdAt: moment(new Date('2024-05-1 01:00:00')).format('YYYY MMM Do'),
      updatedAt: new Date('2024-05-1 01:00:00'),
      followedUsers: [],
    },
    userPosts: [
      {
        id: '1',
        createdBy: '1',
        creatorUsername: 'johndoe',
        creatorImage: '3',
        content: 'Lorem ispum dolor sit amet',
        createdAt: moment(new Date('2024-05-02 10:10:20')).fromNow(true),
      },
      {
        id: '3',
        createdBy: '1',
        creatorImage: '3',
        creatorUsername: 'johndoe',
        content: 'Qui dicta minus molestiae vel beatae natus eveniet ratione.',
        createdAt: moment(new Date('2024-05-02 12:20:20')).fromNow(true),
      },
    ],
  };

  app.all('*', isLoggedIn());

  // Regisztrációs adatok form
  app.post('/register', createUser(objectRepository), (req, res, next) => {
    res.render('layout', {
      page: 'home',
      isLoggedIn: false,
      posts: objectRepository.db.posts,
    });
  });

  // Kijelentkezés
  app.post('/logout', logoutUser(objectRepository));

  // Bejelentkezési adatok form
  app.post('/login', loginUser(objectRepository), (req, res, next) => {
    res.redirect('/');
  });

  // GRPR screen
  app.get('/gdpr', (req, res, next) => {
    res.render('layout', {
      page: 'gdpr',
      isLoggedIn: res.locals?.isLoggedIn,
      error: res.locals.error,
    });
  });

  // Új jelszó létrehozása form
  app.post(
    '/new-password/:uniqueHash',
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
      res.render('layout', { page: 'createNewPassword', isLoggedIn: false });
    }
  );

  // lost password form
  app.post('/lostPassword', getPwdToken(objectRepository), (req, res, next) => {
    res.redirect('/lost-password'); // + param??
  });

  // lost password screen
  app.get('/lost-password', (req, res, next) => {
    res.render('layout', {
      page: 'lostPassword',
      isLoggedIn: res.locals?.isLoggedIn,
      errors: res.locals?.errors,
    });
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
  app.get('/profile', authUser(objectRepository), (req, res, next) => {
    res.render('layout', {
      page: 'profile',
      isLoggedIn: res.locals?.isLoggedIn,
    });
  });

  // Felhasználó oldala
  app.get(
    '/user/:userName',
    authUser(objectRepository),
    getPostByUserId(objectRepository),
    getUsersById(objectRepository),
    (req, res, next) => {
      res.render('layout', {
        page: 'user',
        isLoggedIn: res.locals?.isLoggedIn,
        userData: objectRepository.userData,
        userPosts: objectRepository.userPosts,
      });
    }
  );

  // Bejelentkezett felhasználó oldala
  app.get(
    '/me',
    authUser(objectRepository),
    getLoggedInUser(objectRepository),
    getPostByUserId(objectRepository),
    getUsersById(objectRepository),
    (req, res, next) => {
      console.log(res.locals);

      res.render('layout', {
        page: 'user',
        isLoggedIn: res.locals?.isLoggedIn,
        user: res.locals?.user,
        userPosts: objectRepository.userPosts,
        errors: res.locals?.errors,
      });
    }
  );

  // Post létrehozása modal
  app.post(
    '/post/create',
    authUser(objectRepository),
    createPost(objectRepository),
    (req, res, next) => {
      res.redirect('/');
    }
  );

  // Posthoz tartozó kép törlése
  app.post(
    '/post/deleteImage/:id',
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
    '/post/update/:id',
    authUser(objectRepository),
    getPostsById(objectRepository),
    updatePost(objectRepository),
    (req, res, next) => {
      res.redirect('/posts/get/:id'); // + param sikeres szerkesztés
    }
  );

  // post szerkesztése oldal
  app.get(
    '/post/:id',
    authUser(objectRepository),
    getPostsById(objectRepository),
    (req, res, next) => {
      res.render('layout', { page: 'editPost', isLoggedIn: true });
    }
  );

  // post törlése
  app.post(
    '/post/delete/:id',
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
      res.render('layout', { page: 'search', isLoggedIn: true });
    }
  );

  // homepage
  app.get('/', getPosts(objectRepository), (req, res, next) => {
    res.render('layout', {
      page: 'home',
      isLoggedIn: res.locals?.isLoggedIn,
      posts: objectRepository.db.posts,
      errors: res.locals.errors,
    });
  });
}
