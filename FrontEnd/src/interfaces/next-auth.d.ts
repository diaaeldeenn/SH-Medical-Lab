import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

export interface UserDataI {
  id: string;
  name: string;
  phone: string;
  email?: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE";
  role: string;
}

declare module "next-auth" {
  interface User {
    id: string;
    user: UserDataI;
    token: string;
    refreshToken: string;
  }

  interface Session {
    user: UserDataI;
    token?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: UserDataI;
    token: string;
    refreshToken?: string;
  }
}
