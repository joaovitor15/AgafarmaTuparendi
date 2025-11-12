// IMPORTANT: Replace with the 2 actual authorized Gmail accounts.
// These are the only users who will be able to access the application.

export const AUTHORIZED_EMAILS = [
  'agafarmatuparendi438@gmai.com',
  'agafarmatuparendipdvs@gmail.com',
  'joaovitormachry@gmail.com'
];

export const isEmailAuthorized = (email: string | null | undefined): boolean => {
  if (!email) {
    return false;
  }
  return AUTHORIZED_EMAILS.includes(email.toLowerCase());
};
