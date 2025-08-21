import { DefaultSession } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";
import { GetUser } from "./users.type";

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    backendData?: GetUser;
  }
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    backendData?: GetUser;
    user: DefaultSession["user"] & {
      provider?: string;
      providerId?: string;
    };
  }
}
