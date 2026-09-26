import React, { useState } from 'react'
import { phases, groundRule, goal, statusLabel } from './data.js'

const statusColor = {
  done: 'text-status-done border-status-done/40 bg-status-done/10',
  'in-progress': 'text-status-progress border-status-progress/40 bg-status-progress/10',
  'up-next': 'text-status-next border-status-next/40 bg-status-next/10',
}

const dotColor = {
  done: 'bg-status-done',
  'in-progress': 'bg-status-progress',
  'up-next': 'bg-status-next',
}

function ShieldMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2.5 4 5.5v6c0 5.2 3.4 8.9 8 10 4.6-1.1 8-4.8 8-10v-6l-8-3Z"
        stroke="#E3A64A"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="m8.5 12 2.4 2.4L15.5 9.6" stroke="#E3A64A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wide ${statusColor[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor[status]}`} />
      {statusLabel[status]}
    </span>
  )
}

function PhaseRailItem({ phase, active, onSelect }) {
  return (
    <button
      onClick={() => onSelect(phase.id)}
      aria-current={active ? 'true' : undefined}
      className={`group flex w-full items-start gap-3 border-l-2 px-4 py-3 text-left transition-colors ${active
          ? 'border-status-progress bg-base-raised'
          : 'border-transparent hover:border-base-line hover:bg-base-panel'
        }`}
    >
      <span className="mt-0.5 font-mono text-xs text-ink-faint">{phase.number}</span>
      <span className="min-w-0 flex-1">
        <span className={`block truncate text-sm font-medium ${active ? 'text-ink' : 'text-ink-muted group-hover:text-ink'}`}>
          {phase.title}
        </span>
        <span className="mt-1 flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotColor[phase.status]}`} />
          <span className="font-mono text-[10px] uppercase tracking-wide text-ink-faint">
            {statusLabel[phase.status]}
          </span>
          {phase.current && (
            <span className="font-mono text-[10px] uppercase tracking-wide text-status-flag">· here</span>
          )}
        </span>
      </span>
    </button>
  )
}

function CodeBlock({ comment, cmd }) {
  return (
    <div className="mt-3 overflow-hidden rounded-md border border-base-line bg-[#0A0F14]">
      {comment && (
        <div className="border-b border-base-line px-3.5 py-1.5 text-xs text-ink-faint"># {comment}</div>
      )}
      <pre className="scrollbar-thin overflow-x-auto px-3.5 py-2.5">
        <code className="font-mono text-[13px] leading-relaxed text-status-done">{cmd}</code>
      </pre>
    </div>
  )
}

function NotesSection({ note }) {
  const isThmDrill = /^extra drill/i.test(note.heading.trim())
  return (
    <div className="border-t border-base-line pt-6 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-base font-semibold text-ink">{note.heading}</h3>
        {isThmDrill && (
          <span className="inline-flex items-center gap-1 rounded-full border border-status-flag/40 bg-status-flag/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-status-flag">
            THM cross-ref
          </span>
        )}
      </div>
      <div className="mt-2.5 space-y-3">
        {note.paragraphs.map((p, i) => (
          <p key={i} className="text-[15px] leading-relaxed text-ink-muted">
            {p}
          </p>
        ))}
      </div>
      {note.commands?.map((c, i) => <CodeBlock key={i} comment={c.comment} cmd={c.cmd} />)}
    </div>
  )
}

