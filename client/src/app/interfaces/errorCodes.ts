export const APIErrorCode = {
  'No token provided.': 'No token provided.',
  'Invalid password': 'Invalid password',
  'No query provided.': 'No query provided.',
  'No password provided': 'No password provided',
  'Invalid verification token.': 'Invalid verification token.',
  'Internal server error': 'Internal server error',
  'An error occured while processing the request.':
    'An error occured while processing the request.',
  'It seems that you want to perform a query other than SELECT, which I cannot execute.':
    'It seems that you want to perform a query other than SELECT, which I cannot execute.',
  'Database error. Failed to execute the SQL query.':
    'Database error. Failed to execute the SQL query.',
} as const;
export type APIErrorCode = (typeof APIErrorCode)[keyof typeof APIErrorCode];

export type APIErrorCodeMapping = {
  [key in APIErrorCode]: { message: string; action?: () => void };
};
