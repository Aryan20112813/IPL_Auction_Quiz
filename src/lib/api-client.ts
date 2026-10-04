import { ApiErrorResponse } from "./types";
import { ErrorCodeType } from "./constants";
import { computeClockOffset } from "./time";

export class ApiClientError extends Error {
  public code: ErrorCodeType;
  public status: number;
  public serverTime?: string;

  constructor(code: ErrorCodeType, message: string, status: number, serverTime?: string) {
    super(message);
    this.name = "ApiClientError";
    this.code = code;
    this.status = status;
    this.serverTime = serverTime;
  }
}

let activeClockOffsetMs = 0;

export function getEstimatedServerTime(): Date {
  return new Date(Date.now() + activeClockOffsetMs);
}

export function getClockOffsetMs(): number {
  return activeClockOffsetMs;
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, headers: customHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((customHeaders as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const tSent = Date.now();
  const response = await fetch(endpoint, {
    ...rest,
    headers,
  });
  const tReceived = Date.now();

  let data: any;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }

  if (data && data.serverTime) {
    activeClockOffsetMs = computeClockOffset(data.serverTime, tSent, tReceived);
  }

  if (!response.ok) {
    const errorBody = data as ApiErrorResponse | null;
    const code = (errorBody?.error?.code || "INTERNAL") as ErrorCodeType;
    const message = errorBody?.error?.message || `Request failed with status ${response.status}`;
    throw new ApiClientError(code, message, response.status, errorBody?.serverTime);
  }

  return data as T;
}