function PhaseDetail({ phase }) {
  return (
    <article className="max-w-3xl">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-sm text-ink-faint">Phase {phase.number}</span>
        <StatusBadge status={phase.status} />
        {phase.current && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-status-flag/40 bg-status-flag/10 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wide text-status-flag">
            You are here
          </span>
        )}
      </div>

      <h1 className="mt-3 text-2xl font-semibold leading-snug text-ink sm:text-3xl">{phase.title}</h1>
      <p className="mt-2 max-w-prose text-ink-muted">{phase.summary}</p>

      <section className="mt-8">
        <h2 className="font-mono text-xs uppercase tracking-wide text-ink-faint">At a glance</h2>
        <ul className="mt-3 space-y-2.5 border-l border-base-line pl-4">
          {phase.objectives.map((item, i) => (
            <li key={i} className="max-w-prose text-[15px] leading-relaxed text-ink">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-wide text-ink-faint">Notes</h2>
        <div className="mt-4 space-y-6 rounded-lg border border-base-line bg-base-panel p-5">
          {phase.notes.map((note, i) => (
            <NotesSection key={i} note={note} />
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-mono text-xs uppercase tracking-wide text-ink-faint">Reference on TryHackMe</h2>
        {phase.thmRefs?.length ? (
          <ul className="mt-3 flex flex-wrap gap-2">
            {phase.thmRefs.map((room, i) => (
              <li
                key={`${room}-${i}`}
                className="rounded-md border border-base-line bg-base-panel px-3 py-1.5 text-sm text-ink-muted"
              >
                {room}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-ink-faint">No THM room mapped to this phase yet.</p>
        )}
        <p className="mt-2 text-xs text-ink-faint">
          Search these room or path names on tryhackme.com to work the guided exercises — the notes above are here
          so you don't have to keep tabbing over just to remember the syntax.
        </p>
      </section>

      <section className="mt-8 rounded-lg border border-base-line bg-base-panel p-5">
        <h2 className="font-mono text-xs uppercase tracking-wide text-ink-faint">
          Field journal — answer these yourself as you go
        </h2>
        <p className="mt-1.5 text-xs text-ink-faint">
          Work these on your own machine and VMs, then write the answers in your own notes. This page won&rsquo;t
          save anything.
        </p>
        <ol className="mt-4 space-y-4">
          {phase.journal.map((q, i) => (
            <li key={i} className="flex gap-3">
              <span className="font-mono text-sm text-status-progress">{String(i + 1).padStart(2, '0')}</span>
              <span className="max-w-prose text-[15px] leading-relaxed text-ink">{q}</span>
            </li>
          ))}
        </ol>
      </section>
    </article>
  )
}

export default function App() {
  const initial = phases.find((p) => p.current)?.id ?? phases[0].id
  const [activeId, setActiveId] = useState(initial)
  const activePhase = phases.find((p) => p.id === activeId) ?? phases[0]

  return (
    <div className="min-h-screen bg-base">
      <header className="border-b border-base-line bg-base/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <ShieldMark />
            <div>
              <h1 className="text-sm font-semibold leading-tight text-ink sm:text-base">
                Ethical Hacking Roadmap
              </h1>
              <p className="font-mono text-[11px] uppercase tracking-wide text-ink-faint">
                PAN Home Lab Edition
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 rounded-md border border-status-flag/30 bg-status-flag/5 px-3 py-2 text-xs text-ink-muted sm:text-sm">
            <span className="mt-0.5 font-mono text-status-flag">!</span>
            <span>{groundRule}</span>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col md:flex-row">
        <nav
          aria-label="Roadmap phases"
          className="scrollbar-thin shrink-0 overflow-x-auto border-b border-base-line md:w-64 md:overflow-y-auto md:border-b-0 md:border-r"
        >
          <div className="flex md:block">
            {phases.map((phase) => (
              <div key={phase.id} className="min-w-[200px] md:min-w-0">
                <PhaseRailItem phase={phase} active={phase.id === activeId} onSelect={setActiveId} />
              </div>
            ))}
          </div>

          <div className="hidden border-t border-base-line p-4 md:block">
            <h2 className="font-mono text-xs uppercase tracking-wide text-ink-faint">{goal.title}</h2>
            <ul className="mt-3 space-y-1.5">
              {goal.items.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-ink-muted">
                  <span className="h-1 w-1 rounded-full bg-ink-faint" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <main className="flex-1 px-4 py-8 sm:px-6 sm:py-10">
          <PhaseDetail phase={activePhase} />
        </main>
      </div>
    </div>
  )
}