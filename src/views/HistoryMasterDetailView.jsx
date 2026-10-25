import React, { useState } from "react"
import { CalendarDays, Search, Sparkles, Filter } from "lucide-react"
import { useApp } from "../context/AppContext"

export default function HistoryMasterDetailView() {
  const { entries, selectedEntry, setSelectedEntryId, isLoadingEntries } = useApp()
  const [searchTerm, setSearchTerm] = useState("")

  // Filter entries based on search input
  const filteredEntries = entries.filter((entry) =>
    entry.rawText.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoadingEntries) {
    return <div className="p-10 text-muted">Loading your reflections from database...</div>
  }

  return (
    <div className="p-5 sm:p-8 lg:p-10">
      {/* Header Section */}
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#69727D]">
            <Sparkles size={15} className="text-[#4D9F9A]" />
            Your reflections archive
          </div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            History & reflections
          </h1>
          <p className="mt-2 text-sm text-muted">
            Review past thoughts and your growth through Socratic dialogue.
          </p>
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

      {/* Tabs & Search Toolbar */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2 rounded-2xl bg-[#EFECE6] p-1.5 w-fit">
          <button className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-ink shadow-sm">
            Chat & Reflection History
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <Search size={16} className="absolute left-3 text-muted" />
            <input
              type="text"
              placeholder="Search entries or patterns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-72 rounded-2xl border border-[#D3CDC2] bg-white/65 pl-9 pr-4 py-2.5 text-xs text-ink outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Master-Detail Split Screen Layout */}
      <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        
        {/* LEFT COLUMN: Master List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">
              Past reflections ({filteredEntries.length})
            </span>
            <span className="text-xs font-bold text-primary">Live DB</span>
          </div>

          <div className="space-y-3 max-h-[650px] overflow-y-auto pr-1">
            {filteredEntries.length === 0 ? (
              <div className="rounded-2xl border border-lavender-border bg-white/55 p-6 text-center text-xs text-muted">
                No journal entries found matching your search.
              </div>
            ) : (
              filteredEntries.map((entry) => {
                const isSelected = selectedEntry?.id === entry.id;
                const formattedDate = new Date(entry.createdAt).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                });

                return (
                  <div
                    key={entry.id}
                    onClick={() => setSelectedEntryId(entry.id)}
                    className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                      isSelected
                        ? "border-primary bg-white shadow-md ring-1 ring-primary/20"
                        : "border-lavender-border bg-white/55 hover:bg-white/80"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-muted mb-2">
                      <span>{formattedDate}</span>
                      <span className="rounded-full bg-[#E4E9F4] text-primary px-2.5 py-0.5 text-[10px]">
                        {entry.clarityScore} clarity
                      </span>
                    </div>
                    <p className="text-xs font-medium text-ink line-clamp-2">
                      {entry.rawText}
                    </p>
                    
                    {entry.distortions?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {entry.distortions.map((d, i) => (
                          <span
                            key={i}
                            className="rounded-md bg-[#E8EAF4]/60 px-2 py-0.5 text-[10px] font-bold text-primary"
                          >
                            {d.distortionType}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Detail View */}
        <div className="rounded-[1.75rem] border border-lavender-border bg-white/70 p-6 sm:p-8 shadow-sm">
          {!selectedEntry ? (
            <div className="flex h-full min-h-[400px] items-center justify-center text-xs text-muted">
              Select a reflection from the left to view details.
            </div>
          ) : (
            <div>
              {/* Detail Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-lavender-border pb-5">
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-ink">
                    {new Date(selectedEntry.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </h2>
                  <p className="text-xs text-muted mt-1">
                    {new Date(selectedEntry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Clarity Score: {selectedEntry.clarityScore}/100
                  </p>
                </div>
                
                {selectedEntry.distortions?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedEntry.distortions.map((d, i) => (
                      <span
                        key={i}
                        className="rounded-xl bg-[#F2E8D0] px-3 py-1 text-xs font-bold text-[#9A743E]"
                      >
                        {d.distortionType}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Original Thought Section */}
              <div className="mt-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
                  Your Original Thought
                </span>
                <div className="mt-2 rounded-2xl border border-lavender-border bg-white p-5 text-sm leading-relaxed text-ink shadow-sm">
                  {selectedEntry.rawText}
                </div>
              </div>

              {/* Socratic Dialogue Section */}
              <div className="mt-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
                  Socratic Dialogue & Reframing
                </span>
                <div className="mt-2 space-y-3">
                  {selectedEntry.reflections?.length === 0 ? (
                    <div className="rounded-2xl border border-lavender-border bg-[#F9F7F2] p-4 text-xs text-muted">
                      No Socratic prompt generated for this entry.
                    </div>
                  ) : (
                    selectedEntry.reflections.map((ref, idx) => (
                      <div key={idx} className="rounded-2xl border border-[#DDF1EF] bg-[#F4FBFA] p-5">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#347F7C] mb-2">
                          <Sparkles size={14} />
                          AI Socratic Prompt
                        </div>
                        <p className="text-sm font-medium text-ink leading-relaxed">
                          {ref.socraticPrompt}
                        </p>
                        {ref.userResponse && (
                          <div className="mt-4 border-t border-[#DDF1EF] pt-3">
                            <span className="text-[10px] font-bold text-muted uppercase">Your Response:</span>
                            <p className="text-xs text-ink mt-1">{ref.userResponse}</p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  )
}