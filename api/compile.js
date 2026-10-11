// Vercel serverless endpoint that adapts Wandbox's public API to JavaLab's UI.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { code, stdin = "" } = req.body || {};
    if (typeof code !== "string" || !code.trim()) {
      return res.status(400).json({ error: "Please enter some Java code." });
    }
    if (code.length > 50000 || String(stdin).length > 20000) {
      return res.status(413).json({ error: "Code or standard input is too large." });
    }

    const listResponse = await fetch("https://wandbox.org/api/list.json");
    if (!listResponse.ok) throw new Error("Wandbox compiler list is currently unavailable.");
    const compilers = await listResponse.json();
    const javaCompilers = compilers.filter((item) =>
      /java/i.test(item.language || "") &&
      /openjdk|jdk/i.test(item.name || "") &&
      !/deprecated|obsolete/i.test(item.name || "")
    );
    if (!javaCompilers.length) throw new Error("Wandbox currently has no available Java compiler.");

    // Prefer the newest listed OpenJDK compiler without hard-coding a version.
    const compiler = javaCompilers[javaCompilers.length - 1];
    const response = await fetch("https://wandbox.org/api/compile.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        compiler: compiler.name,
        // Wandbox's Java template compiles prog.java, so map the public Main class to prog.
        code: code.replace(/public\s+class\s+Main\b/, "public class prog").replace(/(?<!public\s)\bclass\s+Main\b/, "class prog"),
        stdin: String(stdin),
        save: false,
        "compiler-option-raw": "",
        "runtime-option-raw": ""
      })
    });
    const result = await response.json();
    if (!response.ok) {
      return res.status(502).json({ error: result.message || "Wandbox could not compile this program." });
    }

    const stdout = result.program_output || "";
    const stderr = result.program_error || "";
    const compileOutput = [result.compiler_error, result.compiler_output].filter(Boolean).join("\n");
    const statusCode = Number(result.status);
    const failed = (Number.isFinite(statusCode) && statusCode !== 0) || Boolean(stderr) || Boolean(compileOutput);

    return res.status(200).json({
      stdout,
      stderr,
      compile_output: compileOutput,
      message: result.signal ? `Program stopped with signal: ${result.signal}` : "",
      status: {
        id: failed ? 6 : 3,
        description: failed ? "Compilation or runtime error" : "Accepted"
      }
    });
  } catch (error) {
    return res.status(502).json({
      error: error instanceof Error ? error.message : "Unable to reach the Wandbox compiler service."
    });
  }
}
