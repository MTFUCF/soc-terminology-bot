# Manual Testing Guide

Project: **SOC Terminology Bot**  
Baseline date: **2026-05-16**

## P0 — must pass before this repo is public
- [ ] The README title, tagline, live demo URL, and author block all match SOC Terminology Bot.
- [ ] The static shell loads from `python -m http.server 4280` with no broken relative links.
- [ ] `api/package.json` installs cleanly with `npm install` on Node 20.
- [ ] The placeholder Azure Function starts locally with `npm run start` once Azure Functions Core Tools are available.
- [ ] `.env.example` documents `ANTHROPIC_API_KEY` and nothing secret is committed.
- [ ] `staticwebapp.config.json` leaves `/api/ask-term` reachable and supports SPA-style refreshes.
- [ ] The placeholder function returns JSON shaped for a chat-style frontend, even before Claude integration exists.
- [ ] README language keeps the scope narrow: SOC terminology help, not general cybersecurity advice.

## P1 — should pass before first feature-complete share
- [ ] `staticwebapp.config.json` allows SPA-style refreshes without intercepting `/api/*` routes.
- [ ] The root page remains readable at 320px, 768px, and 1440px wide.
- [ ] Chrome and Edge show no console errors on initial load.
- [ ] The API placeholder response is plain JSON and easy for the future frontend to consume.
- [ ] The placeholder page leaves room for chat history, starter prompts, and error states.
- [ ] Copilot instructions explicitly say to keep prompt logic narrow and auditable.
- [ ] The repo documents secret handling clearly enough for a reviewer to trust it.
- [ ] The planned experience feels like a study tool, not a fake production SOC assistant.

## P2 — polish and follow-up checks
- [ ] Environment variables are documented in `.env.example` when the project needs them, but no real values are committed.
- [ ] The roadmap still separates immediate MVP work from later polish or content depth.
- [ ] The project can be published without adding a frontend build step unless future scope truly requires one.
- [ ] The placeholder page looks acceptable in both light and dark system themes.
- [ ] Roadmap items prioritize glossary quality and response guardrails over chatbot theatrics.
- [ ] The README has a clean placeholder for a screenshot of the eventual chat UI.
- [ ] The API stub is small enough to evolve safely once real prompt design begins.
- [ ] The shell leaves room for later rate-limit, fallback, and citation decisions without overcommitting now.
