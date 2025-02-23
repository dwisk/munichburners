import qs from "qs"

/**
 * Get full Strapi URL from path
 * @param {string} path Path of the URL
 * @returns {string} Full Strapi URL
 */
export function getStrapiURL(path = "") {
  return `${
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337"
  }${path}`
}

/**
 * Helper to make GET requests to Strapi API endpoints
 * @param {string} path Path of the API route
 * @param {Object} urlParamsObject URL params object, will be stringified
 * @param {Object} options Options passed to fetch
 * @returns Parsed API call response
 */
export async function fetchAPI(path:string, urlParamsObject = {}, options = {}, jwt:string|null = null) {
  // Merge default and user options
  const mergedOptions: RequestInit = {
    ...options,
  }

  if (jwt !== null) {
    mergedOptions.headers =  {
      "Content-Type": "application/json",
      Authorization:
          `Bearer ${jwt || '14d196505f53564e2ed68d1d8aced145a9a751e85131b83a013af8e9d0e368501ce2378963490f6c2f67f91973112403a7a195e0c08cd9eec57da94e9669443ac3cfa22775b7ca464f9820728fb91df34945273f440b6260e1fa8904b7ae5f06dadaa24978b5991f609016a2f144101a59b8a752f5828f94c78b780b7c0128d8'}`,
    };
  }

  // Build request URL
  const queryString = qs.stringify(urlParamsObject)
  const requestUrl = `${getStrapiURL(
    `/api${path}${queryString ? `?${queryString}` : ""}`
  )}`

  // Trigger API call
  const response = await fetch(requestUrl, mergedOptions)

  // Handle response
  if (!response.ok) {
    // parseError(response.body);
    console.log(requestUrl, mergedOptions)
    parseError(response.body);
    throw new Error(`An API error occured (${response.statusText}) please try again`)
  }
  const data = await response.json()
  return data
}

interface HelperParams {
  endpoint:string,
  data?:object,
  // session: Session | null,
  method?: 'GET'|'PUT'|'POST'|'DELETE',
  onSuccess?: (result: object) => void,
  onError?: (message: string) => void
}

export async function fetchHelper({endpoint, data, method = 'GET', onSuccess, onError}:HelperParams) {
  // Send the data to the server in JSON format.
  const JSONdata = JSON.stringify({
    data,
    // token: session?.jwt,
    // sessionId: session?.id
  })

  // Form the request for sending data to the server.
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: method !== 'GET' ? JSONdata: undefined
  }

  const response = await fetch(endpoint, {...options})

  const result = await response.json();
  if (result.success && onSuccess) {
    onSuccess(result);
  } else if (!result.success && onError) {
    onError(result.message);
  }

}

async function parseError(stream: ReadableStream|null) {
  if (stream === null) {
    return;
  }
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let result = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += decoder.decode(value, { stream: true });
  }

  result += decoder.decode(); // finalize the string
  const body = JSON.parse(result);

  console.log(body.error.status, body.error.name, Object.values(JSON.parse(body.error.message)));
}