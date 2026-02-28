import { Role } from "./roles";

export interface User {
  id: string;
  email: string;
  role: Role;
  name: string;
}

// Mock function to get current user - replace with actual auth logic later
export async function getCurrentUser(): Promise<User | null> {
  // Simulate API call
  return {
    id: "1",
    email: "demo@example.com",
    role: "ADMIN", // Change this to test different roles
    name: "Demo User",
  };
}
