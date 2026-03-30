import { useState, useEffect, useRef } from "react";

const ROAST_LEVELS = [
  { label: "Mild", emoji: "😏", value: 1 },
  { label: "Medium", emoji: "🔥", value: 2 },
  { label: "Brutal", emoji: "💀", value: 3 },
];

const PLACEHOLDER = `// paste your code here...
function getUserData(id) {
  var data = null;
  for (var i = 0; i < 99999; i++) {
    if (users[i].id == id) {
      data = users[i];
    }
  }
  return data;
}`;

const TAGLINES = [
  "Your code will not survive.",
  "We've seen better code in tutorials.",
  "Even Stack Overflow can't save you now.",
  "The roast is coming. Hide your variables.",
  "Your linter cried. We finished the job.",
];

function getRoastPrompt(code, level) {
  const intensity = {
    1: "You're a mildly sarcastic senior developer. Make a few light jokes but keep it friendly.",
    2: "You're a brutally honest tech lead who has seen too much bad code. Roast this code with sharp humor and no mercy.",
    3: "You're a savage code reviewer who has lost all patience for bad code. DESTROY this code with the most brutal, hilarious roast possible. Be merciless.",
  }[level];

  return `${intensity}

Here is the code to roast:
\`\`\`
${code}
\`\`\`

Structure your response EXACTLY like this:

🔥 THE ROAST:
[Your roast here - funny, savage, in character. 3-5 sentences.]

🧠 WHAT'S ACTUALLY WRONG:
[Now drop the act and explain the real issues clearly as a helpful developer. List 2-4 specific technical problems and how to fix them.]

⚡ QUICK FIX:
[Show a short improved version of the code or the key fix.]`;
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .rmc-app {
    min-height: 100vh;
    background: #0a0a0b;
    color: #f0ede8;
    font-family: 'Space Grotesk', sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  .rmc-orb {
    position: fixed; pointer-events: none; z-index: 0;
    border-radius: 50%; filter: blur(130px);
  }
  .rmc-orb1 { width: 560px; height: 560px; background: #ff4d00; opacity: 0.10; top: -180px; right: -80px; }
  .rmc-orb2 { width: 380px; height: 380px; background: #6600ff; opacity: 0.09; bottom: -80px; left: -80px; }

  .rmc-wrap { max-width: 860px; margin: 0 auto; padding: 0 24px 80px; position: relative; z-index: 1; }

  .rmc-header { padding: 52px 0 36px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 18px; }

  .rmc-badge {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 5px 14px; border-radius: 100px;
    background: rgba(255,77,0,0.1); border: 1px solid rgba(255,77,0,0.22);
    font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 500;
    color: #ff8c00; letter-spacing: 0.07em; text-transform: uppercase;
  }
  .rmc-dot { width: 6px; height: 6px; border-radius: 50%; background: #ff4d00; animation: rmcPulse 2s infinite; }

  .rmc-title { font-size: clamp(44px, 8vw, 72px); font-weight: 700; line-height: 1; letter-spacing: -0.03em; }
  .rmc-fire { background: linear-gradient(135deg, #ff4d00, #ff8c00, #ffb347); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

  .rmc-tagline { font-family: 'JetBrains Mono', monospace; font-size: 14px; color: #9b96a8; min-height: 20px; }
  .rmc-cursor { display: inline-block; width: 2px; height: 13px; background: #ff4d00; margin-left: 2px; vertical-align: middle; animation: rmcBlink 1s step-end infinite; }

  .rmc-stats { display: flex; justify-content: center; gap: 36px; padding: 18px 0 32px; border-bottom: 1px solid rgba(255,255,255,0.06); margin-bottom: 36px; }
  .rmc-stat-num { font-family: 'JetBrains Mono', monospace; font-size: 20px; font-weight: 700; color: #ff8c00; text-align: center; }
  .rmc-stat-lbl { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #6b6875; text-align: center; margin-top: 3px; letter-spacing: 0.06em; text-transform: uppercase; }

  .rmc-editor { background: #111113; border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; overflow: hidden; margin-bottom: 14px; transition: border-color 0.2s; }
  .rmc-editor:focus-within { border-color: rgba(255,77,0,0.28); }

  .rmc-topbar { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; background: #18181c; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .rmc-lights { display: flex; gap: 7px; }
  .rmc-l { width: 11px; height: 11px; border-radius: 50%; }
  .rmc-lr { background: #ff5f57; } .rmc-ly { background: #febc2e; } .rmc-lg { background: #28c840; }
  .rmc-filename { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #6b6875; }
  .rmc-linecount { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #6b6875; }

  .rmc-codewrap { display: flex; }
  .rmc-linenos { padding: 16px 12px; min-width: 44px; background: #18181c; border-right: 1px solid rgba(255,255,255,0.06); font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #6b6875; line-height: 1.7; text-align: right; user-select: none; }
  .rmc-textarea { flex: 1; padding: 16px; background: transparent; border: none; outline: none; resize: none; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #f0ede8; line-height: 1.7; min-height: 220px; caret-color: #ff4d00; }
  .rmc-textarea::placeholder { color: #6b6875; }

  .rmc-controls { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; padding: 12px 16px; background: #18181c; border-top: 1px solid rgba(255,255,255,0.06); }
  .rmc-int-lbl { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #6b6875; white-space: nowrap; }
  .rmc-lvls { display: flex; gap: 6px; }

  .rmc-lvl {
    padding: 6px 13px; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 500;
    border-radius: 8px; cursor: pointer; transition: all 0.15s;
    border: 1px solid rgba(255,255,255,0.1); background: transparent; color: #9b96a8;
    display: flex; align-items: center; gap: 5px;
  }
  .rmc-lvl:hover { border-color: rgba(255,77,0,0.35); color: #f0ede8; }
  .rmc-lvl.on { background: rgba(255,77,0,0.11); border-color: rgba(255,77,0,0.45); color: #ff8c00; }

  .rmc-btn {
    margin-left: auto; padding: 10px 22px;
    background: linear-gradient(135deg, #ff4d00, #ff8c00);
    border: none; border-radius: 10px;
    font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 600;
    color: #fff; cursor: pointer; letter-spacing: 0.02em;
    transition: opacity 0.15s, transform 0.1s; white-space: nowrap;
  }
  .rmc-btn:hover { opacity: 0.88; }
  .rmc-btn:active { transform: scale(0.97); }
  .rmc-btn:disabled { background: #18181c; color: #6b6875; border: 1px solid rgba(255,255,255,0.08); cursor: not-allowed; }

  .rmc-loading { text-align: center; padding: 44px 24px; display: flex; flex-direction: column; align-items: center; gap: 14px; }
  .rmc-flame { font-size: 38px; animation: rmcFlicker 0.55s ease-in-out infinite alternate; }
  .rmc-load-txt { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #9b96a8; }
  .rmc-bar { width: 190px; height: 2px; background: #18181c; border-radius: 2px; overflow: hidden; }
  .rmc-prog { height: 100%; background: linear-gradient(90deg, #ff4d00, #ff8c00); animation: rmcProg 1.8s ease-in-out infinite; }

  .rmc-results { display: flex; flex-direction: column; gap: 10px; margin-top: 4px; }

  .rmc-card { border-radius: 14px; overflow: hidden; border: 1px solid rgba(255,255,255,0.07); animation: rmcUp 0.35s ease forwards; opacity: 0; transform: translateY(10px); }
  .rmc-card:nth-child(1) { animation-delay: 0.04s; }
  .rmc-card:nth-child(2) { animation-delay: 0.13s; }
  .rmc-card:nth-child(3) { animation-delay: 0.22s; }

  .rmc-ch { padding: 9px 15px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .rmc-ch-fire { background: rgba(255,77,0,0.07); }
  .rmc-ch-brain { background: rgba(61,255,154,0.05); }
  .rmc-ch-fix { background: rgba(255,140,0,0.06); }

  .rmc-ci { font-size: 13px; }
  .rmc-cl { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 600; letter-spacing: 0.09em; text-transform: uppercase; }
  .rmc-cl-fire { color: #ff8c00; } .rmc-cl-brain { color: #3dff9a; } .rmc-cl-fix { color: #ffb347; }

  .rmc-cb { padding: 15px 17px; background: #111113; }
  .rmc-ct { font-size: 14px; line-height: 1.75; color: #f0ede8; white-space: pre-wrap; }
  .rmc-code { font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.7; color: #c9d1d9; white-space: pre-wrap; overflow-x: auto; background: #18181c; padding: 13px 15px; border-radius: 8px; margin: 0; }

  .rmc-err { padding: 12px 16px; background: rgba(255,77,0,0.07); border: 1px solid rgba(255,77,0,0.18); border-radius: 10px; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #ff8c00; margin-bottom: 12px; }

  .rmc-reset { display: inline-flex; align-items: center; gap: 6px; padding: 8px 15px; margin-top: 4px; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; cursor: pointer; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #9b96a8; transition: all 0.15s; }
  .rmc-reset:hover { border-color: rgba(255,255,255,0.18); color: #f0ede8; background: #18181c; }

  .rmc-footer { text-align: center; padding: 44px 0 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #6b6875; }
  .rmc-footer a { color: #9b96a8; text-decoration: none; }
  .rmc-footer a:hover { color: #ff8c00; }

  @keyframes rmcPulse { 0%,100%{opacity:1} 50%{opacity:0.25} }
  @keyframes rmcBlink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes rmcFlicker { 0%{transform:scale(1) rotate(-2deg)} 100%{transform:scale(1.12) rotate(2deg)} }
  @keyframes rmcProg { 0%{width:0;margin-left:0} 50%{width:55%;margin-left:0} 100%{width:0;margin-left:100%} }
  @keyframes rmcUp { to{opacity:1;transform:translateY(0)} }
`;

export default function RoastMyCode() {
  const [code, setCode] = useState("");
  const [roastLevel, setRoastLevel] = useState(2);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tagline, setTagline] = useState("");
  const [taglineIdx, setTaglineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [roastCount] = useState(Math.floor(Math.random() * 3000) + 12000);

  useEffect(() => {
    const current = TAGLINES[taglineIdx];
    if (charIdx < current.length) {
      const t = setTimeout(() => { setTagline(current.slice(0, charIdx + 1)); setCharIdx(c => c + 1); }, 46);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => { setTaglineIdx(i => (i + 1) % TAGLINES.length); setCharIdx(0); setTagline(""); }, 2600);
      return () => clearTimeout(t);
    }
  }, [charIdx, taglineIdx]);

  const lineCount = (code || PLACEHOLDER).split("\n").length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  async function handleRoast() {
    if (!code.trim()) return;
    setLoading(true); setResult(null); setError(null);
    try {
      const res = await fetch("ttps://roast-code-backend-3-uxwu.onrender.com/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: getRoastPrompt(code, roastLevel) }),
      });
      const data = await res.json();
      setResult(parseResponse(data.text || "No response received."));
    } catch {
      setError("Could not connect to server. Make sure your backend is running on :3001");
    } finally {
      setLoading(false);
    }
  }

  function parseResponse(text) {
    const r = text.match(/🔥 THE ROAST:\n([\s\S]*?)(?=🧠|$)/);
    const w = text.match(/🧠 WHAT'S ACTUALLY WRONG:\n([\s\S]*?)(?=⚡|$)/);
    const f = text.match(/⚡ QUICK FIX:\n([\s\S]*?)$/);
    return { roast: r?.[1]?.trim() || text, wrong: w?.[1]?.trim() || "", fix: f?.[1]?.trim() || "" };
  }

  const sel = ROAST_LEVELS.find(l => l.value === roastLevel);

  return (
    <>
      <style>{styles}</style>
      <div className="rmc-app">
        <div className="rmc-orb rmc-orb1" />
        <div className="rmc-orb rmc-orb2" />

        <div className="rmc-wrap">
          <header className="rmc-header">
            <div className="rmc-badge"><div className="rmc-dot" /> AI-Powered Code Review</div>
            <h1 className="rmc-title">Roast My <span className="rmc-fire">Code</span></h1>
            <p className="rmc-tagline">{tagline}<span className="rmc-cursor" /></p>
          </header>

          <div className="rmc-stats">
            <div><div className="rmc-stat-num">{roastCount.toLocaleString()}+</div><div className="rmc-stat-lbl">Roasts served</div></div>
            <div><div className="rmc-stat-num">3</div><div className="rmc-stat-lbl">Intensity levels</div></div>
            <div><div className="rmc-stat-num">0</div><div className="rmc-stat-lbl">Bad code survivors</div></div>
          </div>

          <div className="rmc-editor">
            <div className="rmc-topbar">
              <div className="rmc-lights"><div className="rmc-l rmc-lr"/><div className="rmc-l rmc-ly"/><div className="rmc-l rmc-lg"/></div>
              <span className="rmc-filename">your_code.js</span>
              <span className="rmc-linecount">{lineCount} lines</span>
            </div>
            <div className="rmc-codewrap">
              <div className="rmc-linenos">{lineNumbers.map(n => <div key={n}>{n}</div>)}</div>
              <textarea className="rmc-textarea" value={code} onChange={e => setCode(e.target.value)} placeholder={PLACEHOLDER} spellCheck={false} />
            </div>
            <div className="rmc-controls">
              <span className="rmc-int-lbl">intensity:</span>
              <div className="rmc-lvls">
                {ROAST_LEVELS.map(l => (
                  <button key={l.value} className={`rmc-lvl${roastLevel === l.value ? " on" : ""}`} onClick={() => setRoastLevel(l.value)}>
                    {l.emoji} {l.label}
                  </button>
                ))}
              </div>
              <button className="rmc-btn" onClick={handleRoast} disabled={loading || !code.trim()}>
                {loading ? "Roasting..." : `${sel.emoji} Roast It`}
              </button>
            </div>
          </div>

          {error && <div className="rmc-err">⚠ {error}</div>}

          {loading && (
            <div className="rmc-loading">
              <div className="rmc-flame">🔥</div>
              <div className="rmc-load-txt">Analyzing your crimes against clean code...</div>
              <div className="rmc-bar"><div className="rmc-prog" /></div>
            </div>
          )}

          {result && (
            <div className="rmc-results">
              <div className="rmc-card">
                <div className="rmc-ch rmc-ch-fire"><span className="rmc-ci">🔥</span><span className="rmc-cl rmc-cl-fire">The Roast</span></div>
                <div className="rmc-cb"><p className="rmc-ct">{result.roast}</p></div>
              </div>
              {result.wrong && (
                <div className="rmc-card">
                  <div className="rmc-ch rmc-ch-brain"><span className="rmc-ci">🧠</span><span className="rmc-cl rmc-cl-brain">What's actually wrong</span></div>
                  <div className="rmc-cb"><p className="rmc-ct">{result.wrong}</p></div>
                </div>
              )}
              {result.fix && (
                <div className="rmc-card">
                  <div className="rmc-ch rmc-ch-fix"><span className="rmc-ci">⚡</span><span className="rmc-cl rmc-cl-fix">Quick fix</span></div>
                  <div className="rmc-cb"><pre className="rmc-code">{result.fix}</pre></div>
                </div>
              )}
              <button className="rmc-reset" onClick={() => { setResult(null); setCode(""); }}>↩ Roast another one</button>
            </div>
          )}

          <footer className="rmc-footer">
            <p>Built with 🔥 and zero sympathy &nbsp;·&nbsp; <a href="https://github.com/mdnazishpatel">GitHub</a></p>
            <p>Built to roast by <a href="#">Sikandar</a> &nbsp;·&nbsp; just for fun 🔥</p>
          </footer>
        </div>
      </div>
    </>
  );
}
