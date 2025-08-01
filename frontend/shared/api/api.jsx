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
  },
};
