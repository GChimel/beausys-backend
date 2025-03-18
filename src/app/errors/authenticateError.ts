export class AuthenticationError extends Error {
  constructor() {
    super("Invalid credentials");
  }
}
