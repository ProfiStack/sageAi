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
    getStartup: async (id) => {
      try {
        const response = await baseFetch(
          ({ globalBaseUrl }) => `${globalBaseUrl}/api/startups/${id}`,
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
    startUpSignUp: async (data) => {
      try {
        const authToken = await getAuthToken();
        const formData = new FormData();
        // Append other fields and the file correctly
        Object.keys(data).forEach((key) => {
          if (
            (data[key] &&
              data[key].type &&
              data[key]?.type?.includes("image")) ||
            data[key]?.type?.includes("pdf")
          ) {
            formData.append(key, data[key], data[key].name); // Attach file with its name
          } else {
            formData.append(key, data[key]);
          }
        });
        const response = await baseFetch(
          ({ globalBaseUrl }) => `${globalBaseUrl}/api/startups`,
          {
            method: "POST",
            body: formData, // Use FormData directly
            next: {
              revalidate: 3600, // 1 hour
            },
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        return response;
      } catch (error) {
        console.error("Error uploading:", error);
      }
    },
  },
};
