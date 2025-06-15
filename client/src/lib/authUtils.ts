export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message);
}

export function getAdminToken(): string | null {
  return localStorage.getItem("adminToken");
}

export function setAdminToken(token: string): void {
  localStorage.setItem("adminToken", token);
}

export function removeAdminToken(): void {
  localStorage.removeItem("adminToken");
}

export function redirectToAdminLogin(): void {
  window.location.href = "/admin/login";
}