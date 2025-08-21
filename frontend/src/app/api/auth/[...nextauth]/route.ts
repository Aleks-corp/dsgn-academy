import { GetUser } from "@/types/users.type";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";

type BackendDataCarrier = { backendData: GetUser };

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      try {
        const res = await fetch(
          process.env.NEXT_PUBLIC_API_URL + "/auth/oauth-upsert",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              avatar: user.image,
              provider: account?.provider,
              providerId: account?.providerAccountId,
            }),
          }
        );
        if (!res.ok) return false;

        const backendData: GetUser = await res.json();
        (user as unknown as BackendDataCarrier).backendData = backendData;
        return true;
      } catch {
        return false;
      }
    },
    async jwt({ token, user, account }) {
      // під час першого signIn `user` присутній
      if (user && "backendData" in (user as object)) {
        const carrier = user as unknown as BackendDataCarrier;
        token.backendData = carrier.backendData;
      }
      if (account) {
        token.provider = account.provider;
        token.providerId = account.providerAccountId;
      }
      return token;
    },

    async session({ session, token }) {
      if (token.backendData) {
        session.backendData = token.backendData;
      }
      if (token.provider) session.user.provider = token.provider as string;
      if (token.providerId)
        session.user.providerId = token.providerId as string;
      return session;
    },
  },
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
