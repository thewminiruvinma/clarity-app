import { ArrowRight, Check, Eye, EyeOff, Sparkles } from "lucide-react"
import { useState } from "react"
import { useApp } from "../context/AppContext"

export default function AuthView() {
  const { authMode, setAuthMode, authenticate } = useApp()
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const isLogin = authMode === "login"

  const handleSubmit = (event) => {
    event.preventDefault()
    authenticate({
      name: form.name.trim().split(" ")[0] || "Maya",
      email: form.email || "maya@example.com",
    })
  }

  return (
    <main className="grid min-h-screen bg-canvas lg:grid-cols-2">
      <section className="relative hidden min-h-screen overflow-hidden bg-[#D9DDEB] p-12 lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div className="absolute -right-24 top-20 size-96 rounded-full bg-[#8CCFD0]/45 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 size-[32rem] rounded-full bg-[#8BA1D2]/45 blur-3xl" />
        <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(#5975BD_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="relative flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl bg-primary text-white shadow-xl shadow-[#5975BD]/20">
            <Sparkles size={22} />
          </span>
          <span className="font-serif text-3xl font-semibold text-ink">
            Clarity
          </span>
        </div>

        <div className="relative max-w-xl">
          <div className="mb-8 flex gap-3">
            {[0, 1, 2].map((item) => (
              <span
                key={item}
                className={`block h-1.5 rounded-full ${
                  item === 0 ? "w-14 bg-primary" : "w-5 bg-white/70"
                }`}
              />
            ))}
          </div>
          <blockquote className="font-serif text-4xl font-medium leading-tight text-ink xl:text-5xl xl:leading-tight">
            “Transform overthinking into clarity through structured Socratic
            reflection.”
          </blockquote>
          <p className="mt-6 max-w-md text-base leading-7 text-[#5C6572]">
            A private, compassionate space to untangle thoughts, notice
            patterns, and discover a calmer way forward.
          </p>
        </div>

        <div className="relative flex flex-wrap gap-5 text-xs font-semibold text-[#5C6572]">
          {["Private by design", "Evidence-based prompts", "No judgment"].map(
            (item) => (
              <span key={item} className="flex items-center gap-2">
                <span className="grid size-5 place-items-center rounded-full bg-white/70 text-primary">
                  <Check size={12} strokeWidth={3} />
                </span>
                {item}
              </span>
            ),
          )}
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-9 flex items-center gap-3 lg:hidden">
            <span className="grid size-10 place-items-center rounded-2xl bg-primary text-white">
              <Sparkles size={20} />
            </span>
            <span className="font-serif text-2xl font-semibold text-ink">
              Clarity
            </span>
          </div>

          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            {isLogin ? "Welcome back" : "Begin with one thought"}
          </p>
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-ink">
            {isLogin ? "Return to your space." : "Create your calm space."}
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            {isLogin
              ? "Your reflections are ready when you are."
              : "Start building a clearer relationship with your thoughts."}
          </p>

          <div className="mt-8 grid grid-cols-2 rounded-2xl bg-[#E9E5EF] p-1.5">
            {["login", "signup"].map((mode) => (
              <button
                type="button"
                key={mode}
                onClick={() => setAuthMode(mode)}
                className={`rounded-xl py-2.5 text-sm font-bold transition ${
                  authMode === mode
                    ? "bg-white text-ink shadow-sm"
                    : "text-muted"
                }`}
              >
                {mode === "login" ? "Log in" : "Sign up"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            {!isLogin && (
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-ink">
                  Full name
                </span>
                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="How should we greet you?"
                  className="w-full rounded-2xl border border-[#D7D1C6] bg-white/70 px-4 py-3.5 text-sm text-ink outline-none transition placeholder:text-[#9A9EA4] focus:border-primary focus:ring-4 focus:ring-[#5975BD]/10"
                />
              </label>
            )}
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-ink">
                Email address
              </span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-[#D7D1C6] bg-white/70 px-4 py-3.5 text-sm text-ink outline-none transition placeholder:text-[#9A9EA4] focus:border-primary focus:ring-4 focus:ring-[#5975BD]/10"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-ink">
                Password
              </span>
              <span className="relative block">
                <input
                  required
                  minLength={6}
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(event) =>
                    setForm({ ...form, password: event.target.value })
                  }
                  placeholder="At least 6 characters"
                  className="w-full rounded-2xl border border-[#D7D1C6] bg-white/70 px-4 py-3.5 pr-12 text-sm text-ink outline-none transition placeholder:text-[#9A9EA4] focus:border-primary focus:ring-4 focus:ring-[#5975BD]/10"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted hover:bg-[#F1EEE8]"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </span>
            </label>
            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#5975BD]/20 transition hover:bg-[#4E69AE]"
            >
              {isLogin ? "Enter your workspace" : "Create my account"}
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-[#DDD8CE]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
              Or continue with
            </span>
            <span className="h-px flex-1 bg-[#DDD8CE]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => authenticate({ name: "Maya" })}
              className="rounded-2xl border border-[#D7D1C6] bg-white/60 py-3 text-sm font-bold text-ink transition hover:bg-white"
            >
              Google
            </button>
            <button
              type="button"
              onClick={() => authenticate({ name: "Maya" })}
              className="rounded-2xl border border-[#D7D1C6] bg-white/60 py-3 text-sm font-bold text-ink transition hover:bg-white"
            >
              Apple
            </button>
          </div>
          <p className="mt-7 text-center text-[11px] leading-5 text-muted">
            By continuing, you agree to our Terms and acknowledge that Clarity
            is a reflection tool, not a substitute for professional care.
          </p>
        </div>
      </section>
    </main>
  )
}
