import { Bell, CalendarDays } from "lucide-react"
import { useApp } from "../../context/AppContext"

const viewMeta = {
  journal: { eyebrow: "Daily practice", title: "Journal workspace" },
  history: { eyebrow: "Your reflections", title: "History & reflections" },
  growth: { eyebrow: "Mindful progress", title: "Cognitive growth & insights" },
}

export default function Header({ children }) {
  const { currentView } = useApp()
  const meta = viewMeta[currentView]

  return (
    <header className="flex min-h-24 items-center justify-between gap-4 border-b border-[#D8D2C5]/70 bg-canvas/90 px-5 py-4 pl-16 backdrop-blur-md sm:px-8 sm:pl-20 lg:px-10 lg:pl-10">
      <div>
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
          {meta.eyebrow}
        </p>
        <p className="font-serif text-xl font-semibold text-ink sm:text-2xl">
          {meta.title}
        </p>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        {children}
        <div className="hidden items-center gap-2 rounded-xl border border-[#DED8CB] bg-white/60 px-3 py-2 text-xs font-semibold text-[#626A73] sm:flex">
          <CalendarDays size={15} />
          Jun 29, 2026
        </div>
        <button
          type="button"
          aria-label="Notifications"
          className="relative grid size-10 place-items-center rounded-xl border border-[#DED8CB] bg-white/60 text-[#626A73] transition hover:bg-white"
        >
          <Bell size={17} />
          <span className="absolute right-2.5 top-2.5 size-1.5 rounded-full bg-primary" />
        </button>
      </div>
    </header>
  )
}
