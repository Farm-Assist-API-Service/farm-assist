export class EnumHelpers {
  static enumToPlainText(CurrencyOptions): string {
    return `Enums: ${Object.values(CurrencyOptions)}`.replace(/,/gi, ' | ');
  }
}
