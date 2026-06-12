export function trackEvent(name, params = {}) {
  if (typeof window.gtag !== "function") return
  window.gtag("event", name, params)
}

export const Analytics = {
  sessionStart: () =>
    trackEvent("session_start"),

  firstInteraction: () =>
    trackEvent("first_interaction"),

  nodeExpanded: (title) =>
    trackEvent("node_expanded", { node_title: title }),

  nodeHold: (title) =>
    trackEvent("node_hold", { node_title: title }),

  wikipediaOpened: (title) =>
    trackEvent("wikipedia_opened", { node_title: title }),

  graphReset: () =>
    trackEvent("graph_reset"),

  graphRandom: () =>
    trackEvent("graph_random"),

  graphSearch: (query) =>
    trackEvent("graph_search", { search_query: query }),

  infoPopupClosed: () =>
    trackEvent("info_popup_closed"),

  sharePathOpened: (steps) =>
    trackEvent("share_path_opened", { steps }),

  sharePathDownloaded: (steps) =>
    trackEvent("share_path_downloaded", { steps }),

  shareSessionOpened: (nodes) =>
    trackEvent("share_session_opened", { total_nodes: nodes }),

  shareSessionDownloaded: (nodes) =>
    trackEvent("share_session_downloaded", { total_nodes: nodes }),

  sessionEnd: (nodeCount, durationSeconds) =>
    trackEvent("session_end", {
      nodes_generated: nodeCount,
      duration_seconds: durationSeconds,
    }),
}
