# JavaLab Online Compiler ☕

A minimal, responsive Java practice editor with an OLED-style dark theme, standard input, and output/error display.

## Live Demo

- **GitHub Pages (static UI):** https://biggybird.github.io/javalab-online-compiler/

Java execution uses the Vercel serverless endpoint. GitHub Pages hosts only static files, so the page explicitly sends compile requests to the Vercel API instead of trying to call a nonexistent `/api/compile` route on `github.io`.

## Explore the projects

- **JavaLab Online Compiler:** https://github.com/biggybird/javalab-online-compiler
- **ByteForge Java Lab:** https://github.com/biggybird/byteforge-java-compiler

## Features

- OLED-style dark UI and responsive mobile layout
- Java `Main` class editor
- Standard input support for `Scanner`
- Program output and compilation/runtime error display
- Serverless API adapter using the public **Wandbox API**
- No API key is required by this project for the default Wandbox integration

## How code execution works

When you press **Run Code**, the UI sends your Java source and standard input to `/api/compile`. The Vercel serverless function:

1. Retrieves the currently available Java compiler list from Wandbox.
2. Selects an available OpenJDK compiler.
3. Submits the code to Wandbox's public compile endpoint.
4. Returns program output and compiler/runtime messages to the UI.

The integration uses these public endpoints:

- Compiler list: https://wandbox.org/api/list.json
- Compile code: https://wandbox.org/api/compile.json
- API documentation: https://github.com/melpon/wandbox/blob/master/kennel2/API.rst

Wandbox is a third-party service. Availability, execution limits, supported compiler versions, and its terms can change. A public API does not guarantee uninterrupted service. Do not submit secrets or sensitive data as source code or input.

## Troubleshooting\n\n- **“Compiler service returned an unreadable response”**: make sure the Vercel deployment is live at the URL above. GitHub Pages cannot host the serverless function itself.\n- **HTTP 502 / Wandbox unavailable**: the public Wandbox service may be temporarily unavailable or rate-limited; wait a little and retry.\n- **Compilation errors**: check the compiler output in the console. Keep the Java entry class named `Main`.\n- **Input-based programs**: enter values in Standard input, then press Run Code.\n\n## Run locally

IT'S NOT A VERCEL PROJECT ANYMORE!!!

This is a Vercel project. Install the Vercel CLI and start the development server:

```bash
npm install -g vercel
vercel dev
```

Open the local URL printed by the CLI. The `api/compile.js` serverless function will proxy compilation requests to Wandbox.

## Deploy to Vercel

1. Import this repository into Vercel.
2. Deploy the project using the repository root as the project root.
3. Ensure the deployment includes `api/compile.js`.
4. Open the deployed Vercel URL and test a simple Java program.

No `JUDGE0_API_URL` or `JUDGE0_API_KEY` environment variables are required for the Wandbox implementation.

## Security and reliability

Code submitted through this project is sent to Wandbox for compilation and execution. Use a reputable execution provider, respect its terms and limits, and avoid sending private data. If you expose the endpoint publicly, consider adding request rate limits to reduce abuse.

## License

MIT
