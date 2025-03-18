export const validatePayload = (payload) => {
  if (typeof payload === 'object') {
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const key in payload) {
      if (typeof payload[key] === 'string') {
        // eslint-disable-next-line no-param-reassign
        payload[key] = payload[key]?.trim();
      }
      if (!payload[key]) {
        // eslint-disable-next-line no-param-reassign
        delete payload[key];
      }
    }
  }
  return payload;
};
