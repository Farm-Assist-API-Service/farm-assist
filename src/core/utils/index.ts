export const isEmail = (emailAdress: string) => {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailAdress.match(regex) ? true : false;
};
