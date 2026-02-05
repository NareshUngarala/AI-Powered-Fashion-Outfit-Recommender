import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        try {
            const backendUrl = process.env.PYTHON_BACKEND_URL || 'http://localhost:8000';
            console.log(`[NextAuth] Attempting login at: ${backendUrl}/auth/login`);
            const response = await fetch(`${backendUrl}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: credentials.email,
                    password: credentials.password,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`[NextAuth] Login failed: ${response.status} ${response.statusText} - ${errorText}`);
                return null;
            }

            const user = await response.json();
            
            // Map _id to id for NextAuth compatibility
            if (user && user._id && !user.id) {
                user.id = user._id;
            }
            
            return user;
        } catch (error) {
            console.error("Auth error:", error);
            return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        // @ts-expect-error: session.user type is extended dynamically
        session.user.id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        // @ts-expect-error: user type from backend includes _id
        token.id = user.id || user._id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET || "development_secret_key_change_in_production",
};
