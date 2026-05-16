import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // By using an empty string, Better Auth automatically uses the current relative path
  baseURL: "", 
});

export const { signIn, signUp, signOut, useSession } = authClient;