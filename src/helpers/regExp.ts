export const isAlpha = (value: string) => /[Aa-zZ]/.test(value);
export const isString = (value: any) => value.constructor === String;
export const isEmail = (value: string): boolean => /@/.test(value);
export const isPassword = (value: string) => {};