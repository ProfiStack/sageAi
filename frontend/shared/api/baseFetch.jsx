
import { merge } from 'lodash';

export const globalBaseUrl = process.env.NEXT_PUBLIC_GLOBAL_BASE_URL || 'http://localhost:3001';

/**
 * Fetches data from a URL with enhanced security and flexibility.
 *
 * @param {function | string} urlBuilder - Either a function that constructs the URL
 *                                            based on provided options, or a pre-defined URL string.
 * @param {object} [options] - Optional configuration options for the fetch request.
 * @returns {Promise<any>} - A promise that resolves to the parsed JSON response from the fetched URL.
 *
 * @throws {Error} - Throws an error if the URL construction or fetch operation fails.
 */
export const baseFetch = async (urlBuilder, options) => {
  let refetched = false;
  try {
    const urlBuilderArgs = {
      globalBaseUrl,
    };

    let url = urlBuilder;
    if (typeof urlBuilder === 'function') {
      url = urlBuilder(urlBuilderArgs);
    }

    const baseOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    };

    // Forward all headers from client to API
  
    const finalOptions = merge(baseOptions, options);
    if (finalOptions.body instanceof FormData) {
      delete finalOptions.headers['Content-Type'];
    } else if (finalOptions.body && typeof finalOptions.body === 'object') {
      finalOptions.body = JSON.stringify(finalOptions.body);
    }

    let response = await fetch(url, finalOptions);
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(error);
    if (!refetched) {
      console.error('Error in baseFetch:', error);
      throw error;
    }
  }

  return null;
};
