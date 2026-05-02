import { useMemo, useState } from "react"
import { ArrowLeft, Filter, Search, ShieldCheck, Siren } from "lucide-react"
import useIsMobile from "../useIsMobile"

function buildCases(profile) {
  return [
    {
      id: "ARIA-2407",
      name: profile.name,
      urgency: profile.urgency,
      location: profile.location,
      needs: profile.needs,
      disabilities: profile.disabilities?.length ? profile.disabilities : ["Non-speaking", "Mobility disability"],
      medicalDependencies: profile.medicalDependencies,
      communicationMethod: profile.communicationMethod,
      responderGuidance: profile.responderGuidance,
      doNotDo: profile.doNotDo || [
        "Do not separate resident from assistive device.",
        "Do not rush written or AAC responses.",
      ],
      approachSteps: profile.approachSteps || [
        "Show identification.",
        "Use yes/no prompts.",
        "Bring mobility device and charger.",
      ],
    },
    {
      id: "ARIA-2408",
      name: "Devon Patel",
      urgency: "critical",
      location: "East Riverside shelter overflow, bay C",
      needs: ["Oxygen support", "Power backup", "Caregiver separated"],
      disabilities: ["COPD", "Limited mobility"],
      medicalDependencies: ["Portable oxygen concentrator", "Battery runtime under 25 minutes"],
      communicationMethod: "Speak slowly, keep resident seated upright, confirm breathing comfort every 2 minutes.",
      responderGuidance:
        "Prioritize oxygen continuity and generator access. Move with concentrator, tubing, charger, and medication pouch.",
      doNotDo: ["Do not lay resident flat.", "Do not remove oxygen support during transfer.", "Do not send to non-powered holding area."],
      approachSteps: ["Assess airway and oxygen saturation.", "Secure power source.", "Coordinate wheelchair transport.", "Notify medical unit on arrival."],
    },
    {
      id: "ARIA-2411",
      name: "Lena Brooks",
      urgency: "high",
      location: "North Loop Apartments, lobby",
      needs: ["Deaf communication", "Flood evacuation", "Service animal present"],
      disabilities: ["Deaf", "Uses service animal"],
      medicalDependencies: ["Medication kit in backpack"],
      communicationMethod: "Face Lena, use written instructions, gestures, and visual confirmation. Keep service animal with her.",
      responderGuidance:
        "Use a notepad or phone screen for instructions. Ensure the service animal boards transport with Lena.",
      doNotDo: ["Do not separate service animal.", "Do not shout from behind.", "Do not rely on radio-only instructions."],
      approachSteps: ["Approach from the front.", "Write concise instructions.", "Confirm destination visually.", "Load resident and service animal together."],
    },
    {
      id: "ARIA-2415",
      name: "Samira Wells",
      urgency: "medium",
      location: "West Campus cooling center",
      needs: ["Vision impairment", "Medication reminder", "Family contact"],
      disabilities: ["Low vision"],
      medicalDependencies: ["Insulin kit"],
      communicationMethod: "Introduce yourself by name, describe surroundings, offer elbow guidance, and narrate every movement.",
      responderGuidance:
        "Keep medication with resident and provide clear verbal orientation. Confirm family contact number before relocation.",
      doNotDo: ["Do not grab without consent.", "Do not point silently.", "Do not move medication into separate storage."],
      approachSteps: ["Announce yourself.", "Ask permission before guiding.", "Secure medication.", "Confirm transport destination verbally."],
    },
  ]
}

const urgencyRank = { critical: 0, high: 1, medium: 2 }

