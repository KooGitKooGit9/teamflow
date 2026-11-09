/* =====================================================================
   TeamFlow 실시간 협업 서버 (순수 Node, 외부 의존성 없음)
   - 정적 파일(index.html) 서빙
   - SSE(/events) 로 상태·커서·접속자 실시간 브로드캐스트
   - POST /state (상태 변경), POST /cursor (커서 위치)
   실행:  node server.js   →  브라우저에서 http://localhost:3000
   같은 네트워크의 다른 사람은 http://<이 컴퓨터 IP>:3000 으로 입장.
   ===================================================================== */
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = process.env.PORT || 3000;

/* Google Gemini 2.5 Flash 프록시 (API 키는 서버 환경변수 GEMINI_API_KEY 로만 보관) */
function askGemini(prompt){
  // ⚠️ 이 서버는 정적 파일을 그대로 서빙하므로 키를 파일(.env/gemini.key)로 두면 URL로 노출됨 → 반드시 환경변수로만 전달
  const key = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim();
  if(!key) return Promise.resolve({error:'AI를 사용하려면 서버에 GEMINI_API_KEY 환경변수를 설정해야 합니다.\n\n실행:  GEMINI_API_KEY=발급받은키 node server.js\n키 발급(무료):  https://aistudio.google.com/apikey\n\n※ 보안상 키는 반드시 환경변수로만 전달하세요. 키를 파일로 저장하면 이 서버가 정적 파일로 노출할 수 있습니다.'});
  const data = JSON.stringify({contents:[{parts:[{text:prompt}]}]});
  const opts = {hostname:'generativelanguage.googleapis.com',
    path:`/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,method:'POST',
    headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(data)}};
  return new Promise(resolve=>{
    const r = https.request(opts,resp=>{let b='';resp.on('data',d=>b+=d);resp.on('end',()=>{
      try{const j=JSON.parse(b);
        const t=j.candidates&&j.candidates[0]&&j.candidates[0].content&&j.candidates[0].content.parts[0].text;
        if(t) resolve({text:t}); else resolve({error:(j.error&&j.error.message)||'응답을 해석할 수 없습니다.'});
      }catch(e){resolve({error:'응답 파싱 실패'});}
    });});
    r.on('error',e=>resolve({error:e.message}));
    r.write(data);r.end();
  });
}
/* ---------- 조직/인증 (부서 코드는 서버에만 보관 — 클라이언트에 노출 금지) ---------- */
const ORGS = {
  '테크노바': {'개발팀':'DEV-4821','디자인팀':'DSN-3390','기획팀':'PLN-7015'},
  '그로스랩': {'마케팅팀':'MKT-2264','영업팀':'SLS-9107'},
  '블루오션': {'운영팀':'OPS-5543','고객지원팀':'CSP-8820'}
};
const crypto = require('crypto');
const sessions = new Map(); // token -> { ws, name, ts }

// 회사명::부서명 조합(workspace)별로 상태와 접속자를 완전히 분리해 관리
const workspaces = new Map(); // wsKey -> { state:null, clients:Map<id,{id,res,name,color}> }
function getWorkspace(key){
  if (!workspaces.has(key)) workspaces.set(key, { state:null, clients:new Map() });
  return workspaces.get(key);
}

/* ---------- 데이터 영속성 (서버 재시작해도 데이터 유지) ---------- */
const DATA_FILE = path.join(__dirname, 'teamflow-data.json');
try {
  const saved = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  for (const k in saved) getWorkspace(k).state = saved[k];
  console.log(`  저장된 데이터 로드: ${Object.keys(saved).length}개 작업공간 (${DATA_FILE})`);
} catch (e) { /* 파일 없으면 새로 시작 */ }
let saveTimer = null;
function persist(){
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    const d = {};
    for (const [k, ws] of workspaces) if (ws.state) d[k] = ws.state;
    fs.writeFile(DATA_FILE, JSON.stringify(d), err => { if (err) console.error('저장 실패:', err.message); });
  }, 300); // 연속 변경을 묶어서 저장 (디바운스)
}
// 아직 아무도 저장하지 않은(최초 상태) 작업공간에 접속했을 때 클라이언트에 보낼 기본 형태
function defaultState(){
  return {
    columns:[{id:'todo',title:'할 일',color:'#8a92a6'},{id:'doing',title:'진행 중',color:'#3d7eff'},{id:'done',title:'완료',color:'#2bb673'}],
    cards:[], todos:[], posts:[], chats:{}, notifications:[], members:[]
  };
}
function broadcast(ws, event, data, exceptId){
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const [id, c] of ws.clients) if (id !== exceptId) { try { c.res.write(payload); } catch(e){} }
}
function presenceList(ws){
  return [...ws.clients.values()].map(c => ({ id:c.id, name:c.name, color:c.color }));
}
function body(req){
  return new Promise(res => { let b=''; req.on('data',d=>b+=d); req.on('end',()=>res(b)); });
}

const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x');

  // --- 조직 목록 (부서 코드는 제외하고 회사→부서명만) ---
  if (u.pathname === '/orgs') {
    const out = {};
    for (const co in ORGS) out[co] = Object.keys(ORGS[co]);
    res.writeHead(200, {'Content-Type':'application/json','Cache-Control':'no-cache'});
    res.end(JSON.stringify(out)); return;
  }

  // --- 로그인 (부서 코드 검증은 서버에서만 수행) ---
  if (u.pathname === '/login' && req.method === 'POST') {
    const raw = await body(req);
    let p = {}; try { p = JSON.parse(raw); } catch(e){}
    const { company, dept, name, code } = p;
    res.writeHead(200, {'Content-Type':'application/json'});
    if (!company || !dept || !name || !code) { res.end(JSON.stringify({error:'모든 항목을 입력해주세요.'})); return; }
    const expected = (ORGS[company] || {})[dept];
    if (!expected || String(code).trim().toUpperCase() !== expected) {
      console.log(`[!] 로그인 실패: ${company}/${dept}/${name}`);
      res.end(JSON.stringify({error:'부서 코드가 올바르지 않습니다.'})); return;
    }
    const token = crypto.randomBytes(16).toString('hex');
    sessions.set(token, { ws: company + '::' + dept, name, ts: Date.now() });
    console.log(`[✓] 로그인: ${name} (${company}/${dept})`);
    res.end(JSON.stringify({ ok:true, token })); return;
  }

  // --- SSE 접속 (유효한 세션 토큰 필요) ---
  if (u.pathname === '/events') {
    const sess = sessions.get(u.searchParams.get('token'));
    if (!sess) { res.writeHead(401).end(); return; }
    const wsKey = sess.ws; // 작업공간은 세션에서 결정 (클라이언트 파라미터를 신뢰하지 않음)
    const id = u.searchParams.get('id');
    const name = sess.name;
    const color = u.searchParams.get('color') || '#3d7eff';
    const ws = getWorkspace(wsKey);
    res.writeHead(200, {
      'Content-Type':'text/event-stream','Cache-Control':'no-cache','Connection':'keep-alive'
    });
    res.write('retry: 3000\n\n');
    ws.clients.set(id, { id, res, name, color });
    // 최초 상태를 항상 전송 (저장된 게 없으면 빈 기본 상태) — 클라이언트가 "아직 응답 못 받음"과
    // "정말 빈 작업공간"을 헷갈려 빈 상태로 서버 데이터를 덮어쓰는 경쟁 조건을 방지
    res.write(`event: state\ndata: ${JSON.stringify(ws.state || defaultState())}\n\n`);
    // 같은 작업공간 접속자에게만 브로드캐스트
    broadcast(ws, 'presence', presenceList(ws));
    console.log(`[+] ${name} 입장 (${wsKey}, 현재 ${ws.clients.size}명)`);
    const ping = setInterval(()=>{ try{res.write(': ping\n\n');}catch(e){} }, 25000);
    req.on('close', () => {
      clearInterval(ping); ws.clients.delete(id);
      broadcast(ws, 'presence', presenceList(ws));
      console.log(`[-] ${name} 퇴장 (${wsKey}, 현재 ${ws.clients.size}명)`);
    });
    return;
  }

  // --- 상태 변경 (유효한 세션 토큰 필요) ---
  if (u.pathname === '/state' && req.method === 'POST') {
    const sess = sessions.get(u.searchParams.get('token'));
    if (!sess) { res.writeHead(401).end(); return; }
    const ws = getWorkspace(sess.ws);
    const raw = await body(req);
    try { ws.state = JSON.parse(raw); persist(); } catch(e){}
    const sender = u.searchParams.get('id');
    broadcast(ws, 'state', ws.state, sender); // 같은 작업공간에서 보낸 사람 제외하고 전파
    res.writeHead(204).end(); return;
  }

  // --- AI (Gemini 2.5 Flash) ---
  if (u.pathname === '/ai' && req.method === 'POST') {
    const raw = await body(req); let prompt='';
    try { prompt = JSON.parse(raw).prompt || ''; } catch(e){}
    const out = await askGemini(prompt);
    res.writeHead(200, {'Content-Type':'application/json'});
    res.end(JSON.stringify(out)); return;
  }

  // --- 커서 위치 (유효한 세션 토큰 필요 — 없으면 조용히 무시) ---
  if (u.pathname === '/cursor' && req.method === 'POST') {
    const raw = await body(req);
    let m; try { m = JSON.parse(raw); } catch(e){ res.writeHead(204).end(); return; }
    const sess = sessions.get(m.token);
    if (sess) { delete m.token; broadcast(getWorkspace(sess.ws), 'cursor', m, m.id); }
    res.writeHead(204).end(); return;
  }

  // --- 정적 파일 ---
  let file = u.pathname === '/' ? '/index.html' : u.pathname;
  // 민감 파일 노출 차단 (이 서버는 폴더의 파일을 그대로 서빙하므로 코드·데이터·키·백업을 막는다)
  const base = path.basename(file).toLowerCase();
  if (base.startsWith('.') || base === 'server.js' || base.endsWith('.key') ||
      base.endsWith('.bak') || base.includes('.bak.') || base.endsWith('.log') ||
      base.endsWith('.sh') || base.endsWith('.service') || base.endsWith('.json') || base.endsWith('.zip')) {
    res.writeHead(403, {'Content-Type':'text/plain'}); res.end('403 Forbidden'); return;
  }
  const fp = path.join(__dirname, path.normalize(file).replace(/^(\.\.[\/\\])+/,''));
  fs.readFile(fp, (err, data) => {
    if (err) { res.writeHead(404); res.end('404'); return; }
    const ext = path.extname(fp);
    const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css'};
    // 코드 수정 후 브라우저가 구버전 페이지를 캐시에서 계속 쓰는 일이 없도록 no-cache
    res.writeHead(200, {'Content-Type': types[ext] || 'application/octet-stream', 'Cache-Control': 'no-cache'});
    res.end(data);
  });
});

server.listen(PORT, () => {
  const ips = [].concat(...Object.values(os.networkInterfaces()))
    .filter(i => i.family === 'IPv4' && !i.internal).map(i => i.address);
  console.log(`\n  Relay 서버 실행 중`);
  console.log(`  ▶ 내 컴퓨터:   http://localhost:${PORT}`);
  ips.forEach(ip => console.log(`  ▶ 같은 네트워크: http://${ip}:${PORT}`));
  console.log(`\n  다른 사람이 위 주소로 접속하면 함께 편집할 수 있습니다.\n`);
});
