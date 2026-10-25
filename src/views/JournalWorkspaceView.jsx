import React, { useState } from "react"
import { Sparkles, CalendarDays, ArrowRight, BrainCircuit } from "lucide-react"
import { useApp } from "../context/AppContext"

export default function JournalView() {
  const { entries, addEntry, isLoadingEntries, user } = useApp()
  const [newEntryText, setNewEntryText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Retrieve user name from AppContext or fallback to localStorage
  const userName = user?.name || localStorage.getItem('userName') || 'Maya'

  // Get latest stats for top KPI badges
  const latestEntry = entries[0] || null
  const totalEntries = entries.length
  const avgClarity = totalEntries > 0
    ? Math.round(entries.reduce((acc, curr) => acc + (curr.clarityScore || 50), 0) / totalEntries)
    : 72

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newEntryText.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      await addEntry(newEntryText)
      setNewEntryText("")
    } catch (err) {
      console.error("Error saving entry:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoadingEntries) {
    return <div className="p-10 text-muted">Loading your journal workspace...</div>
  }

  return (
    <div className="p-5 sm:p-8 lg:p-10">
      {/* Top Header */}
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#69727D]">
            <Sparkles size={15} className="text-[#4D9F9A]" />
            DAILY PRACTICE
          </div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Journal workspace
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-[#D3CDC2] bg-white/65 px-4 py-3">
            <span className="grid size-9 place-items-center rounded-xl bg-[#E8EAF4] text-primary">
              <CalendarDays size={17} />
            </span>
            <span className="text-xs font-bold text-ink">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* Greeting & Metrics Banner */}
      <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted">A gentle moment to check in</p>
          <h2 className="font-serif text-3xl font-semibold text-ink mt-1">
            Good afternoon, {userName}.
          </h2>
          <p className="text-sm text-muted mt-1">What&apos;s taking up the most space in your mind today?</p>
        </div>

        {/* Top Right Badges matching Figma */}
        <div className="flex items-center gap-4">
          <div className="rounded-[1.5rem] border border-lavender-border bg-white/70 px-5 py-3 shadow-sm flex items-center gap-4">
            <div className="relative grid size-11 place-items-center rounded-full bg-[#E8EAF4] text-primary font-bold text-sm">
              {avgClarity}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">Today&apos;s Clarity</span>
              <span className="text-xs font-bold text-ink">{avgClarity} / 100</span>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-lavender-border bg-white/70 px-5 py-3 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">Weekly Rhythm</span>
            <span className="text-xs font-bold text-ink">{totalEntries} entries recorded</span>
          </div>
        </div>
      </div>

      {/* Main Split Grid: Left = Writing Form & Entries, Right = Socratic Companion */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(350px,1fr)]">
        
        {/* LEFT COLUMN: Open Journal Input & Recent Submission Feed */}
        <div className="space-y-6">
          <div className="rounded-[1.75rem] border border-lavender-border bg-white/75 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-ink flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary" /> Open Journal
              </span>
              <span className="text-[11px] text-muted">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-xs text-muted mb-4">Write freely. This space is yours.</p>

            <form onSubmit={handleSubmit}>
              <textarea
                value={newEntryText}
                onChange={(e) => setNewEntryText(e.target.value)}
                placeholder="Release your stream of consciousness thoughts here..."
                className="w-full rounded-2xl border border-lavender-border bg-[#F9F7F2] p-4 text-sm text-ink outline-none focus:border-primary min-h-[140px] resize-y"
                rows={4}
              />
              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !newEntryText.trim()}
                  className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-primary/90 disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? "Analyzing..." : "Analyze & Reflect"}
                  <ArrowRight size={15} />
                </button>
              </div>
            </form>
          </div>

          {/* Recent Database Entries Feed */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted px-1">Recent Reflections</h3>
            {entries.length === 0 ? (
              <div className="rounded-2xl border border-lavender-border bg-white/55 p-6 text-center text-xs text-muted">
                No entries saved yet. Write your first thought above!
              </div>
            ) : (
              entries.slice(0, 3).map((entry) => {
                const reflection = entry.reflections?.[0];
                return (
                  <div key={entry.id} className="rounded-2xl border border-lavender-border bg-white/60 p-5 shadow-sm">
                    <div className="flex items-center justify-between text-xs text-muted mb-2">
                      <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                      <span className="rounded-full bg-[#E4E9F4] px-2.5 py-0.5 font-bold text-primary text-[10px]">
                        {entry.clarityScore} clarity
                      </span>
                    </div>
                    <p className="text-sm font-medium text-ink">{entry.rawText}</p>
                    
                    {reflection && (
                      <div className="mt-3 rounded-xl bg-[#F4FBFA] border border-[#DDF1EF] p-4 text-xs text-[#347F7C]">
                        <strong>Socratic Prompt:</strong> {reflection.socraticPrompt}
                        
                        {reflection.userResponse ? (
                          <div className="mt-3 border-t border-[#DDF1EF] pt-2 text-ink">
                            <span className="font-bold text-[10px] uppercase text-muted block">Your Reply:</span>
                            <p className="mt-1">{reflection.userResponse}</p>
                          </div>
                        ) : (
                          <div className="mt-3">
                            <input
                              type="text"
                              placeholder="Write your reflection response..."
                              className="w-full rounded-xl border border-[#347F7C]/30 bg-white p-2.5 text-xs text-ink outline-none focus:border-primary"
                              onKeyDown={async (e) => {
                                if (e.key === 'Enter' && e.target.value.trim()) {
                                  const userResponseText = e.target.value;
                                  const token = localStorage.getItem('token');
                                  
                                  try {
                                    const res = await fetch('http://localhost:5000/api/journal/reflections', {
                                      method: 'POST',
                                      headers: {
                                        'Authorization': `Bearer ${token || 'dev_dummy_token'}`,
                                        'Content-Type': 'application/json',
                                      },
                                      body: JSON.stringify({
                                        reflectionId: reflection.id,
                                        userResponse: userResponseText,
                                      }),
                                    });
                                    
                                    if (res.ok) {
                                      window.location.reload();
                                    }
                                  } catch (err) {
                                    console.error('Failed to save reflection response:', err);
                                  }
                                }
                              }}
                            />
                            <span className="text-[10px] text-muted mt-1 block">Press Enter to submit your reply</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Socratic Companion Box */}
        <div className="rounded-[1.75rem] border border-lavender-border bg-panel p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-ink flex items-center gap-2">
                  <BrainCircuit size={18} className="text-primary" /> Socratic companion
                </h3>
                <p className="text-xs text-muted mt-1">A thoughtful mirror, not a verdict</p>
              </div>
              <span className="rounded-full bg-white/70 px-3 py-1 text-[10px] font-bold text-[#347F7C] border border-[#347F7C]/20">
                ● Present
              </span>
            </div>

            <div className="rounded-2xl border border-white bg-white/70 p-6 text-center my-8">
              <span className="grid size-12 mx-auto place-items-center rounded-2xl bg-[#E8EAF4] text-primary mb-4 shadow-sm">
                <Sparkles size={22} />
              </span>
              <h4 className="font-serif text-xl font-semibold text-ink">Ready when you are.</h4>
              <p className="text-xs text-muted mt-2 leading-relaxed max-w-xs mx-auto">
                Write what&apos;s on your mind, then invite a gentler perspective with Analyze & Reflect.
              </p>
            </div>
          </div>

          {latestEntry && latestEntry.reflections?.[0] && (
            <div className="rounded-2xl border border-lavender-border bg-white/60 p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Latest Insight</span>
              <p className="text-xs font-medium text-ink italic">&ldquo;{latestEntry.reflections[0].socraticPrompt}&rdquo;</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}