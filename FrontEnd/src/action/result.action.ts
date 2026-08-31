"use server";
import authToken from "@/lib/nextAuth/authToken";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const getResultById = async (requestId: string) => {
  const token = await authToken();

  const request = await fetch(`${baseUrl}/result/${requestId}`, {
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

export const getResultsByRequest = async (requestId: string) => {
  const token = await authToken();

  const request = await fetch(`${baseUrl}/result/requests/${requestId}`, {
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

export const getResultPdf = async (requestId: string, testId: string) => {
  const token = await authToken();

  const request = await fetch(
    `${baseUrl}/result/requests/${requestId}/tests/${testId}/pdf`,
    {
      method: "GET",
      headers: {
        token,
      },
    },
  );

  if (!request.ok) {
    const response = await request.json();
    throw new Error(response.message || "Request failed");
  }

  const arrayBuffer = await request.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const contentType = request.headers.get("content-type") ?? "application/pdf";

  return { base64, contentType };
};