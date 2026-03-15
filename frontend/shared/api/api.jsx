import { getAuthToken } from "../utils/utils";
import { baseFetch } from "./baseFetch";
import { validatePayload } from "./utils";

export const Api = {
  // client side endpoint

  // global endpoints
  client: {
    signUp: async (data) => {
      try {
        const response = await baseFetch(
          ({ globalBaseUrl }) => `${globalBaseUrl}/api/auth/signup`,
          {
            method: "POST",
            body: validatePayload(data),
            next: {
              revalidate: 3600, // 1 hour
            },
          }
        );
        return response;
      } catch (error) {
        console.log(error);
      }
    },
    signIn: async (data) => {
      try {
        const response = await baseFetch(
          ({ globalBaseUrl }) => `${globalBaseUrl}/api/auth/login`,
          {
            method: "POST",
            body: validatePayload(data),
            next: {
              revalidate: 3600, // 1 hour
            },
          }
        );
        return response;
      } catch (error) {
        console.log(error);
      }
    },

    getQuizzes: async () => {
      try {
        const res = await baseFetch(
          ({ globalBaseUrl }) => `${globalBaseUrl}/api/quiz`,
          {
            method: "GET",
            next: {
              revalidate: 3600, // 1 hour
            },
          }
        );
        return res;
      } catch (error) {
        console.log(error);
      }
    },
    updateProfile: async (data, token) => {
      try {
        const response = await baseFetch(
          ({ globalBaseUrl }) => `${globalBaseUrl}/api/user/profile`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: validatePayload(data),
            next: {
              revalidate: 3600, // 1 hour
            },
          }
        );
        return response;
      } catch (error) {
        console.log(error);
      }
    },

    getProfile: async (token) => {
      try {
        const response = await baseFetch(
          ({ globalBaseUrl }) => `${globalBaseUrl}/api/user/profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            next: {
              revalidate: 3600, // 1 hour
            },
          }
        );
        return response;
      } catch (error) {
        console.log(error);
      }
    },
    getMessages: async () => {
      try {
        const response = await baseFetch(
          ({ globalBaseUrl }) => `${globalBaseUrl}/api/static_messages`,
          {
            method: "GET",
            next: {
              revalidate: 3600, // 1 hour
            },
          }
        );
        return response;
      } catch (error) {
        console.log(error);
      }
    },
    getChatHistory: async (token, feature_type) => {
      try {
        if (!feature_type) {
          return;
        }
        const response = await baseFetch(
          ({ globalBaseUrl }) =>
            `${globalBaseUrl}/api/user/history/${feature_type.feature_type}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            next: {
              revalidate: 3600, // 1 hour
            },
          }
        );
        return response;
      } catch (error) {
        console.log(error);
      }
    },
    getAllChatHistory: async (token) => {
      try {
        const response = await baseFetch(
          ({ globalBaseUrl }) => `${globalBaseUrl}/api/user/history`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            next: {
              revalidate: 3600, // 1 hour
            },
          }
        );
        return response;
      } catch (error) {
        console.log(error);
      }
    },
    getResults: async (token, chatId) => {
      try {
        const response = await baseFetch(
          ({ globalBaseUrl }) => `${globalBaseUrl}/api/user/chat/${chatId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            next: {
              revalidate: 3600, // 1 hour
            },
          }
        );
        return response;
      } catch (error) {
        console.log(error);
      }
    },
    subscribePayment: async ({ price_id, token, type }) => {
      try {
        const response = await baseFetch(
          ({ globalBaseUrl }) => `${globalBaseUrl}/api/payments/pay`,
          {
            method: "POST",
            body: validatePayload({ price_id, type }),
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response;
      } catch (error) {
        console.log(error);
      }
    },
    prices: async () => {
      try {
        const response = await baseFetch(
          ({ globalBaseUrl }) => `${globalBaseUrl}/api/payments/prices`,
          {
            method: "GET",
          }
        );
        return response;
      } catch (error) {
        console.log(error);
      }
    },
    analyzeSkinPhoto: async (image, token) => {
      try {
        const response = await baseFetch(
          ({ globalBaseUrl }) => `${globalBaseUrl}/api/user/analyze/skin-photo`,
          {
            method: "POST",
            body: image,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response;
      } catch (error) {
        console.log(error);
      }
    },
    analyzeShadeMatching: async (image, token) => {
      try {
        const response = await baseFetch(
          ({ globalBaseUrl }) =>
            `${globalBaseUrl}/api/user/analyze/shade-matching`,
          {
            method: "POST",
            body: image,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response;
      } catch (error) {
        console.log(error);
      }
    },
    getCancelSubscription: async (token) => {
      try {
        const response = await baseFetch(
          ({ globalBaseUrl }) => `${globalBaseUrl}/api/payments/un-subscribe`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            next: {
              revalidate: 3600, // 1 hour
            },
          }
        );
        return response;
      } catch (error) {
        console.log(error);
      }
    },

    favourites: async (token, data, userId) => {
      try {
        const response = await baseFetch(
          ({ globalBaseUrl }) => `${globalBaseUrl}/api/favourites/${userId}`,
          {
            method: "POST",
            body: validatePayload(data),
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response;
      } catch (error) {
        console.log(error);
      }
    },
    getFavourites: async (token, userId) => {
      try {
        const response = await baseFetch(
          ({ globalBaseUrl }) => `${globalBaseUrl}/api/favourites/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response;
      } catch (error) {
        console.log(error);
      }
    },
    analyzeProduct: async (formData) => {
      try {
        const response = await baseFetch(
          ({ globalBaseUrl }) => `${globalBaseUrl}/api/favourites/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response;
      } catch (error) {
        console.log(error);
      }
    },

    // ── Reviews ──────────────────────────────────────────────────────────
    getReviewPromptStatus: async (token, feature_tag) => {
      try {
        const response = await baseFetch(
          ({ globalBaseUrl }) =>
            `${globalBaseUrl}/api/user/review-prompt?feature_tag=${feature_tag}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return response;
      } catch (error) {
        console.log(error);
      }
    },
    submitReview: async (token, data) => {
      try {
        const response = await baseFetch(
          ({ globalBaseUrl }) => `${globalBaseUrl}/api/reviews`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: validatePayload(data),
          }
        );
        return response;
      } catch (error) {
        console.log(error);
      }
    },
  },

  // ── B2B Portal ──────────────────────────────────────────────────────────
  b2b: {
    // Verify an API key by listing users (lightweight auth check)
    verifyKey: async (apiKey) => {
      const response = await baseFetch(
        ({ globalBaseUrl }) => `${globalBaseUrl}/api/b2b/users`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${apiKey}` },
        }
      );
      return response;
    },

    // Users
    createUser: async (apiKey, data) => {
      return baseFetch(
        ({ globalBaseUrl }) => `${globalBaseUrl}/api/b2b/users`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}` },
          body: data,
        }
      );
    },

    listUsers: async (apiKey, skip = 0, limit = 50) => {
      return baseFetch(
        ({ globalBaseUrl }) =>
          `${globalBaseUrl}/api/b2b/users?skip=${skip}&limit=${limit}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${apiKey}` },
        }
      );
    },

    getUser: async (apiKey, userId) => {
      return baseFetch(
        ({ globalBaseUrl }) => `${globalBaseUrl}/api/b2b/users/${userId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${apiKey}` },
        }
      );
    },

    // Scan — multipart form (image file)
    scanUser: async (apiKey, userId, imageFile) => {
      const formData = new FormData();
      formData.append("image", imageFile);
      return baseFetch(
        ({ globalBaseUrl }) =>
          `${globalBaseUrl}/api/b2b/users/${userId}/scan`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}` },
          body: formData,
        }
      );
    },

    // Recommendations
    getRecommendations: async (apiKey, userId, limit = 5) => {
      return baseFetch(
        ({ globalBaseUrl }) =>
          `${globalBaseUrl}/api/b2b/users/${userId}/recommendations?limit=${limit}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${apiKey}` },
        }
      );
    },
  },
};
