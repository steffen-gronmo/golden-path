import { getApiUrl } from "./client-utils";

export interface Sak {
  id: string;
  organisajonsnummer: string;
  status: "Created" | "InProgress" | "Done" | "Archived";
  created: string;
  lastUpdated: string;
}

export interface CreateSakDto {
  organisajonsnummer: string;
}

export type SakAction = "start-sak" | "end-sak" | "archive-sak";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Response,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new ApiError(`HTTP ${response.status}: ${errorText}`, response.status, response);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }

  return (await response.text()) as T;
}

export const api = {
  getSaker: async (): Promise<Sak[]> => {
    const response = await fetch(`${getApiUrl()}/saker`);
    return await handleResponse<Sak[]>(response);
  },

  getSakById: async (id: string): Promise<Sak> => {
    const response = await fetch(`${getApiUrl()}/saker/${id}`);
    return handleResponse<Sak>(response);
  },

  createSak: async (data: CreateSakDto): Promise<Sak> => {
    const response = await fetch(`${getApiUrl()}/saker`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<Sak>(response);
  },

  performSakAction: async (action: SakAction, sakId: string): Promise<void> => {
    const response = await fetch(`${getApiUrl()}/actions/${action}?sakId=${sakId}`, {
      method: "POST",
    });
    return handleResponse<void>(response);
  },
};
