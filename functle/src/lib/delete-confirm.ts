// user has to type their username to delete the account so it's not an accident
export function isDeleteConfirmed(typed: string, username: string | null) {
  if (!username) return typed.trim().toLowerCase() === "delete";
  return typed.trim() === username;
}
