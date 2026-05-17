# SOC Terminology Bot

A buildless Azure Static Web Apps project that pairs a clean chat UI with a single Azure Function calling Claude for short SOC terminology explanations.

## Features

- Chat interface with starter chips, persistent local conversation history, and clear button
- Welcome message that frames the bot as a SOC terminology helper
- Simulated streaming response UX with a typing cursor
- Single `POST /api/chat` Azure Function with explicit prompt guardrails
- Mobile-friendly vanilla JS frontend with an about/disclaimer section

## Configuration

Required environment variable:

- `ANTHROPIC_API_KEY` - required for the Azure Function to call Claude

Local setup:

```powershell
cd .\projects\soc-terminology-bot
Copy-Item .\api\local.settings.json.example .\api\local.settings.json
Copy-Item .\.env.example .\.env
npm install --prefix .\api
swa start . --api-location .\api
```

Azure setup:

```powershell
az staticwebapp appsettings set --name soc-terminology-bot --resource-group rg-soc-terminology-bot --setting-names ANTHROPIC_API_KEY="<your-key>"
```

## Tech stack

- Azure Static Web Apps
- Azure Functions (Node 20)
- Anthropic Claude API
- Vanilla JavaScript frontend
- No frontend build step

## Push to GitHub

This project ships as its own standalone repo. To push it to a GitHub account (e.g., a separate cybersecurity-portfolio account), follow these steps.

### 1) Authenticate with the target account

Preferred: use GitHub CLI multi-account auth.

```bash
gh auth login
gh auth switch
gh auth status
```

Per-repo git config keeps commits under the right identity even if your global git config points at another account:

```bash
git config user.name "Matthew Faber"
git config user.email "<your-github-username>@users.noreply.github.com"
```

The noreply email keeps your personal email private. Replace `<your-github-username>` with the target account username.

### 2) Initialize, commit, and push

From the workspace root:

```bash
cd projects/soc-terminology-bot
git init -b main
git config user.name "Matthew Faber"
git config user.email "<your-github-username>@users.noreply.github.com"
git add .
git commit -m "Initial commit"
gh repo create <your-github-username>/soc-terminology-bot --public --source=. --remote=origin --push --description "A buildless Azure Static Web Apps project that pairs a clean chat UI with a single Azure Function calling Claude for short SOC terminology explanations."
```

### 3) Create the Azure Static Web App

Create an Azure Static Web App via the Azure Portal or `az staticwebapp create`. When linking the GitHub repo, GitHub auto-injects the `AZURE_STATIC_WEB_APPS_API_TOKEN_*` secret. The included workflow `.github/workflows/azure-static-web-apps.yml` handles the rest.

After deploy, in the Azure Portal go to the Static Web App → Configuration → Application settings → add `ANTHROPIC_API_KEY` with your real key. The app is unusable without it.

### 4) Updating later

```bash
git add . && git commit -m "Describe the change" && git push
```

## Deploy

```powershell
cd .\projects\soc-terminology-bot
gh repo create <your-github-username>/soc-terminology-bot --public --source . --remote origin --push
az login
az extension add --name staticwebapp
az group create --name rg-soc-terminology-bot --location eastus2
az staticwebapp create --name soc-terminology-bot --resource-group rg-soc-terminology-bot --location eastus2 --source https://github.com/<your-github-username>/soc-terminology-bot --branch main --app-location "/" --api-location "api" --output-location ""
$token = az staticwebapp secrets list --name soc-terminology-bot --resource-group rg-soc-terminology-bot --query "properties.apiKey" -o tsv
gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN_SOC_TERMINOLOGY_BOT --body "$token"
```

Workflow file: `.github/workflows/azure-static-web-apps.yml`

Before deploying from GitHub Actions, add the deployment token secret shown above and configure `ANTHROPIC_API_KEY` in the Azure Static Web Apps portal or with `az staticwebapp appsettings set`.

## API contract

### `POST /api/chat`

Request body:

```json
{
  "messages": [
    { "role": "user", "content": "Explain SOAR vs SIEM" }
  ]
}
```

Success response:

```json
{
  "message": {
    "role": "assistant",
    "content": "..."
  }
}
```

Error behavior:

- Missing key -> `API key not configured (this is a demo project)`
- Anthropic 429 -> `rate limited, try again in a moment`

## Author

Matthew Faber
