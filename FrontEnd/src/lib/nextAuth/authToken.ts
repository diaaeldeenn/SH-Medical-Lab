import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";

export default async function authToken() {
  const token = await getToken({
    req: { cookies: await cookies() } as any,
    secret: process.env.BETTER_AUTH_SECRET!,
  });

  return token?.token as string;
}