"use server";
import authToken from "@/lib/nextAuth/authToken";
import {
  CreateResultType,
  UpdateResultType,
} from "@/validation/result.validation";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const createResult = async (
  payload: CreateResultType,
  requestId: string,
  testId: string,
) => {
  const token = await authToken();

  const request = await fetch(
    `${baseUrl}/result/requests/${requestId}/tests/${testId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token,
      },
      body: JSON.stringify(payload),
    },
  );

  const response = await request.json();

  if (!request.ok) {
    throw new Error(response.message || "Request failed");
  }

  return response;
};

export const updateResult = async (
  payload: UpdateResultType,
  resultId: string,
) => {
  const token = await authToken();

  const request = await fetch(`${baseUrl}/result/${resultId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      token,
    },
    body: JSON.stringify(payload),
  });

  const response = await request.json();

  if (!request.ok) {
    throw new Error(response.message || "Request failed");
  }

  return response;
};

export const lockResult = async (resultId: string) => {
  const token = await authToken();

  const request = await fetch(`${baseUrl}/result/${resultId}/lock`, {
    method: "PATCH",
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

export const deleteResult = async (resultId: string) => {
  const token = await authToken();

  const request = await fetch(`${baseUrl}/result/${resultId}`, {
    method: "DELETE",
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

export const getAllResults = async (params?: {
  page?: number;
  limit?: number;
  requestId?: string;
  testId?: string;
}) => {
  const token = await authToken();

  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.requestId) searchParams.append("requestId", params.requestId);
  if (params?.testId) searchParams.append("testId", params.testId);

  const queryString = searchParams.toString();
  const url = `${baseUrl}/result${queryString ? `?${queryString}` : ""}`;

  const request = await fetch(url, {
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
