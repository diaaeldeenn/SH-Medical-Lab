import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const authOptions: NextAuthOptions = {
  secret: process.env.BETTER_AUTH_SECRET,
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        phone: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${baseUrl}/auth/login`, {
            method: "POST",
            body: JSON.stringify({
              phone: credentials?.phone,
              password: credentials?.password,
            }),
            headers: { "Content-Type": "application/json" },
          });

          const data = await res.json();
          if (!res.ok) {
            throw new Error("Validation Failed");
          }
          const { token, refreshToken } = data.data;
          const profileRes = await fetch(`${baseUrl}/auth/profile`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              token: token,
            },
          });

          const profileData = await profileRes.json();

          if (!profileRes.ok || !profileData.data) {
            throw new Error("فشل في جلب بيانات المستخدم");
          }
          const userData = profileData.data;
          return {
            id: userData.id,
            user: userData,
            token: token,
            refreshToken: refreshToken || "",
          };
        } catch (error: any) {
          throw new Error(error.message || "حدث خطأ أثناء تسجيل الدخول");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user.user;
        token.token = user.token;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = token.user as any;
        session.token = token.token as string;
      }
      return session;
    },
  },
};
