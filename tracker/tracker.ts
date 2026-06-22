const getApiUrl = (): string => {
  const hostname = window.location.hostname;
  
  // Custom configuration override
  const configUrl = (window as any).CausalFunnelConfig?.apiUrl;
  if (configUrl) {
    return configUrl;
  }

  // Local development (localhost or LAN IP)
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.") ||
    hostname.startsWith("172.")
  ) {
    return `http://${hostname}:5000/api/events`;
  }

  // Production fallback
  return "/api/events";
};

const API_URL = getApiUrl();

const getSessionId = (): string => {
  let sessionId = localStorage.getItem("session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("session_id", sessionId);
  }
  return sessionId;
};

const sendEvent = async (payload: object): Promise<void> => {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    
    if (res.ok) {
      // Dispatch custom event so the testing sandbox page can render real-time logs
      window.dispatchEvent(new CustomEvent("tracker-event-sent", { detail: payload }));
    }
  } catch (err) {
    console.error("Tracker error:", err);
  }
};

const trackPageView = (): void => {
  sendEvent({
    sessionId: getSessionId(),
    type: "page_view",
    url: window.location.href,
    timestamp: new Date().toISOString(),
  });
};

const trackClicks = (): void => {
  document.addEventListener("click", (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    // Do not track clicks on the sandbox monitor panel itself
    if (target.closest(".monitor-panel")) {
      return;
    }

    sendEvent({
      sessionId: getSessionId(),
      type: "click",
      url: window.location.href,
      timestamp: new Date().toISOString(),
      x: e.clientX,
      y: e.clientY,
    });
  });
};

trackPageView();
trackClicks();
