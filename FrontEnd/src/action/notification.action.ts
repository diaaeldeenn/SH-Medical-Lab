"use server";
import authToken from "@/lib/nextAuth/authToken";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const getMyNotification = async (page: number, limit: number) => {
  const token = await authToken();

  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  const request = await fetch(`${baseUrl}/notifications?${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token,
    },
  });

  const response = await request.json();

  if (!request.ok) {
    throw new Error(response.message || "Request failed");
  }

  return response;
};
