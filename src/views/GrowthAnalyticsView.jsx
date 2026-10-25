import {
  ArrowUpRight,
  BrainCircuit,
  CalendarDays,
  ChevronDown,
  Lightbulb,
  Sparkles,
  Target,
} from "lucide-react"
import { useApp } from "../context/AppContext"

const toneClasses = {
  blue: "bg-[#E4E9F4] text-primary",
  teal: "bg-[#DDF1EF] text-[#347F7C]",
  lavender: "bg-[#E8E3EF] text-[#765E8E]",
  cream: "bg-[#F4EAD5] text-[#99713B]",
}

function TrendChart({ historyData }) {
  const width = 700
  const height = 260
  const x = (index) => 45 + index * (historyData.length > 1 ? 600 / (historyData.length - 1) : 100)
  const y = (value) => 225 - (value / 100) * 190
  
  const pathFor = (key) =>
    historyData
      .map((item, index) => `${index ? "L" : "M"} ${x(index)} ${y(item[key])}`)
      .join(" ")

  if (!historyData || historyData.length === 0) {
    return (
      <div className="mt-5 h-[260px] flex items-center justify-center text-xs text-muted">
        Not enough entries to plot trend graph yet. Add more journal entries!
      </div>
    )
  }

  return (
    <div className="mt-5 overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="min-w-[620px] w-full"
        role="img"
        aria-label="Clarity score and pattern frequency trend chart"
      >
        <defs>
          <linearGradient id="clarityFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5975BD" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#5975BD" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[25, 50, 75, 100].map((value) => (
          <g key={value}>
            <line
              x1="45"
              y1={y(value)}
              x2="635"
              y2={y(value)}
              stroke="#D8D3DE"
              strokeDasharray="4 6"
            />
            <text x="4" y={y(value) + 4} fill="#8A8F98" fontSize="10">
              {value}
            </text>
          </g>
        ))}
        {historyData.length > 1 && (
          <path
            d={`${pathFor("clarity")} L ${x(historyData.length - 1)} 225 L ${x(0)} 225 Z`}
            fill="url(#clarityFill)"
          />
        )}
        <path
          d={pathFor("clarity")}
          fill="none"
          stroke="#5975BD"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={pathFor("patterns")}
          fill="none"
          stroke="#4DA6A0"
          strokeWidth="3"
          strokeDasharray="7 7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {historyData.map((item, index) => (
          <g key={item.day || index}>
            <circle
              cx={x(index)}
              cy={y(item.clarity)}
              r="5"
              fill="#F9F7F2"
              stroke="#5975BD"
              strokeWidth="3"
            />
            <circle
              cx={x(index)}
              cy={y(item.patterns * 10)} 
              r="4"
              fill="#4DA6A0"
              stroke="#F9F7F2"
              strokeWidth="2"
            />
            <text
              x={x(index)}
              y="250"
              fill="#69727D"
              fontSize="11"
              fontWeight="600"
              textAnchor="middle"
            >
              {item.day}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

