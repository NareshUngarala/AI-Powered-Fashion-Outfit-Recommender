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
            // Use 127.0.0.1 as default to avoid IPv6 issues with localhost on Windows
            const backendUrl = process.env.PYTHON_BACKEND_URL || 'http://127.0.0.1:8000';
            console.log(`Attempting login to: ${backendUrl}/auth/login with email: ${credentials.email}`);
            
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
                console.error(`Auth failed: ${response.status} ${response.statusText} - ${errorText}`);
                return null;
            }

            const user = await response.json();
            
            // Map _id to id for NextAuth compatibility
            if (user && user._id && !user.id) {
                user.id = user._id;
            }
            
            // CRITICAL FIX: Remove Base64 image from user object before returning.
            // Storing large Base64 strings in the session/token (Cookies) causes header overflow
            // and results in "Failed to fetch" or 500 errors during sign-in.
            if (user.image && user.image.length > 1000) {
                user.image = null; 
            }

            return user;
        } catch (error: any) {
            console.error("Auth error:", error);
            // Throw specific error for connection issues so user knows to check backend
            if (error.message.includes('fetch failed') || (error.cause && error.cause.code === 'ECONNREFUSED')) {
                throw new Error("Connection failed: Backend server unreachable. Is it running on port 8000?");
            }
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
