// HTTP method color mapping for admin permission tags
export const HTTP_METHOD_COLORS = {
  GET: 'blue',
  POST: 'green',
  PUT: 'orange',
  DELETE: 'red',
  default: 'default',
};

export function getMethodColor(method) {
  return HTTP_METHOD_COLORS[method?.toUpperCase()] || HTTP_METHOD_COLORS.default;
} 