export default function GrowthAnalyticsView() {
  const { entries } = useApp()

  // 1. Calculate dynamic KPIs based on database entries
  const totalEntriesCount = entries.length
  
  const avgClarity = totalEntriesCount > 0
    ? Math.round(entries.reduce((acc, curr) => acc + (curr.clarityScore || 50), 0) / totalEntriesCount)
    : 0

  // Count total distortions across all backend entries
  let allDistortions = []
  entries.forEach(entry => {
    if (entry.distortions) {
      entry.distortions.forEach(d => allDistortions.push(d.distortionType))
    }
  })

  const distortionCounts = allDistortions.reduce((acc, type) => {
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {})

  const sortedDistortions = Object.entries(distortionCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({
      name,
      count,
      percent: Math.round((count / (allDistortions.length || 1)) * 100)
    }))

  const uniquePatternTypes = Object.keys(distortionCounts).length

  const kpis = [
    {
      label: "Total Reflections",
      value: totalEntriesCount,
      change: totalEntriesCount > 0 ? "Active journaling streak" : "No entries yet",
      tone: "blue"
    },
    {
      label: "Average Clarity Score",
      value: `${avgClarity}/100`,
      change: avgClarity >= 60 ? "Grounded perspective" : "Room for reframing",
      tone: "teal"
    },
    {
      label: "Patterns Identified",
      value: `${uniquePatternTypes} types`,
      change: `Across ${allDistortions.length} total occurrences`,
      tone: "lavender"
    },
    {
      label: "Reframing Success Rate",
      value: totalEntriesCount > 0 ? "100%" : "0%",
      change: "Socratic guidance active",
      tone: "cream"
    }
  ]

  // Map entries into chart format (chronological order)
  const chartHistory = [...entries].reverse().map((entry, idx) => ({
    day: new Date(entry.createdAt).toLocaleDateString('en-US', { weekday: 'short' }),
    clarity: entry.clarityScore || 50,
    patterns: entry.distortions?.length || 1
  }))

  const topDistortionName = sortedDistortions[0]?.name || "Balanced Thoughts"
  const topDistortionCount = sortedDistortions[0]?.count || 0

  return (
    <div className="p-5 sm:p-8 lg:p-10">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#69727D]">
            <Sparkles size={15} className="text-[#4D9F9A]" />
            Small shifts add up
          </div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Your week in perspective.
          </h1>
          <p className="mt-2 text-sm text-muted">
            A gentle look at the patterns you&apos;re learning to reshape.
          </p>
        </div>
        <button
          type="button"
          className="flex w-fit items-center gap-3 rounded-2xl border border-[#D3CDC2] bg-white/65 px-4 py-3 text-left"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-[#E8EAF4] text-primary">
            <CalendarDays size={17} />
          </span>
          <span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
              Database Status
            </span>
            <span className="block text-xs font-bold text-ink">
              Live MySQL Connected
            </span>
          </span>
          <ChevronDown size={15} className="text-muted" />
        </button>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {kpis.map((kpi, index) => {
          const Icon = [Sparkles, Target, BrainCircuit, ArrowUpRight][index]
          return (
            <div
              key={kpi.label}
              className="rounded-[1.5rem] border border-lavender-border bg-white/55 p-5 shadow-sm"
            >
              <div className="mb-5 flex items-start justify-between">
                <span
                  className={`grid size-10 place-items-center rounded-xl ${toneClasses[kpi.tone]}`}
                >
                  <Icon size={18} />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
                  Live Data
                </span>
              </div>
              <p className="text-xs font-bold text-muted">{kpi.label}</p>
              <p className="mt-1 font-serif text-3xl font-semibold text-ink">
                {kpi.value}
              </p>
              <p className="mt-3 text-[11px] font-bold text-[#347F7C]">
                {kpi.change}
              </p>
            </div>
          )
        })}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(350px,1fr)]">
        <div className="rounded-[1.75rem] border border-lavender-border bg-white/55 p-5 shadow-sm sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <p className="text-lg font-bold text-ink">Cognitive trends</p>
              <p className="mt-1 text-xs text-muted">
                How clarity changes as thought patterns soften
              </p>
            </div>
            <div className="flex flex-wrap gap-4 text-[10px] font-bold text-muted">
              <span className="flex items-center gap-2">
                <span className="h-0.5 w-5 rounded-full bg-primary" /> Clarity score
              </span>
              <span className="flex items-center gap-2">
                <span className="w-5 border-t-2 border-dashed border-[#4DA6A0]" /> Distortion count
              </span>
            </div>
          </div>
          <TrendChart historyData={chartHistory} />
        </div>

        <div className="rounded-[1.75rem] border border-lavender-border bg-panel p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <p className="text-lg font-bold text-ink">Pattern frequency</p>
              <p className="mt-1 text-xs text-muted">
                What showed up in your reflections
              </p>
            </div>
            <span className="rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-bold text-primary">
              {allDistortions.length} total
            </span>
          </div>
          <div className="space-y-5">
            {sortedDistortions.length === 0 ? (
              <p className="text-xs text-muted">No cognitive patterns recorded yet.</p>
            ) : (
              sortedDistortions.map((item, index) => (
                <div key={item.name}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-ink">
                      {item.name}
                    </span>
                    <span className="text-xs font-extrabold text-primary">
                      {item.count}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/80">
                    <div
                      className={`h-full rounded-full ${
                        index === 0
                          ? "bg-primary"
                          : index === 1
                            ? "bg-[#7187BE]"
                            : "bg-[#75C9CB]"
                      }`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-7 rounded-2xl border border-white bg-white/55 p-4">
            <div className="flex gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#F2E8D0] text-[#9A743E]">
                <Lightbulb size={17} />
              </span>
              <div>
                <p className="text-xs font-bold text-ink">
                  A pattern worth celebrating
                </p>
                <p className="mt-1 text-[11px] leading-5 text-muted">
                  {topDistortionCount > 0 
                    ? `You encountered "${topDistortionName}" ${topDistortionCount} time(s) this week. Recognition is becoming a strength.`
                    : `Keep journaling to track and observe your cognitive patterns over time.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}