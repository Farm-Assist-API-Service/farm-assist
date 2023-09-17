export class StringHelpers {
  static generateSlug(name: string): string {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, ''); // remove leading/trailing hyphens

    return slug;
  }

  static capitalize(str: string): string {
    return `${str[0].toUpperCase()}${str.slice(1, str.length)}`;
  }
}
