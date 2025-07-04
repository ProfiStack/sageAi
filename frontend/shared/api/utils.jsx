import { keyBy } from "lodash";
export const validatePayload = (payload) => {
  if (typeof payload === 'object') {
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const key in payload) {
      if (typeof payload[key] === 'string') {
        // eslint-disable-next-line no-param-reassign
        payload[key] = payload[key]?.trim();
      }
      if (!payload[key]) {
        // eslint-disable-next-line no-param-reassign
        delete payload[key];
      }
    }
  }
  return payload;
};

export function mergeChatIdIntoMockData(mockData, history) {
  // Create a lookup object keyed by type
  const keyedHistory = history.reduce((acc, item) => {
    if (item?.type) {
      acc[item.type] = item;
    }
    return acc;
  }, {});

  // Function to enrich a single section
  const enrichSection = (section) => {
    if (!Array.isArray(section)) return [];
    
    return section.map(item => {
      // Find matching history item by type
      const historyItem = item?.type ? keyedHistory[item.type] : null;
      
      // Return enriched item if match found, otherwise original item
      return historyItem 
        ? { ...item, chatId: historyItem.id } 
        : item;
    });
  };

  // Return enriched data with all sections
  return {
    main: enrichSection(mockData.main),
    insights: enrichSection(mockData.insights),
    professional: enrichSection(mockData.professional),
    otherCategories: enrichSection(mockData.otherCategories),
  };
}