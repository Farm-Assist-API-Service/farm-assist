export const isAlpha = (value: string) => /[Aa-zZ]/.test(value);
export const isString = (value: any) => value.constructor === String;
export const isEmail = (emailAdress: string): boolean => {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailAdress.match(regex) ? true : false;
} 
export const isPassword = (value: string) => {};