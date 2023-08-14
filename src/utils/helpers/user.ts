import { env } from 'src/config/config.env';

export type GetContactID = { email: string } | { phone: string };

export class UserHelpers {
  static get ContactInformation() {
    return ContactInformation;
  }
}

export default class ContactInformation {
  static mobileNumberRegExp =
    /^\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;

  static emailRegExp = /^[\w\.-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z]+)*$/;

  public static isEmail(email: string): boolean {
    return ContactInformation.emailRegExp.test(email);
  }

  public static isMobileNumber(mobile: string, useValidtor?: false): boolean {
    // TODO: Use a validator
    if (useValidtor) {
    }
    return ContactInformation.mobileNumberRegExp.test(mobile);
  }

  public static getContactId(id: string): GetContactID {
    if (this.isEmail(id)) return { email: id };
    else if (this.isMobileNumber(id)) return { phone: id };
    else {
      throw new Error(
        'Sorry, the entry you provided is not valid. Please ensure that you enter a correct email address or a valid mobile number.',
      );
    }
  }

  public getEmailAlias(email: string): string {
    return `${email.split('@')[0]}@${env.APP_EMAIL.split('@')[1]}`;
  }

  // identifier = this.getContactID(signUpInput.email || signUpInput.phone);

  // ContactKey = Object.keys(identifier)[0];
  // ContactValue = Object.values(identifier)[0];
}
