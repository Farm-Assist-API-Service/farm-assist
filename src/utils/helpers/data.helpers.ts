export class DataHelpers {
  static stringToBool(str: string): boolean {
    return JSON.parse(str);
  }
}