import { QueryClient, QueryFunction } from "@tanstack/react-query";

const PORT_PROXY = "__PORT_5000__".startsWith("__") ? "" : "__PORT_5000__";

// When deployed to GitHub Pages (no Express server), resolve API paths
// against the Vite base URL so /api/stats becomes /bankstrs/api/stats.
// When running with Express locally, PORT_PROXY or "" works fine.
function getApiBase(): string {
  if (PORT_PROXY) return PORT_PROXY;
  const base = import.meta.env.BASE_URL || "/";
  // Strip trailing slash so we can prepend to /api/...
  return base.endsWith("/") ? base.slice(0, -1) : base;
}
const API_BASE = getApiBase();

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(`${API_BASE}${url}`, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey.join("/");
    const res = await fetch(`${API_BASE}${url}`);

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
