import {
  LoginType,
  RegisterType,
} from "@/validation/auth.validation";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const registerApi = async (form: RegisterType) => {
  const request = await fetch(`${baseUrl}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  const response = await request.json();

  if (!request.ok) {
    throw new Error(response.message || "Registration failed");
  }

  return response;
};

export const loginApi = async (form: LoginType) => {
  const request = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  const response = await request.json();

  if (!request.ok) {
    throw new Error(response.message || "Login failed");
  }

  return response;
};
