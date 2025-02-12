import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Logger utility
const logger = {
  auth: (message: string, data?: any) => {
    console.log(`[Auth] ${message}`, data ? data : "");
  },
  error: (message: string, error?: any) => {
    console.error(`[Auth Error] ${message}`, error ? error : "");
  },
};

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        logger.auth("Attempting authorization");

        if (!credentials) {
          logger.error("No credentials provided");
          return null;
        }

        const { email, password } = credentials;
        logger.auth("Checking credentials for email", email);

        try {
          const userEmail = process.env.ADMIN_EMAIL;
          const userPassword = process.env.ADMIN_PASSWORD;

          if (email === userEmail && password === userPassword) {
            logger.auth("Admin authenticated successfully", { email });

            return {
              id: "1", // Add a static or dynamic ID to prevent errors
              email: userEmail,
              name: "Administrator",
            };
          } else {
            logger.error("Invalid credentials", { email });
            return null;
          }
        } catch (error) {
          logger.error("Authorization error", error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt" as const,
    maxAge: 24 * 60 * 60, // 24 hours
  },

  callbacks: {
    async signIn({ user, account }: { user: any; account: any }) {
      logger.auth("Sign in attempt", {
        userId: user.id,
        provider: account?.provider,
      });
      return true;
    },

    async jwt({ token, user }: { token: any; user?: any }) {
      logger.auth("Processing JWT", {
        tokenUserId: token.id,
        newUserId: user?.id,
      });

      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        logger.auth("JWT updated with user data", {
          userId: user.id,
          email: user.email,
        });
      }
      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      logger.auth("Creating session", {
        tokenId: token.id,
        sessionUser: session?.user?.email,
      });

      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          name: token.name,
        };
        logger.auth("Session created with user data", {
          userId: token.id,
          email: token.email,
        });
      }
      return session;
    },
  },

  // ... existing code ...

  events: {
    async signIn(message: { user: any; account: any }) {
      logger.auth("User signed in", {
        userId: message.user.id,
        provider: message.account?.provider,
      });
    },
    async signOut(message: { session: any; token: any }) {
      logger.auth("User signed out", {
        userId: message.token?.id,
      });
    },
    async error(message: { error: Error }) {
      logger.error("Authentication error occurred", message.error);
    },
  },

  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
};
console.log("Auth Options:", authOptions);

// NextAuth request handler
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
