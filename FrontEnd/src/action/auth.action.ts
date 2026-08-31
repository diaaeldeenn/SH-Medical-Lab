"use server";
import authToken from "@/lib/nextAuth/authToken";
import { ChangePasswordType } from "@/validation/auth.validation";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const changePassword = async (form: ChangePasswordType) => {
  const token = await authToken();
  const request = await fetch(`${baseUrl}/auth/change-password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      token
    },
    body: JSON.stringify(form),
  });
  const response = await request.json();
  if (!request.ok) {
    throw new Error(response.message || "Change Password failed");
  }
  return response;
};
