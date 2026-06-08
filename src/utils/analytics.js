export function trackEvent(name, params = {}) {
  if (typeof window.gtag !== "function") return
  window.gtag("event", name, params)
}

// sesion
export const Analytics = {
  sessionStart: () =>
    trackEvent("session_start"),

  firstInteraction: () =>
    trackEvent("first_interaction"),

  // grafo
  nodeExpanded: (title) =>
    trackEvent("node_expanded", { node_title: title }),

  nodeHold: (title) =>
    trackEvent("node_hold", { node_title: title }),

  wikipediaOpened: (title) =>
    trackEvent("wikipedia_opened", { node_title: title }),

  graphReset: () =>
    trackEvent("graph_reset"),

  infoPopupClosed: () =>
    trackEvent("info_popup_closed"),

  sessionEnd: (nodeCount, durationSeconds) =>
    trackEvent("session_end", {
      nodes_generated: nodeCount,
      duration_seconds: durationSeconds,
    }),
}
