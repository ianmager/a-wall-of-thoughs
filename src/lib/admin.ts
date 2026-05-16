type UserLike = {
  email?: string | null;
} | null;

export function isAdminUser(user: UserLike): boolean {
  const configured = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!configured || !user?.email) {
    return false;
  }
  return user.email.trim().toLowerCase() === configured;
}
