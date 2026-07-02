import { useEffect, useState } from "react"
import Typewriter from "typewriter-effect"
import FlickeringGrid from "@/components/FlickeringGrid"
import RustyChat from "@/components/RustyChat"

const AVATAR =
  "https://cdn.poehali.dev/projects/685425c0-c381-4903-9972-38d74c57227c/files/25946749-91d1-47a9-8496-ca3e9ed64f9f.jpg"

export default function Index() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
      <main className="min-h-screen w-full bg-black text-white relative">
        <section className="h-screen flex items-center justify-center relative overflow-hidden snap-start">
          <FlickeringGrid
            className="absolute inset-0 z-0"
            color="rgb(255, 122, 0)"
            maxOpacity={0.12}
            squareSize={3}
            gridGap={5}
            flickerChance={0.2}
          />
          <div className="max-w-6xl mx-auto text-center relative z-10 px-4">
            <div className="relative flex flex-col items-center">
              <img
                src={AVATAR}
                alt="Rusty AI"
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover mb-8 rust-avatar-glow border-2 border-orange-500/40"
              />
              <h1 className="relative text-5xl md:text-7xl font-medium mb-6 tracking-tight text-white rust-glow">
                {mounted && (
                  <Typewriter
                    options={{
                      strings: ["Rusty AI"],
                      autoStart: true,
                      loop: false,
                      cursor: "",
                      wrapperClassName: "text-white",
                      deleteSpeed: 9999999,
                      delay: 80,
                    }}
                  />
                )}
              </h1>
              <p className="mt-2 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light">
                Твой личный AI-эксперт по игре Rust. Крафт, рейды, оружие,
                электричество и выживание — спроси о чём угодно.
              </p>
            </div>
          </div>
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
            <button
              onClick={() => {
                document.querySelector(".snap-y")?.scrollTo({
                  top: window.innerHeight,
                  behavior: "smooth",
                })
              }}
              aria-label="Перейти к чату"
              className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 transition-all duration-300 rounded-lg p-2"
            >
              <svg
                className="w-6 h-6 text-orange-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </button>
          </div>
        </section>

        <section className="min-h-screen py-16 px-4 md:px-6 snap-start bg-black flex flex-col justify-center relative overflow-hidden">
          <FlickeringGrid
            className="absolute inset-0 z-0"
            color="rgb(255, 122, 0)"
            maxOpacity={0.06}
            squareSize={3}
            gridGap={6}
            flickerChance={0.15}
          />
          <div className="max-w-3xl mx-auto w-full relative z-10">
            <div className="mb-8 text-center">
              <h2 className="text-2xl md:text-3xl text-white font-mono rust-glow">Чат с Rusty AI</h2>
              <div className="mt-2 w-20 h-px mx-auto bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
            </div>
            <RustyChat />
          </div>
        </section>
      </main>
    </div>
  )
}
