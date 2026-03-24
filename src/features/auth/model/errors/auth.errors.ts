export class AuthInvalidResponseError extends Error {
  constructor(message = 'Invalid auth response from server.') {
    super(message);
    this.name = 'AuthInvalidResponseError';
  }
}

export class AuthNotAuthenticatedError extends Error {
  constructor(message = 'User is not authenticated.') {
    super(message);
    this.name = 'AuthNotAuthenticatedError';
  }
}
