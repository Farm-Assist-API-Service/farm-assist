const getURLParams = (params: any): string =>
  Object.keys(params || {}).reduce((result, field) => {
    if (
      (typeof params[field] === 'string' && params[field]) ||
      typeof params[field] !== 'string'
    ) {
      result += result
        ? `&${field}=${params[field]}`
        : `?${field}=${params[field]}`;
    }
    return result;
  }, '');

export default getURLParams;
