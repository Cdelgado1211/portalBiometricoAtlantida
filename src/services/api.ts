const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
  "https://4r4jghjuorc6m7eqsc7nfg6k6u0utijb.lambda-url.us-east-1.on.aws/";

export interface ApiErrorShape {
  message: string;
}

export class ApiError extends Error {
  public readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function httpPost<TRequest, TResponse>(
  path: string,
  body: TRequest
): Promise<TResponse> {
  if (!API_BASE_URL) {
    throw new ApiError("API base URL not configured");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new ApiError("Request failed", response.status);
  }

  try {
    const data = (await response.json()) as TResponse;
    return data;
  } catch {
    throw new ApiError("Invalid JSON response", response.status);
  }
}
