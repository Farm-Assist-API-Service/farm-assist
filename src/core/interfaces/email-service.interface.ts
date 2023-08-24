export enum EMailSource {
  FARM_ASSIST = 'Farm Assist',
}

export type MailSourceType = keyof typeof EMailSource;

export type SignUpArgs = {
  subject: string;
  src: string;
  source: string;
};

export type MailContentTypes = 'text/plain' | 'application/pdf' | 'image/gif';

export interface MailAttachment {
  encoding: 'base64';
  filename: string; // test.pdf
  content: string; // base64 value
  contentType: MailContentTypes;
}
