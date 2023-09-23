export class EnumHelpers {
  static enumToPlainText(enumObj): string {
    return `Enums: ${Object.values(enumObj)}`.replace(/,/gi, ' | ');
  }
}