export default function ResponderScreen({ profile, setRole }) {
  const isMobile = useIsMobile()
  const [selectedId, setSelectedId] = useState("ARIA-2407")
  const [query, setQuery] = useState("")
  const [urgencyFilter, setUrgencyFilter] = useState("all")
  const [needFilter, setNeedFilter] = useState("all")

  const cases = useMemo(() => buildCases(profile), [profile])
  const needTypes = useMemo(() => [...new Set(cases.flatMap((item) => item.needs))], [cases])

  const visibleCases = cases
    .filter((item) => urgencyFilter === "all" || item.urgency === urgencyFilter)
    .filter((item) => needFilter === "all" || item.needs.includes(needFilter))
    .filter((item) => `${item.name} ${item.location} ${item.needs.join(" ")}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => urgencyRank[a.urgency] - urgencyRank[b.urgency])

  const selectedCase = cases.find((item) => item.id === selectedId) || visibleCases[0] || cases[0]

  return (
    <main style={sx(styles.page, isMobile, mobileStyles.page)}>
      <button style={styles.backButton} onClick={() => setRole("landing")} type="button">
        <ArrowLeft size={18} />
        Role select
      </button>

      <header style={sx(styles.header, isMobile, mobileStyles.header)}>
        <div>
          <p style={styles.kicker}>Responder command center</p>
          <h1 style={sx(styles.title, isMobile, mobileStyles.title)}>Active accessibility-aware cases</h1>
        </div>
        <div style={styles.onlineBadge}>
          <ShieldCheck size={18} />
          Field guidance synchronized
        </div>
      </header>

      <section style={sx(styles.toolbar, isMobile, mobileStyles.toolbar)}>
        <label style={styles.searchBox}>
          <Search size={18} />
          <input
            style={styles.input}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search cases, needs, locations"
            value={query}
          />
        </label>
        <label style={styles.selectBox}>
          <Filter size={18} />
          <select style={styles.select} onChange={(event) => setUrgencyFilter(event.target.value)} value={urgencyFilter}>
            <option value="all">All urgency</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
          </select>
        </label>
        <select style={styles.selectWide} onChange={(event) => setNeedFilter(event.target.value)} value={needFilter}>
          <option value="all">All need types</option>
          {needTypes.map((need) => (
            <option key={need} value={need}>
              {need}
            </option>
          ))}
        </select>
      </section>

      <section style={sx(styles.layout, isMobile, mobileStyles.layout)}>
        <div style={styles.caseList}>
          {visibleCases.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              style={{
                ...styles.caseCard,
                borderColor: selectedCase.id === item.id ? "#22c55e" : "rgba(248, 250, 252, 0.12)",
                boxShadow: selectedCase.id === item.id ? "0 0 34px rgba(34, 197, 94, 0.18)" : "none",
              }}
              type="button"
            >
              <div style={styles.caseTopline}>
                <span style={styles.caseId}>{item.id}</span>
                <span style={{ ...styles.badge, ...styles[item.urgency] }}>{item.urgency}</span>
              </div>
              <h2 style={styles.caseName}>{item.name}</h2>
              <p style={styles.caseLocation}>{item.location}</p>
              <div style={styles.needRow}>
                {item.needs.slice(0, 3).map((need) => (
                  <span key={need}>{need}</span>
                ))}
              </div>
            </button>
          ))}
        </div>

        <article style={sx(styles.briefing, isMobile, mobileStyles.briefing)}>
          <div style={sx(styles.briefHeader, isMobile, mobileStyles.briefHeader)}>
            <div>
              <p style={styles.caseId}>{selectedCase.id}</p>
              <h2 style={sx(styles.briefTitle, isMobile, mobileStyles.briefTitle)}>{selectedCase.name}</h2>
            </div>
            <span style={{ ...styles.badgeLarge, ...styles[selectedCase.urgency] }}>{selectedCase.urgency}</span>
          </div>

          <div style={sx(styles.briefGrid, isMobile, mobileStyles.briefGrid)}>
            <InfoBlock title="Who this person is" items={[selectedCase.location, ...selectedCase.disabilities]} />
            <InfoBlock title="Medical dependencies" items={selectedCase.medicalDependencies} />
            <InfoBlock title="How to communicate" items={[selectedCase.communicationMethod]} />
            <InfoBlock title="What NOT to do" items={selectedCase.doNotDo} danger />
          </div>

          <section style={styles.stepsPanel}>
            <h3 style={styles.stepsTitle}>
              <Siren size={20} />
              Step-by-step approach
            </h3>
            <ol style={styles.stepsList}>
              {selectedCase.approachSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>

          <section style={styles.guidancePanel}>
            <h3 style={styles.stepsTitle}>AI-generated briefing</h3>
            <p style={styles.guidanceText}>{selectedCase.responderGuidance}</p>
          </section>
        </article>
      </section>
    </main>
  )
}

function InfoBlock({ title, items, danger = false }) {
  return (
    <section style={{ ...styles.infoBlock, borderColor: danger ? "rgba(239, 68, 68, 0.35)" : "rgba(34, 197, 94, 0.28)" }}>
      <h3 style={styles.infoTitle}>{title}</h3>
      <ul style={styles.infoList}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}

const styles = {
  page: {
    minHeight: "100svh",
    padding: 24,
    background:
      "radial-gradient(circle at top right, rgba(34, 197, 94, 0.16), transparent 28%), #0a0a0f",
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
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 18,
    margin: "22px 0 16px",
  },
  kicker: {
    margin: "0 0 8px",
    color: "#86efac",
    fontSize: 13,
    fontWeight: 950,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  title: {
    margin: 0,
    color: "#ffffff",
    fontSize: "clamp(34px, 4.6vw, 64px)",
    letterSpacing: 0,
    lineHeight: 1,
  },
  onlineBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 9,
    padding: "12px 14px",
    border: "1px solid rgba(34, 197, 94, 0.4)",
    borderRadius: 999,
    background: "rgba(20, 83, 45, 0.32)",
    color: "#bbf7d0",
    fontWeight: 950,
  },
  toolbar: {
    display: "grid",
    gridTemplateColumns: "minmax(260px, 1fr) 180px 240px",
    gap: 12,
    marginBottom: 16,
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 12px",
    border: "1px solid rgba(248, 250, 252, 0.12)",
    borderRadius: 10,
    background: "rgba(15, 23, 42, 0.78)",
  },
  input: {
    width: "100%",
    minHeight: 46,
    border: 0,
    outline: 0,
    background: "transparent",
    color: "#ffffff",
    font: "inherit",
  },
  selectBox: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    paddingLeft: 10,
    border: "1px solid rgba(248, 250, 252, 0.12)",
    borderRadius: 10,
    background: "rgba(15, 23, 42, 0.78)",
  },
  select: {
    width: "100%",
    minHeight: 46,
    border: 0,
    outline: 0,
    background: "transparent",
    color: "#ffffff",
    font: "inherit",
  },
  selectWide: {
    minHeight: 48,
    padding: "0 12px",
    border: "1px solid rgba(248, 250, 252, 0.12)",
    borderRadius: 10,
    background: "rgba(15, 23, 42, 0.78)",
    color: "#ffffff",
    font: "inherit",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "360px minmax(0, 1fr)",
    gap: 16,
  },
  caseList: {
    display: "grid",
    alignContent: "start",
    gap: 12,
  },
  caseCard: {
    display: "grid",
    gap: 8,
    padding: 16,
    border: "1px solid rgba(248, 250, 252, 0.12)",
    borderRadius: 14,
    background: "rgba(15, 23, 42, 0.78)",
    color: "#ffffff",
    cursor: "pointer",
    textAlign: "left",
    font: "inherit",
  },
  caseTopline: {
    display: "flex",
    justifyContent: "space-between",
    gap: 8,
  },
  caseId: {
    margin: 0,
    color: "#86efac",
    fontSize: 12,
    fontWeight: 950,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  caseName: {
    margin: 0,
    color: "#ffffff",
    fontSize: 23,
  },
  caseLocation: {
    margin: 0,
    color: "#cbd5e1",
    lineHeight: 1.4,
  },
  needRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
  },
  badge: {
    padding: "6px 9px",
    borderRadius: 999,
    color: "#0a0a0f",
    fontSize: 11,
    fontWeight: 950,
    textTransform: "uppercase",
  },
  badgeLarge: {
    padding: "9px 12px",
    borderRadius: 999,
    color: "#0a0a0f",
    fontSize: 13,
    fontWeight: 950,
    textTransform: "uppercase",
  },
  critical: {
    background: "#ef4444",
  },
  high: {
    background: "#f59e0b",
  },
  medium: {
    background: "#22c55e",
  },
  briefing: {
    minHeight: 640,
    padding: 18,
    border: "1px solid rgba(34, 197, 94, 0.2)",
    borderRadius: 16,
    background: "rgba(8, 13, 24, 0.9)",
  },
  briefHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 16,
  },
  briefTitle: {
    margin: "4px 0 0",
    color: "#ffffff",
    fontSize: 38,
  },
  briefGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 12,
  },
  infoBlock: {
    padding: 15,
    border: "1px solid rgba(34, 197, 94, 0.28)",
    borderRadius: 12,
    background: "rgba(15, 23, 42, 0.72)",
  },
  infoTitle: {
    margin: "0 0 10px",
    color: "#bbf7d0",
    fontSize: 16,
  },
  infoList: {
    display: "grid",
    gap: 7,
    margin: 0,
    paddingLeft: 20,
    color: "#e5e7eb",
    lineHeight: 1.45,
  },
  stepsPanel: {
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    background: "rgba(20, 83, 45, 0.22)",
  },
  stepsTitle: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    margin: "0 0 10px",
    color: "#ffffff",
  },
  stepsList: {
    display: "grid",
    gap: 9,
    margin: 0,
    paddingLeft: 22,
    color: "#dcfce7",
    lineHeight: 1.5,
    fontWeight: 750,
  },
  guidancePanel: {
    marginTop: 12,
    padding: 16,
    border: "1px solid rgba(34, 197, 94, 0.24)",
    borderRadius: 12,
    background: "rgba(2, 6, 23, 0.62)",
  },
  guidanceText: {
    margin: 0,
    color: "#d1fae5",
    fontSize: 17,
    lineHeight: 1.55,
  },
}

function sx(base, isMobile, mobile) {
  return isMobile ? { ...base, ...mobile } : base
}

const mobileStyles = {
  page: {
    padding: "16px 14px calc(22px + env(safe-area-inset-bottom))",
    overflowX: "hidden",
  },
  header: {
    display: "grid",
    alignItems: "start",
    gap: 14,
    margin: "20px 0 14px",
  },
  title: {
    fontSize: "clamp(32px, 10vw, 46px)",
    lineHeight: 1.05,
  },
  toolbar: {
    gridTemplateColumns: "1fr",
  },
  layout: {
    gridTemplateColumns: "1fr",
  },
  briefing: {
    minHeight: "auto",
    padding: 16,
    borderRadius: 12,
  },
  briefHeader: {
    display: "grid",
    gap: 12,
  },
  briefTitle: {
    fontSize: 30,
  },
  briefGrid: {
    gridTemplateColumns: "1fr",
  },
}
