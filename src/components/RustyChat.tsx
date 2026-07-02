import { useState, useRef, useEffect } from "react"
import Icon from "@/components/ui/icon"
import funcUrls from "../../backend/func2url.json"

const AVATAR =
  "https://cdn.poehali.dev/projects/685425c0-c381-4903-9972-38d74c57227c/files/25946749-91d1-47a9-8496-ca3e9ed64f9f.jpg"

type Message = {
  role: "user" | "assistant"
  content: string
}

const SUGGESTIONS = [
  "Как быстро скрафтить базу?",
  "Какое оружие лучшее для рейда?",
  "Как настроить электричество?",
  "Что нужно для варки серы?",
]

export default function RustyChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Привет, выживший! Я Rusty AI — твой напарник по игре Rust. Спрашивай что угодно: крафт, рейды, оружие, электричество, базы. Чем помочь?",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, loading])

  const send = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const newMessages: Message[] = [...messages, { role: "user", content: trimmed }]
    setMessages(newMessages)
    setInput("")
    setLoading(true)

    try {
      const res = await fetch(funcUrls.chat, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })
      const data = await res.json()
      if (data.reply) {
        setMessages([...newMessages, { role: "assistant", content: data.reply }])
      } else {
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content:
              "Связь потеряна... Проверь, что API-ключ Mistral добавлен в проект, и попробуй снова.",
          },
        ])
      }
    } catch {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Ошибка соединения. Попробуй ещё раз." },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col h-[70vh] rounded-2xl border border-red-600/30 bg-black/60 backdrop-blur-sm rust-box-glow overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-red-600/20 bg-black/40">
        <img src={AVATAR} alt="Rusty AI" className="w-11 h-11 rounded-full object-cover rust-avatar-glow" />
        <div>
          <div className="font-semibold text-white flex items-center gap-2">
            Rusty AI
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </div>
          <div className="text-xs text-red-400/80 font-mono">эксперт по игре Rust</div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto chat-scroll px-4 py-5 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            {m.role === "assistant" && (
              <img src={AVATAR} alt="" className="w-8 h-8 rounded-full object-cover shrink-0 mt-1" />
            )}
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-red-600 text-white rounded-br-sm"
                  : "bg-white/5 text-gray-100 border border-red-600/15 rounded-bl-sm"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <img src={AVATAR} alt="" className="w-8 h-8 rounded-full object-cover shrink-0 mt-1" />
            <div className="bg-white/5 border border-red-600/15 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5">
              <span className="typing-dot w-2 h-2 rounded-full bg-red-500" />
              <span className="typing-dot w-2 h-2 rounded-full bg-red-500" style={{ animationDelay: "0.2s" }} />
              <span className="typing-dot w-2 h-2 rounded-full bg-red-500" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>
        )}
      </div>

      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="text-xs px-3 py-1.5 rounded-full border border-red-600/30 text-red-300 hover:bg-red-600/10 transition"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="p-4 border-t border-red-600/20 bg-black/40">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            send(input)
          }}
          className="flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Спроси Rusty AI о Rust..."
            className="flex-1 bg-white/5 border border-red-600/25 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-red-600/60 transition"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="shrink-0 w-12 h-12 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center text-white"
          >
            <Icon name="Send" size={20} />
          </button>
        </form>
      </div>
    </div>
  )
}