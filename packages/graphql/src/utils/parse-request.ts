/**
 * Parse from URLSearchParams
 *
 * @param {URLSearchParams} searchParams
 * @returns {Record<string, string>}
 */
const parseQuery = (searchParams: URLSearchParams): Record<string, string> => {
  const res: Record<string, string> = {};

  searchParams.forEach((v, k) => (res[k] = v));

  return res;
};

/**
 * Parse request
 *
 * @param {Request} req
 * @returns {Promise<Record<string, unknown>>}
 */
export const parseRequest = async (
  req: Request
): Promise<Record<string, unknown>> => {
  // GET request
  if (req.method.toLowerCase() === 'get') {
    return parseQuery(new URL(req.url).searchParams);
  }

  // POST request
  const contentType = req.headers.get('content-type');

  switch (contentType) {
    case 'application/graphql':
      return { query: await req.text() };

    case 'application/json':
      try {
        return await req.json();
      } catch (e) {
        if (e instanceof Error) {
          console.error(`${e.stack || e.message}`);
        }

        throw Error(`POST body sent invalid JSON: ${e}`);
      }

    case 'application/x-www-form-urlencoded':
      const text = await req.text();
      const searchParams = new URLSearchParams(text);

      return parseQuery(searchParams);
  }

  return {};
};
