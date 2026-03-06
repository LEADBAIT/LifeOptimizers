# LifeOptimizers

A TypeScript monorepo of personal productivity agents powered by Claude.

## Structure

```
/agents
  /email-summarizer     # Summarizes email threads via Gmail
/shared
  /integrations         # Reusable API clients (Google, etc.)
  /llm                  # Claude API wrapper
  /utils                # Shared utilities
/config                 # Shared configuration and env helpers
```

## Getting Started

1. Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build all packages:
   ```bash
   npm run build
   ```

## Agents

### email-summarizer
*(Coming soon)* Fetches recent emails from Gmail and produces concise summaries using Claude.

## Packages

### `@life-optimizers/llm`
A thin wrapper around the Anthropic SDK. Use `ask(prompt)` to get a Claude response.

### `@life-optimizers/integrations`
Reusable API clients for third-party services (Google OAuth, Gmail, Calendar, etc.).

### `@life-optimizers/utils`
Shared utility functions used across agents.

### `@life-optimizers/config`
Centralised environment variable loading and validation.
