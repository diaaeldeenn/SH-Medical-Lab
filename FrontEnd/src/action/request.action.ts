"use server";
import authToken from "@/lib/nextAuth/authToken";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const getMyRequest = async (page: number, limit: number) => {
  const token = await authToken();

  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  const request = await fetch(`${baseUrl}/request/my?${params}`, {
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

export const getAllRequest = async (
  page: number,
  limit: number,
  status?: string,
  searchKey?: string,
  startDate?: string,
  endDate?: string,
) => {
  const token = await authToken();

  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (status) params.append("status", status);
  if (searchKey) params.append("searchKey", searchKey);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  const request = await fetch(`${baseUrl}/request/request?${params}`, {
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

export const getRequestById = async (requestId: string) => {
  const token = await authToken();

  const request = await fetch(`${baseUrl}/request/${requestId}`, {
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
