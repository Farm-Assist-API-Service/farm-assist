export interface Services {
  [key: string]: any;
  notify: (payload: any) => Promise<void>;
}
