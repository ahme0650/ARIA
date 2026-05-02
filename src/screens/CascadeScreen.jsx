import { useEffect, useMemo, useState } from "react"
import { ArrowLeft, CheckCircle2, Clock3, MessageSquare, RadioTower, XCircle } from "lucide-react"

const contacts = [
  {
    key: "neighbor",
    name: "Ari Chen",
    role: "Neighbor",
    method: "SMS + apartment access code",
    baseStatus: "responding",
  },
  {
    key: "volunteer",
    name: "Jordan Lee",
    role: "Community Volunteer",
    method: "CERT radio channel 3",
    baseStatus: "notified",
  },
  {
    key: "emergency",
    name: "Station 4 Dispatch",
    role: "Local Emergency Services",
    method: "CAD case packet",
    baseStatus: "responding",
  },
  {
    key: "911",
    name: "911 Priority Desk",
    role: "Escalation Line",
    method: "Accessible evacuation flag",
    baseStatus: "notified",
  },
]

function buildMessage(contact, profile) {
  const topNeeds = profile.needs.slice(0, 3).join(", ")
  return `${contact.name}: ARIA priority ${profile.urgency.toUpperCase()} for ${profile.name}. Needs: ${topNeeds}. Communication: ${profile.communicationMethod}`
}

export default function CascadeScreen({ profile, setRole }) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => Math.min(current + 1, contacts.length - 1))
    }, 900)
    return () => window.clearInterval(timer)
  }, [])

  const feed = useMemo(
    () => [
      "ARIA triage profile verified against care registry.",
      `${profile.name}'s primary neighbor notified with access instructions.`,
      "Backup volunteer placed on standby for accessible transport.",
      "Responder briefing packet attached to dispatch queue.",
      "Escalation route to 911 remains armed if no response in 4 minutes.",
    ],
    [profile.name],
  )

  return (
    <main style={styles.page}>
      <button style={styles.backButton} onClick={() => setRole("landing")} type="button">
        <ArrowLeft size={18} />
        Role select
      </button>

      <header style={styles.header}>
        <div>
          <p style={styles.kicker}>Caregiver cascade</p>
          <h1 style={styles.title}>Mission control for trusted support</h1>
          <p style={styles.subtitle}>
            ARIA activates the right person first, then escalates through community and emergency channels.
          </p>
        </div>
        <div style={styles.statusBadge}>
          <RadioTower size={18} />
          Cascade live
        </div>
      </header>

      <section style={styles.layout}>
        <div style={styles.cascadePanel}>
          <div style={styles.caseStrip}>
            <strong>{profile.name}</strong>
            <span>{profile.location}</span>
            <span style={styles.urgency}>{profile.urgency}</span>
          </div>

          <div style={styles.cascadeGrid}>
            {contacts.map((contact, index) => {
              const active = index <= activeIndex
              const status = index < activeIndex ? contact.baseStatus : active ? "notified" : "queued"
              return (
                <article
                  key={contact.key}
                  style={{
                    ...styles.contactCard,
                    opacity: active ? 1 : 0.45,
                    transform: active ? "translateY(0)" : "translateY(16px)",
                    borderColor: active ? "rgba(245, 158, 11, 0.52)" : "rgba(248, 250, 252, 0.12)",
                    boxShadow: active ? "0 0 42px rgba(245, 158, 11, 0.18)" : "none",
                  }}
                >
                  <div style={styles.stepCircle}>{index + 1}</div>
                  <h2 style={styles.cardTitle}>{contact.name}</h2>
                  <p style={styles.role}>{contact.role}</p>
                  <p style={styles.method}>{contact.method}</p>
                  <div style={styles.statusLine}>
                    {status === "unavailable" ? <XCircle size={17} /> : status === "queued" ? <Clock3 size={17} /> : <CheckCircle2 size={17} />}
                    {status}
                  </div>
                  <div style={styles.messageBox}>
                    <MessageSquare size={17} />
                    <span>{buildMessage(contact, profile)}</span>
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        <aside style={styles.feedPanel}>
          <p style={styles.kicker}>Live activity feed</p>
          <h2 style={styles.feedTitle}>Status updates</h2>
          <div style={styles.feedList}>
            {feed.map((item, index) => (
              <div
                key={item}
                style={{
                  ...styles.feedItem,
                  opacity: index <= activeIndex + 1 ? 1 : 0.38,
                }}
              >
                <span style={styles.feedTime}>T+0{index}:1{index}</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <button style={styles.primaryButton} onClick={() => setRole("responder")} type="button">
            Open responder briefing
          </button>
        </aside>
      </section>
    </main>
  )
}

const styles = {
  page: {
    minHeight: "100svh",
    padding: 28,
    background:
      "radial-gradient(circle at top right, rgba(245, 158, 11, 0.19), transparent 30%), #0a0a0f",
    color: "#f8fafc",
    boxSizing: "border-box",
  },
  backButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    minHeight: 42,
    padding: "9px 13px",
    border: "1px solid rgba(248, 250, 252, 0.14)",
    borderRadius: 8,
    background: "rgba(15, 23, 42, 0.7)",
    color: "#e5e7eb",
    fontWeight: 800,
    cursor: "pointer",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 18,
    margin: "26px 0",
  },
  kicker: {
    margin: "0 0 8px",
    color: "#fbbf24",
    fontSize: 13,
    fontWeight: 950,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  title: {
    maxWidth: 860,
    margin: 0,
    color: "#ffffff",
    fontSize: "clamp(38px, 5vw, 68px)",
    lineHeight: 0.98,
    letterSpacing: 0,
  },
  subtitle: {
    maxWidth: 780,
    margin: "14px 0 0",
    color: "#d6d3d1",
    fontSize: 18,
    lineHeight: 1.5,
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 9,
    padding: "12px 14px",
    border: "1px solid rgba(245, 158, 11, 0.42)",
    borderRadius: 999,
    background: "rgba(120, 53, 15, 0.36)",
    color: "#fde68a",
    fontWeight: 950,
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.45fr) minmax(330px, 0.55fr)",
    gap: 18,
  },
  cascadePanel: {
    padding: 20,
    border: "1px solid rgba(248, 250, 252, 0.12)",
    borderRadius: 16,
    background: "rgba(15, 23, 42, 0.7)",
  },
  caseStrip: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 16,
    padding: 14,
    borderRadius: 12,
    background: "rgba(2, 6, 23, 0.62)",
    color: "#f8fafc",
  },
  urgency: {
    padding: "7px 10px",
    borderRadius: 999,
    background: "rgba(245, 158, 11, 0.18)",
    color: "#fbbf24",
    fontWeight: 950,
    textTransform: "uppercase",
  },
  cascadeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: 14,
  },
  contactCard: {
    minHeight: 300,
    padding: 18,
    border: "1px solid rgba(248, 250, 252, 0.12)",
    borderRadius: 14,
    background: "linear-gradient(160deg, rgba(30, 41, 59, 0.9), rgba(8, 13, 24, 0.9))",
    transition: "opacity 380ms ease, transform 380ms ease, box-shadow 380ms ease, border-color 380ms ease",
  },
  stepCircle: {
    display: "grid",
    placeItems: "center",
    width: 38,
    height: 38,
    borderRadius: "50%",
    background: "#f59e0b",
    color: "#0a0a0f",
    fontWeight: 950,
  },
  cardTitle: {
    margin: "18px 0 4px",
    color: "#ffffff",
    fontSize: 24,
  },
  role: {
    margin: 0,
    color: "#fbbf24",
    fontWeight: 900,
  },
  method: {
    minHeight: 45,
    margin: "12px 0",
    color: "#cbd5e1",
    lineHeight: 1.45,
  },
  statusLine: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 10px",
    borderRadius: 999,
    background: "rgba(245, 158, 11, 0.14)",
    color: "#fde68a",
    fontWeight: 900,
    textTransform: "uppercase",
    fontSize: 12,
  },
  messageBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: 9,
    marginTop: 14,
    padding: 12,
    borderRadius: 10,
    background: "rgba(2, 6, 23, 0.62)",
    color: "#e5e7eb",
    fontSize: 13,
    lineHeight: 1.45,
  },
  feedPanel: {
    padding: 20,
    border: "1px solid rgba(248, 250, 252, 0.12)",
    borderRadius: 16,
    background: "rgba(8, 13, 24, 0.88)",
  },
  feedTitle: {
    margin: "0 0 16px",
    color: "#ffffff",
  },
  feedList: {
    display: "grid",
    gap: 12,
    marginBottom: 18,
  },
  feedItem: {
    display: "grid",
    gap: 4,
    padding: 12,
    borderLeft: "3px solid #f59e0b",
    borderRadius: 10,
    background: "rgba(245, 158, 11, 0.1)",
    color: "#f8fafc",
    transition: "opacity 350ms ease",
  },
  feedTime: {
    color: "#fbbf24",
    fontSize: 12,
    fontWeight: 950,
  },
  primaryButton: {
    width: "100%",
    minHeight: 52,
    border: "1px solid #f59e0b",
    borderRadius: 10,
    background: "#f59e0b",
    color: "#0a0a0f",
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 950,
  },
}
