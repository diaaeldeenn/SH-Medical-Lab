"use server";
import authToken from "@/lib/nextAuth/authToken";
import { CreateTestType, UpdateTestType } from "@/validation/test.validation";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const createTest = async (payload: CreateTestType) => {
  const token = await authToken();

  const request = await fetch(`${baseUrl}/test`, {
    method: "POST",
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

export const updateTest = async (payload: UpdateTestType, testId: string) => {
  const token = await authToken();

  const request = await fetch(`${baseUrl}/test/${testId}`, {
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

export const deleteTest = async (testId: string) => {
  const token = await authToken();

  const request = await fetch(`${baseUrl}/test/${testId}`, {
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

export const getTestById = async (testId: string) => {
  const token = await authToken();

  const request = await fetch(`${baseUrl}/test/${testId}`, {
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
