import {
  BarChart3,
  ChevronLeft,
  HeartHandshake,
  LogOut,
  Menu,
  MessageCircle,
  PenTool,
  Sparkles,
  X,
} from "lucide-react"
import { useApp } from "../../context/AppContext"

const navItems = [
  { id: "journal", label: "Journal Workspace", icon: PenTool },
  { id: "history", label: "History & Reflections", icon: MessageCircle },
  { id: "growth", label: "Growth Analytics", icon: BarChart3 },
]

export default function Sidebar() {
  const {
    currentView,
    navigate,
    setEmergencyOpen,
    isSidebarOpen,
    setSidebarOpen,
    user,
    signOut,
  } = useApp()

  return (
    <>
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-[#2C343E]/30 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-lavender-border bg-[#EFECF4] p-5 transition-transform duration-300 lg:w-64 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <button
            type="button"
            className="flex items-center gap-3"
            onClick={() => navigate("journal")}
          >
            <span className="grid size-10 place-items-center rounded-2xl bg-primary text-white shadow-lg shadow-[#5975BD]/20">
              <Sparkles size={20} strokeWidth={2.2} />
            </span>
            <span className="text-left">
              <span className="block font-serif text-2xl font-semibold tracking-tight text-ink">
                Clarity
              </span>
              <span className="inline-flex rounded-full bg-white/70 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-primary">
                Mindful beta
              </span>
            </span>
          </button>
          <button
            type="button"
            aria-label="Close sidebar"
            className="rounded-xl p-2 text-muted hover:bg-white/70 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
          Your space
        </p>
        <nav className="space-y-1.5">
          {navItems.map(({ id, label, icon: Icon }) => {
            const active = currentView === id
            return (
              <button
                type="button"
                key={id}
                onClick={() => navigate(id)}
                className={`group flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left text-sm font-semibold transition-all ${
                  active
                    ? "bg-primary text-white shadow-md shadow-[#5975BD]/20"
                    : "text-[#56606D] hover:bg-white/70 hover:text-ink"
                }`}
              >
                <Icon size={18} strokeWidth={active ? 2.4 : 1.8} />
                <span>{label}</span>
                {active && (
                  <ChevronLeft className="ml-auto rotate-180" size={15} />
                )}
              </button>
            )
          })}
        </nav>

        <div className="mt-auto space-y-3">
          <button
            type="button"
            onClick={() => setEmergencyOpen(true)}
            className="flex w-full items-center gap-3 rounded-2xl border border-[#E9B8BC] bg-[#FFF5F4] px-3.5 py-3 text-left text-sm font-semibold text-[#9B4D55] transition hover:bg-[#FDE9E7]"
          >
            <span className="grid size-8 place-items-center rounded-xl bg-[#F7D8D7]">
              <HeartHandshake size={17} />
            </span>
            <span>
              <span className="block">Emergency Support</span>
              <span className="block text-[10px] font-medium opacity-70">
                Help is always here
              </span>
            </span>
          </button>

          <div className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/55 p-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-teal font-bold text-ink">
              {user.name.charAt(0)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold text-ink">
                {user.name} Chen
              </span>
              <span className="block truncate text-[11px] text-muted">
                Mindful member
              </span>
            </span>
            <button
              type="button"
              onClick={signOut}
              aria-label="Sign out"
              className="rounded-lg p-1.5 text-muted hover:bg-white hover:text-ink"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <button
        type="button"
        aria-label="Open navigation"
        onClick={() => setSidebarOpen(true)}
        className="fixed left-4 top-4 z-20 grid size-10 place-items-center rounded-xl border border-lavender-border bg-white/90 text-ink shadow-sm lg:hidden"
      >
        <Menu size={20} />
      </button>
    </>
  )
}
