# JavaLab Online Compiler ☕

A minimal, responsive Java practice editor with an OLED-style dark theme, standard input, and output/error display.

> **Status: NOT CURRENTLY WORKING**
>
> Running Java requires an available, authorized execution API. The previous Piston public API used by this project became whitelist-only in February 2026. The configured Judge0-compatible endpoint may also reject requests, be rate-limited, or require credentials. As a result, the Run Code feature will not work until a valid execution service is configured. This repository is published as an open-source starter project, not as a working hosted compiler.

## Features
- OLED-style dark UI
- Responsive mobile layout
- Java `Main` class editor
- Standard input field for `Scanner`
- Output and compilation-error display
- Vercel serverless API adapter

## Run locally
This is a Vercel project. Install the Vercel CLI and run:

```bash
npm i -g vercel
vercel dev
```

Open the local URL printed by the CLI.

## Configure the execution API
Set these environment variables in Vercel project settings:

- `JUDGE0_API_URL`: Base URL of a Judge0-compatible execution API you are authorized to use (default: `https://ce.judge0.com`)
- `JUDGE0_API_KEY`: Optional API token if your chosen provider requires one

The API adapter sends Java source using Judge0 language ID `62` (Java). Providers can have different authentication requirements; verify their documentation and terms before use. Never commit API keys to this repository.

## Deploy to Vercel
Import this repository into Vercel and deploy it. Add the required environment variables in **Project Settings → Environment Variables** before expecting execution to work.

## Security note
Do not expose an unrestricted execution endpoint without rate limits and sandboxing. Use a reputable, sandboxed execution provider or maintain your own isolated Judge0/Piston service.

## License
MIT
