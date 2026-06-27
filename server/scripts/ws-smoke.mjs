import WebSocket from 'ws';

const BASE = 'http://localhost:4000';

async function login(email) {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'alumni123' }),
  });
  const json = await res.json();
  return json.token;
}

function connect(token, label) {
  return new Promise((resolve) => {
    const ws = new WebSocket(`ws://localhost:4000/ws?token=${token}`);
    ws.on('message', (d) => {
      const e = JSON.parse(d.toString());
      console.log(`[${label}] <-`, e.type, e.type === 'message:new' ? `"${e.message.text.en}" from ${e.message.senderId}` : '');
    });
    ws.on('open', () => {
      console.log(`[${label}] connected`);
      resolve(ws);
    });
  });
}

const meToken = await login('me@alumni.app');
const p2Token = await login('p2@alumni.app');

const me = await connect(meToken, 'me ');
const p2 = await connect(p2Token, 'p2 ');

await new Promise((r) => setTimeout(r, 300));
console.log('\n--- p2 sends a message to c_p2 ---');
p2.send(JSON.stringify({ type: 'message:send', conversationId: 'c_p2', text: 'Realtime hello from p2 👋', clientId: 'abc123' }));

await new Promise((r) => setTimeout(r, 600));
console.log('\n--- me sends a reply ---');
me.send(JSON.stringify({ type: 'message:send', conversationId: 'c_p2', text: 'Got it in real time!', clientId: 'def456' }));

await new Promise((r) => setTimeout(r, 600));
me.close();
p2.close();
process.exit(0);
