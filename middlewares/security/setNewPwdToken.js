/**
 * Új jelszó kérése esetén kiküldjük az adott tokent az emailben, amivel beállíthat új jelszót, ha megadta az új jelszót, új tokent fogunk generálni.
 * @param {*} objectRepository
 * @returns
 */

export const setNewPwdToken = (objectRepository) => {
  return (req, res, next) => {
    return next();
  };
};
