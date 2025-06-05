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
    getStartups: async () => {
      try {
        const response = await baseFetch(
          ({ globalBaseUrl }) => `${globalBaseUrl}/api/startups`,
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
  },
};
