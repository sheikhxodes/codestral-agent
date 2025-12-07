# Codestral Agent

A code-executing AI agent built with **Codestral** (Mistral), **E2B** sandbox, and **Ant Design X**.

## Features

- **Code Execution**: Write and run Python code in a secure sandbox
- **Streaming Responses**: Real-time AI responses with Vercel AI SDK
- **Rich Results**: Display text output, images, and error tracebacks
- **Modern UI**: Clean chat interface with Ant Design X components

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
MISTRAL_API_KEY=your_mistral_api_key
E2B_API_KEY=your_e2b_api_key
```

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sheikhxodes/codestral-agent&env=MISTRAL_API_KEY,E2B_API_KEY)

## License

MIT
