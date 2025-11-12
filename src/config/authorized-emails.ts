// IMPORTANT: Replace with the 2 actual authorized Gmail accounts.
// These are the only users who will be able to access the application.

export const AUTHORIZED_EMAILS = [
  'conta1@gmail.com',
  'conta2@gmail.com',
  'example.user@gmail.com' // For testing purposes
];

export const isEmailAuthorized = (email: string | null | undefined): boolean => {
  if (!email) {
    return false;
  }
  return AUTHORIZED_EMAILS.includes(email.toLowerCase());
};
