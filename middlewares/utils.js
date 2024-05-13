export const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z]).{6,}$/;
export const emailRegex =
  /^[\w-]+(\.[\w-]+)*@[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*(\.[a-zA-Z]{2,})$/;
export const addHours = (date, hours) => {
  const dateCopy = new Date(date.getTime());
  const hoursToAdd = hours * 60 * 60 * 1000;
  dateCopy.setTime(date.getTime() + hoursToAdd);
  return dateCopy;
};
