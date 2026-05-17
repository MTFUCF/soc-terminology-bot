# Copilot instructions for SOC Terminology Bot

SOC Terminology Bot is a focused cybersecurity portfolio project owned by Matthew Faber. The goal is straightforward: A static frontend plus Azure Functions placeholder backend for a SOC terminology chatbot that can explain security operations terms, acronyms, and workflow language in clear, beginner-friendly responses. Deployment target is Azure Static Web Apps with Azure Functions. The stack is HTML5, CSS3, Vanilla JavaScript, Azure Static Web Apps, Azure Functions (Node 20), Anthropic API. Keep the repo easy to review, easy to explain in an interview, and easy to deploy from a clean branch.

When helping here, bias toward the smallest useful implementation. Preserve the deliberate no-build-step approach for the frontend. If the project uses Azure Functions, keep Node tooling isolated to `api/` and do not introduce root-level package management. Prefer plain HTML, CSS, and vanilla JavaScript that a recruiter can understand quickly by opening the repo.

What Copilot should help with:
- Keep the bot tightly scoped to SOC terminology, acronyms, and workflow language.
- Write safe, plain-English API contracts and frontend states for loading, errors, and short answers.
- Make prompt and response handling easy to audit rather than magical.

Domain guardrail: This bot should define SOC language in plain English. It is not an incident responder, legal advisor, or threat intel oracle. Treat copy, labels, and examples as reviewable cybersecurity content, not filler text.

What to avoid:
- Do not turn this into a general security chatbot with vague answers.
- Do not hard-code API keys, secrets, or fake completions into the repo.
- Do not let the assistant confidently explain terms outside the documented glossary scope without clear guardrails.

Keep README examples, testing steps, and placeholder UI text aligned whenever scope changes. Environment variables belong in local `.env` files for development and Azure app settings for deployment. Only placeholder keys belong in `.env.example`. If you add data files later, keep them human-readable and stable so Matthew or another reviewer can audit the content without reverse engineering generated output.
