import loki from 'lokijs';
const db = new loki('database.db');

/*
 * users collection
 *
 * ID: UUID
 * profileImage: string - random avatar képek, legenerálunk vagy 20db-ot egy statikus könyvtárba és random módon kap egyet a felhasználó, regisztrációkor: https://nice-avatar.dapi.to/
 * password: string
 * email: string
 * username: string
 * fullname: string
 * location: string
 * bio: string
 * newPwdSecret: UUID - elfelejetett jelszóhoz UUID, jelszó változtatás esetén változik, illetve kiküldjük új jelszó kérésnél
 * pwdTokenDeadline: - date - jelszó kérésnél itt állítjuk be az időt currentTime + óra, eddig állíthatja be az új jelszót a kérvényező
 * createdAt: date
 * updatedAt: date
 * followedUsers: array - azon felhasználók listája akit követ a felhasználó
 */

/**
 * posts collection
 *
 * ID: UUID
 * createdBy: UUID - felhasználó ID-je aki létrehozta a postot
 * creatorUsername: string - felhasználó username-e aki létrehozta (azért tárolom itt is, hogy ne kelljen querizni a usertáblát)
 * creatorImage: string felhasználó profilképe aki létrehozta (azért tárolom itt is, hogy ne kelljen querizni a usertáblát)
 * content:string -  Post szöveges leírása
 * image: string - V2-es feature
 * createdAt: date
 * updatedAt: date
 */

export function initDatabase(callback) {
  console.log('Init database');
  db.loadDatabase({}, (error) => {
    if (error) {
      return callback(error);
    }

    let postModel = db.getCollection('posts');

    if (postModel === null) {
      postModel = db.addCollection('posts', {
        indices: ['id'],
      });
    }

    let userModel = db.getCollection('users');

    if (userModel === null) {
      userModel = db.addCollection('users', {
        indices: ['id', 'email'],
        unique: ['email', 'username'],
      });
    }

    db.saveDatabase((error) => {
      if (error) {
        return callback(error);
      }
      console.log('DB saved after init.');

      // dump all rows for development
      /*
      console.log('Users');
      console.table(userModel.find());
      console.log('Posts');
      console.table(postModel.find());
      */
      return callback(undefined, {
        postModel,
        userModel,
        saveDB: (callback) => {
          console.log('Saving DB...');
          db.saveDatabase(callback);
        },
      });
    });
  });
}
