import { GetUser } from "@/types/users.type";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { OAuthConfig } from "next-auth/providers/oauth";

type BackendDataCarrier = { backendData: GetUser };
const LinkedInOIDC: OAuthConfig<{
  id: string;
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  email: string;
  picture: string;
}> = {
  id: "linkedin",
  name: "LinkedIn",
  type: "oauth",
  wellKnown: "https://www.linkedin.com/oauth/.well-known/openid-configuration",
  authorization: { params: { scope: "openid profile email" } },
  idToken: false,
  checks: ["pkce", "state", "nonce"],
  client: { token_endpoint_auth_method: "client_secret_post" },

  token: {
    async request(context) {
      const { params, provider } = context;
      const body = new URLSearchParams({
        grant_type: "authorization_code",
        code: String(params.code),
        redirect_uri: provider.callbackUrl,
        client_id: process.env.LINKEDIN_CLIENT_ID!,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
      });

      const res = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      const tokens = await res.json();

      // корисно для дебагу (без секретів):
      if (!res.ok) {
        throw new Error(`LinkedIn token exchange failed: ${res.status}`);
      }
      return { tokens };
    },
  },
  userinfo: "https://api.linkedin.com/v2/userinfo",
  profile(claims) {
    return {
      id: claims.sub,
      name:
        claims.name ??
        `${claims.given_name ?? ""} ${claims.family_name ?? ""}`.trim(),
      email: claims.email ?? null,
      image: claims.picture ?? null,
    };
  },
};

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    {
      ...LinkedInOIDC,
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    },
  ],
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
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
