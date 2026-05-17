const STORAGE_KEY = 'soc-terminology-bot.conversation';
const welcomeMessage = {
  role: 'assistant',
  content: "I'm a SOC terminology helper. Ask me about acronyms (XDR vs EDR), workflows (what's MTTR?), or quiz me on a concept."
};
const elements = {
  messages: document.getElementById('messages'),
  chatForm: document.getElementById('chatForm'),
  messageInput: document.getElementById('messageInput'),
  clearChatButton: document.getElementById('clearChatButton'),
  sampleChips: document.getElementById('sampleChips'),
  statusPill: document.getElementById('statusPill')
};
let messages = loadMessages();
let sending = false;
renderMessages();
wireEvents();
function wireEvents() {
  elements.chatForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const prompt = elements.messageInput.value.trim();
    if (!prompt || sending) return;
    elements.messageInput.value = '';
    await sendMessage(prompt);
  });
  elements.clearChatButton.addEventListener('click', () => {
    messages = [welcomeMessage];
    saveMessages();
    renderMessages();
    setStatus('Cleared');
  });
  elements.sampleChips.querySelectorAll('[data-question]').forEach((button) => button.addEventListener('click', async () => {
    if (!sending) await sendMessage(button.dataset.question);
  }));
}
async function sendMessage(prompt) {
  messages.push({ role: 'user', content: prompt });
  saveMessages();
  renderMessages();
  setStatus('Thinking...');
  sending = true;
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: messages.map(({ role, content }) => ({ role, content })) })
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || 'Unable to reach the bot right now.');
    await streamAssistantMessage(payload.message?.content || 'No response received.');
    setStatus('Ready');
  } catch (error) {
    messages.push({ role: 'assistant', content: `Sorry — ${error.message}` });
    saveMessages();
    renderMessages();
    setStatus('Error');
  } finally {
    sending = false;
  }
}
async function streamAssistantMessage(content) {
  const placeholder = { role: 'assistant', content: '' };
  messages.push(placeholder);
  renderMessages(true);
  for (let index = 0; index < content.length; index += 1) {
    placeholder.content = content.slice(0, index + 1);
    renderMessages(true);
    await new Promise((resolve) => window.setTimeout(resolve, index < 80 ? 12 : 6));
  }
  saveMessages();
  renderMessages();
}
function renderMessages(typing = false) {
  elements.messages.innerHTML = messages.map((message, index) => {
    const label = message.role === 'assistant' ? 'Bot' : 'You';
    const typingClass = typing && index === messages.length - 1 && message.role === 'assistant' ? 'typing-cursor' : '';
    return `<article class="message ${message.role} ${typingClass}"><strong>${label}</strong>${escapeHtml(message.content)}</article>`;
  }).join('');
  elements.messages.scrollTop = elements.messages.scrollHeight;
}
function loadMessages() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    return Array.isArray(stored) && stored.length ? stored : [welcomeMessage];
  } catch {
    return [welcomeMessage];
  }
}
function saveMessages() { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); }
function setStatus(text) { elements.statusPill.textContent = text; }
function escapeHtml(value) { return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;'); }
