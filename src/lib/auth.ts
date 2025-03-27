import { User } from "@/types/user";

export function login(
  email: string,
  password: string,
  rememberMe: boolean
): void {
  const users = JSON.parse(localStorage.getItem("users") || "[]") as User[];

  const existingUser = users.find((u) => u.email === email);

  if (!existingUser) {
    users.push({ email, password });
    localStorage.setItem("users", JSON.stringify(users));

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("currentUser", JSON.stringify({ email }));
    return;
  }

  if (existingUser.password !== password) {
    throw new Error("Incorrect password");
  }

  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem("currentUser", JSON.stringify({ email }));
}

export function logout(): void {
  localStorage.removeItem("currentUser");
  sessionStorage.removeItem("currentUser");
}

export function getCurrentUser(): { email: string } | null {
  const currentUser =
    localStorage.getItem("currentUser") ||
    sessionStorage.getItem("currentUser");
  return currentUser ? JSON.parse(currentUser) : null;
}
