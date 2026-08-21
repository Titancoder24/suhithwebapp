import { useState, useRef, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { Om } from "@/components/Om";

const OPENERS = [
  "I need a pooja for my new home (Griha Pravesha)",
  "Which pooja for my daughter's birthday?",
  "Recommend a pooja for wealth & prosperity",
  "Suggest a Shubh Karya for a wedding blessing",
];

function sessionId() {
  let sid = localStorage.getItem("pc_ai_session");
  if (!sid) {
    sid = "sess_" + Math.random().toString(36).slice(2, 12) + Date.now().toString(36);
    localStorage.setItem("pc_ai_session", sid);
  }
  return sid;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "ॐ ನಮಸ್ಕಾರ · Om Namaskara. I am PuroMitra, your Vedic AI companion. Purohith Connect is dedicated to Shubh Karyas only — auspicious ceremonies for your family joys. Tell me the occasion — ಗೃಹಪ್ರವೇಶ (housewarming), ಮದುವೆ (wedding), ನಾಮಕರಣ (naming), birthday or festival — and I'll recommend the right pooja for your family tradition." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg) return;
    setMessages(m => [...m, { role: "user", content: msg }]);
    setInput("");
    setLoading(true);
    try {
      const { data } = await api.post("/ai/chat", { session_id: sessionId(), message: msg });
      setMessages(m => [...m, { role: "assistant", content: data.reply }]);
    } catch (e) {
      setMessages(m => [...m, { role: "assistant", content: "Sorry, I'm unable to reply right now. Please try again." }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="px-6 pt-6 pb-3 border-b border-warmBorder flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-saffron flex items-center justify-center">
          <Om className="text-white text-2xl" />
        </div>
        <div>
          <div className="font-heading text-lg text-ink">PuroMitra</div>
          <div className="text-xs text-muted2 font-sanskrit" lang="sa">श्री गुरुभ्यो नमः · Your pooja advisor</div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-32" data-testid="ai-chat-scroll">
        {messages.map((m, i) => (
          <div key={i} data-testid={`ai-msg-${m.role}-${i}`}
            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed
              ${m.role === "assistant"
                ? "bg-white border border-warmBorder text-ink"
                : "bg-saffron text-white ml-auto"}`}>
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-white border border-warmBorder text-sm text-muted2 animate-pulse">
            Thinking…
          </div>
        )}
        {messages.length === 1 && (
          <div className="pt-2">
            <div className="text-xs uppercase tracking-widest text-muted2 mb-2 px-1">Try asking</div>
            <div className="flex flex-col gap-2">
              {OPENERS.map((o, i) => (
                <button key={i} data-testid={`ai-suggestion-${i}`} onClick={()=>send(o)}
                  className="text-left bg-white border border-warmBorder rounded-xl px-4 py-3 text-sm text-ink hover:border-saffron transition-colors">
                  {o}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-3 bg-white/95 backdrop-blur-xl border-t border-warmBorder">
        <div className="flex gap-2">
          <Input
            data-testid="ai-input"
            value={input}
            onChange={(e)=>setInput(e.target.value)}
            onKeyDown={(e)=>{ if (e.key === "Enter") send(); }}
            placeholder="Type your question…"
            className="h-11 rounded-full bg-cotton border-warmBorder"
          />
          <Button data-testid="ai-send" onClick={()=>send()} disabled={loading}
            className="h-11 w-11 rounded-full bg-saffron hover:bg-saffron-dark p-0">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
