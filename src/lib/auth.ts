interface User {
  email: string;
  password: string;
}

// Register & Auto-login
export function register(email: string, password: string): void {
  const users = JSON.parse(localStorage.getItem("users") || "[]") as User[];

  if (users.some((u) => u.email === email)) {
    throw new Error("User already exists");
  }

  users.push({ email, password });
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify({ email })); // Auto-login
}

// Get Current User
export function getCurrentUser(): { email: string } | null {
  const currentUser = localStorage.getItem("currentUser");
  return currentUser ? JSON.parse(currentUser) : null;
}
