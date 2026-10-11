// Serverless adapter for Judge0. The public endpoint may require an account/API key
// or may impose rate limits. Configure JUDGE0_API_URL and JUDGE0_API_KEY as Vercel
// environment variables for a provider you are authorized to use.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Use POST to run code." });
  }
  try {
    const { code, stdin = "" } = req.body || {};
    if (typeof code !== "string" || !code.trim()) {
      return res.status(400).json({ error: "Enter some Java code first." });
    }
    if (code.length > 20000 || String(stdin).length > 10000) {
      return res.status(413).json({ error: "Code or input is too large." });
    }
    if (!/\bclass\s+Main\b/.test(code)) {
      return res.status(400).json({ error: "Please use 'public class Main' as the class name." });
    }

    const baseUrl = (process.env.JUDGE0_API_URL || "https://ce.judge0.com").replace(/\/+$/, "");
    const headers = { "Content-Type": "application/json" };
    if (process.env.JUDGE0_API_KEY) headers["X-Auth-Token"] = process.env.JUDGE0_API_KEY;

    const upstream = await fetch(baseUrl + "/submissions?base64_encoded=false&wait=true", {
      method: "POST",
      headers,
      body: JSON.stringify({
        source_code: code,
        language_id: 62,
        stdin: String(stdin),
        cpu_time_limit: 5,
        wall_time_limit: 10,
        memory_limit: 128000
      }),
      signal: AbortSignal.timeout(20000)
    });
    const raw = await upstream.text();
    let data;
    try { data = JSON.parse(raw); } catch { data = null; }
    if (!upstream.ok) {
      console.error("Judge0 upstream status:", upstream.status, raw.slice(0, 500));
      return res.status(502).json({
        error: "Java execution API unavailable or rejected the request (HTTP " + upstream.status +
          "). Configure a working Judge0-compatible endpoint and API key in Vercel environment variables."
      });
    }
    if (!data) return res.status(502).json({ error: "Java execution service returned an invalid response." });
    return res.status(200).json(data);
  } catch (err) {
    console.error("Java compile error:", err);
    return res.status(502).json({
      error: err.name === "TimeoutError"
        ? "Compilation timed out. Try a smaller program."
        : "Could not connect to the Java execution service. Check its URL and availability."
    });
  }
}