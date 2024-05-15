import fs from 'fs';
/**
 * Töröl egy posthoz tartozó képet, képet fizikailag, illetve kinulláza a mezőt a db-ben.
 * @param {*} objectRepository
 * @returns
 */

const __dirname = './uploads';

export const deletePostImage = (objectRepository) => {
  const { postModel, saveDB } = objectRepository;
  return (req, res, next) => {
    const post = res.locals.post;

    // Get the files in current directory
    // before deletion
    getFilesInDirectory();

    // Function to get current filenames
    // in directory with specific extension
    function getFilesInDirectory() {
      console.log('\nFiles present in directory:');
      let files = fs.readdirSync(__dirname);
      files.forEach((file) => {
        console.log(file);
      });
    }

    fs.unlink(`${__dirname}/${post.image}`, (err) => {
      if (err) {
        // Handle specific error if any
        if (err.code === 'ENOENT') {
          console.error('File does not exist.');
        }
        throw err;
      } else {
        post.updatedAt = new Date();
        post.image = '';

        postModel.update(post);

        return saveDB((error) => {
          if (error) {
            return next(error);
          }

          res.locals.post = post;
          return next();
        });
      }
    });
  };
};
