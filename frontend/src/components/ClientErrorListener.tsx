"use client";

import { instance } from "@/lib/api/axios";

function sendError(payload: unknown) {
  instance.post("/client-log", payload).catch(() => {});
}

if (typeof window !== "undefined") {
  window.addEventListener("error", (event) => {
    if (event.message?.includes("NEXT_REDIRECT")) {
      return;
    }
    sendError({
      type: "window-error",
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      ts: new Date().toISOString(),
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason as unknown;

    let message = "Unknown error";
    let stack: string | undefined;

    if (reason instanceof Error) {
      message = reason.message;
      stack = reason.stack;
    } else if (typeof reason === "string") {
      message = reason;
    } else if (reason && typeof reason === "object") {
      message = JSON.stringify(reason);
    }

    sendError({
      type: "unhandled-rejection",
      message,
      stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      ts: new Date().toISOString(),
    });
  });
}

export default function ClientErrorListener() {
  return null;
}
