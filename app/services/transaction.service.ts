import { fetchAPI, getAuthHeaders } from "../lib/api";
import { Transaction } from "../types";

export const transactionCheckout = async (
  form: FormData
): Promise<Transaction> => {
  return await fetchAPI<Transaction>("/transactions/checkout", {
    method: "POST",
    body: form,
  });
};

export const getAllTransactions = async (): Promise<Transaction[]> => {
  return await fetchAPI<Transaction[]>("/transactions", {
    cache: "no-store",
    headers: {
      ...getAuthHeaders(),
    },
  });
};

export const getTransactionById = async (id: string): Promise<Transaction> => {
  return await fetchAPI<Transaction>(`/transactions/${id}`);
};

export const updateTransaction = async (
  id: string,
  data: FormData
): Promise<Transaction> => {
  return await fetchAPI<Transaction>(`/transactions/${id}`, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
    },
    body: data,
  });
};

export const updateTransactionStatus = async (
  id: string,
  status: "paid" | "rejected"
): Promise<Transaction> => {
  return await fetchAPI<Transaction>(`/transactions/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ status }),
  });
};

export const deleteTransaction = async (id: string): Promise<void> => {
  return await fetchAPI<void>(`/transactions/${id}`, {
    method: "DELETE",
  });
};
