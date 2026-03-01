import { Agent, fetch } from "undici";

/**
 * Call the Ollama API with the given prompt.
 *
 * @param {string} host - The Ollama host URL.
 * @param {object} options - The options for the Ollama API call.
 * @returns {Promise<string>} - The response from the Ollama API.
 * @throws {Error} - If the Ollama API call fails.
 */
export async function callOllama(host, options = {}) {
  console.log("Calling AI model API...");

  const controller = new AbortController();
  const agent = new Agent({
    connectTimeout: 5_000, // 5 seconds to establish connection
    headersTimeout: 1_200_000, // 600 seconds to receive headers
    bodyTimeout: 100_000, // 100 seconds to receive body
    keepAliveTimeout: 10_000,
  });
  const start = performance.now();

  try {
    const res = await fetch(`${host}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(options),
      dispatcher: agent,
    });

    console.log(`AI thought for ${((performance.now() - start) / 1000).toFixed(2)} s`);

    if (!res.ok) {
      const text = await res.text();

      throw new Error(`Ollama error ${res.status}: ${text}`);
    }

    const data = await res.json();

    return data.response.trim();
  } catch (e) {
    console.log(`Request failed after ${((performance.now() - start) / 1000).toFixed(2)} s`);

    throw e;
  } finally {
    controller.abort();
    agent.close();
  }
}
