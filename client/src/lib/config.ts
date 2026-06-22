const trimTrailingSlash = (value: string): string => value.replace(/\/$/, "");

export const getApiBaseUrl = (): string => {
  const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

  if (configuredApiUrl) {
    return trimTrailingSlash(configuredApiUrl);
  }

  return import.meta.env.DEV ? "http://localhost:5000/api" : "/api";
};

export const getDemoUrl = (): string => {
  const configuredDemoUrl = import.meta.env.VITE_DEMO_URL?.trim();

  if (configuredDemoUrl) {
    return configuredDemoUrl;
  }

  return "/demo.html";
};