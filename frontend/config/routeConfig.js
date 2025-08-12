// routeConfig.js
// This file contains the mapping between original routes and their chat/scan variants
// Only for categories that require chat/scan options (Skincare & Makeup)

export const routeMapping = {
  // Skincare routes
  "/chat": {
    chat: "/chat",
    scan: "/skin-scan",
  },
  "/trend-analysis": {
    chat: "/trend-analysis-chat",
    scan: "/trend-analysis-scan",
  },
  "/check-ingredients": {
    chat: "/ingredients-chat",
    scan: "/ingredients-scan",
  },
  "/treatment-planning": {
    chat: "/treatment-planning-chat",
    scan: "/treatment-planning-scan",
  },

  // Makeup routes
  "/makeup": {
    chat: "/makeup-chat",
    scan: "/makeup-scan",
  },
  "/makeup-looks": {
    chat: "/makeup-looks-chat",
    scan: "/makeup-looks-scan",
  },
  "/makeup-tools": {
    chat: "/makeup-tools-chat",
    scan: "/makeup-tools-scan",
  },
  "/true-tone": {
    chat: "/true-tone-chat",
    scan: "/true-tone-scan",
  },
  "/beauty-breakdown": {
    chat: "/beauty-breakdown-chat",
    scan: "/beauty-breakdown-scan",
  },
  "/technique-validation": {
    chat: "/technique-validation-chat",
    scan: "/technique-validation-scan",
  },

  // Note: Other categories (Nutrition, Hair Care, Styling, Wellness)
  // are not included here as they use direct navigation
};

// Helper function to get routes for a given original route
export const getRoutesForItem = (originalRoute) => {
  return (
    routeMapping[originalRoute] || {
      chat: originalRoute,
      scan: originalRoute,
    }
  );
};

// Helper function to check if a route has custom chat/scan variants
export const hasCustomRoutes = (originalRoute) => {
  return routeMapping.hasOwnProperty(originalRoute);
};

// Helper function to check if a category should show popup based on route
export const shouldShowPopupForRoute = (route) => {
  return routeMapping.hasOwnProperty(route);
};
