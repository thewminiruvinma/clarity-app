import { HeartHandshake, Phone, Wind, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useApp } from "../../context/AppContext"

export default function EmergencySupportModal() {
  const { isEmergencyOpen, setEmergencyOpen } = useApp()
  const [breathing, setBreathing] = useState(false)
  const [phase, setPhase] = useState("Breathe in")

  useEffect(() => {
    if (!breathing) return undefined
    const phases = ["Breathe in", "Hold softly", "Breathe out", "Rest"]
    let index = 0
    setPhase(phases[index])
    const timer = window.setInterval(() => {
      index = (index + 1) % phases.length
      setPhase(phases[index])
    }, 4000)
    return () => window.clearInterval(timer)
  }, [breathing])

  useEffect(() => {
    if (!isEmergencyOpen) return undefined
    const close = (event) => event.key === "Escape" && setEmergencyOpen(false)
    window.addEventListener("keydown", close)
    return () => window.removeEventListener("keydown", close)
  }, [isEmergencyOpen, setEmergencyOpen])

  if (!isEmergencyOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[#202936]/45 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-title"
      onMouseDown={(event) =>
        event.target === event.currentTarget && setEmergencyOpen(false)
      }
    >
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/70 bg-canvas shadow-2xl">
        <div className="bg-[#E6E2EF] px-6 py-7 sm:px-9">
          <button
            type="button"
            onClick={() => setEmergencyOpen(false)}
            aria-label="Close support dialog"
            className="absolute right-5 top-5 grid size-9 place-items-center rounded-full bg-white/65 text-muted transition hover:bg-white hover:text-ink"
          >
            <X size={18} />
          </button>
          <span className="mb-4 grid size-12 place-items-center rounded-2xl bg-white text-primary shadow-sm">
            <HeartHandshake size={24} />
          </span>
          <h2
            id="support-title"
            className="font-serif text-3xl font-semibold text-ink"
          >
            You&apos;re not alone.
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-6 text-[#5D6670]">
            If you&apos;re in immediate danger, call local emergency services.
            Free, confidential support is available every hour of every day.
          </p>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-9">
          <a
            href="tel:988"
            className="group rounded-2xl border border-lavender-border bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="mb-5 grid size-9 place-items-center rounded-xl bg-[#E5ECFA] text-primary">
              <Phone size={18} />
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
              24/7 Crisis Lifeline
            </p>
            <p className="mt-1 text-2xl font-bold text-ink">Call 1926</p>
            <p className="mt-2 text-xs leading-5 text-muted">
              National Mental Health Helpline.
            </p>
          </a>
          <a
            href="sms:741741?body=HOME"
            className="group rounded-2xl border border-lavender-border bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="mb-5 grid size-9 place-items-center rounded-xl bg-[#DDF4F2] text-[#347F7C]">
              <HeartHandshake size={18} />
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
              Crisis Text Line
            </p>
            <p className="mt-1 text-2xl font-bold text-ink">
              Text HOME to 741741
            </p>
            <p className="mt-2 text-xs leading-5 text-muted">
              Connect over text, at no cost.
            </p>
          </a>

          <div className="rounded-2xl border border-[#A7D8D5] bg-[#E5F5F3] p-5 sm:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className={`grid size-10 place-items-center rounded-xl bg-white text-[#347F7C] ${
                    breathing ? "animate-pulse" : ""
                  }`}
                >
                  <Wind size={20} />
                </span>
                <div>
                  <p className="font-bold text-ink">
                    Ground with a guided breath
                  </p>
                  <p className="text-xs text-muted">
                    A gentle 4-part cycle to return to the present.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBreathing((current) => !current)}
                className="rounded-xl bg-[#4D9F9A] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#3D8985]"
              >
                {breathing ? "Stop exercise" : "Begin breathing"}
              </button>
            </div>
            {breathing && (
              <div className="mt-5 flex items-center gap-4 rounded-xl bg-white/70 p-4">
                <span className="size-10 animate-[pulse_4s_ease-in-out_infinite] rounded-full border-4 border-teal bg-white" />
                <div>
                  <p className="font-serif text-xl font-semibold text-ink">
                    {phase}
                  </p>
                  <p className="text-xs text-muted">
                    Follow the circle and let your shoulders soften.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="border-t border-[#E2DDD1] px-6 py-4 text-center sm:px-9">
          <button
            type="button"
            className="text-sm font-bold text-primary hover:underline"
            onClick={() => setEmergencyOpen(false)}
          >
            I&apos;m ready to return to my workspace
          </button>
        </div>
      </div>
    </div>
  )
}
