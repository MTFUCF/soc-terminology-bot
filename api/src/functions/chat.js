const { app } = require('@azure/functions');
const Anthropic = require('@anthropic-ai/sdk');

const MODEL = 'claude-haiku-4-5-20250101';
const SYSTEM_PROMPT = "You are a cybersecurity terminology helper for SOC analyst students. Define acronyms precisely (e.g., distinguish IOC from IOA, EDR from XDR from MDR, SIEM from SOAR). Use Microsoft Sentinel / Defender XDR terminology where applicable. Cite Microsoft Learn or MITRE when relevant. Refuse to give operational attack guidance — you teach defenders. Keep answers under 200 words unless asked to elaborate.";
function corsHeaders(request) {
  const origin = request.headers.get('origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin'
  };
}
function jsonResponse(request, status, body) {
  return {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(request) },
    jsonBody: body
  };
}
app.http('chat', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'chat',
  handler: async (request, context) => {
    if (request.method === 'OPTIONS') return { status: 204, headers: corsHeaders(request) };
    if (!process.env.ANTHROPIC_API_KEY) return jsonResponse(request, 500, { error: 'API key not configured (this is a demo project)' });
    let body;
    try { body = await request.json(); } catch { return jsonResponse(request, 400, { error: 'Request body must be valid JSON.' }); }
    const messages = Array.isArray(body?.messages)
      ? body.messages.filter((message) => ['user', 'assistant'].includes(message?.role) && typeof message?.content === 'string' && message.content.trim()).map((message) => ({ role: message.role, content: message.content.trim() }))
      : [];
    if (!messages.length) return jsonResponse(request, 400, { error: 'Provide at least one user message.' });
    try {
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const response = await anthropic.messages.create({ model: MODEL, system: SYSTEM_PROMPT, max_tokens: 600, temperature: 0.4, messages });
      const content = response.content.filter((block) => block.type === 'text').map((block) => block.text).join('\n\n').trim();
      return jsonResponse(request, 200, { message: { role: 'assistant', content: content || 'I do not have a safe short answer for that term yet.' } });
    } catch (error) {
      context.error('Anthropic request failed', error);
      const status = error?.status || error?.statusCode || 500;
      if (status === 429) return jsonResponse(request, 429, { error: 'rate limited, try again in a moment' });
      return jsonResponse(request, 500, { error: 'The terminology helper could not answer right now. Please try again.' });
    }
  }
});
