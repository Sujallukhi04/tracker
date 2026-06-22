"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const getApiUrl = () => {
    var _a;
    const hostname = window.location.hostname;
    // Custom configuration override
    const configUrl = (_a = window.CausalFunnelConfig) === null || _a === void 0 ? void 0 : _a.apiUrl;
    if (configUrl) {
        return configUrl;
    }
    // Local development (localhost or LAN IP)
    if (hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname.startsWith("192.168.") ||
        hostname.startsWith("10.") ||
        hostname.startsWith("172.")) {
        return `http://${hostname}:5000/api/events`;
    }
    // Production fallback
    return "/api/events";
};
const API_URL = getApiUrl();
const getSessionId = () => {
    let sessionId = localStorage.getItem("session_id");
    if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem("session_id", sessionId);
    }
    return sessionId;
};
const sendEvent = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (res.ok) {
            // Dispatch custom event so the testing sandbox page can render real-time logs
            window.dispatchEvent(new CustomEvent("tracker-event-sent", { detail: payload }));
        }
    }
    catch (err) {
        console.error("Tracker error:", err);
    }
});
const trackPageView = () => {
    sendEvent({
        sessionId: getSessionId(),
        type: "page_view",
        url: window.location.href,
        timestamp: new Date().toISOString(),
    });
};
const trackClicks = () => {
    document.addEventListener("click", (e) => {
        const target = e.target;
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
