import { useEffect, useState } from "react"
import {
  Activity,
  HeartHandshake,
  Radio,
  ShieldCheck,
  Siren,
  UsersRound,
} from "lucide-react"
import CitizenScreen from "./CitizenScreen"
import ResponderScreen from "./ResponderScreen"
import CascadeScreen from "./CascadeScreen"
import "./App.css"

const fallbackProfile = {
  name: "Maya R.",
  urgency: "critical",
  location: "Last known: 700 W University Ave",
  needs: ["Non-speaking", "Power wheelchair", "Backup battery needed", "Caregiver not nearby"],
  communicationMethod: "Use yes/no prompts, large text, and the AAC board. Do not rely on speech.",
  medicalDependencies: ["Powered mobility device", "Medication access within 2 hours"],
  responderGuidance:
    "Approach from the front, identify yourself visually, and ask one question at a time. Keep Maya with her wheelchair and charger if evacuation is required.",
  cascadeOrder: ["neighbor", "volunteer", "responder"],
  transcript: "Selected AAC tiles indicated non-speaking, cannot move, medical device, and alone.",
  offlineReady: true,
}

const screens = [
  { id: "citizen", label: "Citizen", icon: Activity },
  { id: "cascade", label: "Cascade", icon: HeartHandshake },
  { id: "responder", label: "Responder", icon: ShieldCheck },
]

export default function App() {
  const [screen, setScreen] = useState("landing")
  const [hoveredRole, setHoveredRole] = useState(null)
  const [pulseOn, setPulseOn] = useState(true)
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("aria-profile")
    return saved ? JSON.parse(saved) : fallbackProfile
  })

  useEffect(() => {
    localStorage.setItem("aria-profile", JSON.stringify(profile))
  }, [profile])

  useEffect(() => {
    const pulseTimer = window.setInterval(() => {
      setPulseOn((current) => !current)
    }, 760)

    return () => window.clearInterval(pulseTimer)
  }, [])

  function setRole(role) {
    setScreen(role)
  }

  if (screen === "landing") {
    const roles = [
      {
        id: "citizen",
        title: "I Need Help",
        subtitle: "Accessible emergency request",
        color: "#ef4444",
        shadow: "rgba(239, 68, 68, 0.55)",
        icon: Siren,
      },
      {
        id: "cascade",
        title: "I'm a Caregiver",
        subtitle: "Activate the care network",
        color: "#f59e0b",
        shadow: "rgba(245, 158, 11, 0.5)",
        icon: UsersRound,
      },
      {
        id: "responder",
        title: "I'm a Responder",
        subtitle: "Open field guidance",
        color: "#22c55e",
        shadow: "rgba(34, 197, 94, 0.48)",
        icon: ShieldCheck,
      },
    ]

    const pageStyle = {
      position: "relative",
      minHeight: "100svh",
      overflow: "hidden",
      padding: "clamp(24px, 5vw, 68px)",
      paddingBottom: "96px",
      color: "#f8fafc",
      background:
        "radial-gradient(circle at 50% 20%, rgba(185, 28, 28, 0.2), transparent 32%), radial-gradient(circle at 12% 76%, rgba(14, 165, 233, 0.11), transparent 26%), #0a0a0f",
      fontFamily:
        "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }

    const gridOverlayStyle = {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage:
        "linear-gradient(rgba(148, 163, 184, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.06) 1px, transparent 1px)",
      backgroundSize: "46px 46px",
      maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.2))",
    }

    const heroStyle = {
      position: "relative",
      zIndex: 1,
      display: "grid",
      placeItems: "center",
      minHeight: "48svh",
      textAlign: "center",
    }

    const logoStyle = {
      display: "inline-grid",
      placeItems: "center",
      width: 118,
      height: 118,
      marginBottom: 24,
      border: "1px solid rgba(248, 250, 252, 0.2)",
      borderRadius: 28,
      background:
        "linear-gradient(145deg, rgba(248, 250, 252, 0.12), rgba(248, 250, 252, 0.03))",
      boxShadow:
        "0 0 48px rgba(239, 68, 68, 0.25), inset 0 0 28px rgba(248, 250, 252, 0.06)",
      color: "#f8fafc",
      fontSize: 36,
      fontWeight: 900,
      letterSpacing: 0,
    }

    const indicatorStyle = {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      marginTop: 24,
      padding: "10px 16px",
      border: "1px solid rgba(239, 68, 68, 0.38)",
      borderRadius: 999,
      background: "rgba(127, 29, 29, 0.32)",
      color: "#fecaca",
      fontSize: 13,
      fontWeight: 800,
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      boxShadow: pulseOn
        ? "0 0 34px rgba(239, 68, 68, 0.62)"
        : "0 0 12px rgba(239, 68, 68, 0.18)",
      transform: pulseOn ? "scale(1.02)" : "scale(1)",
      transition: "transform 420ms ease, box-shadow 420ms ease",
    }

    const roleGridStyle = {
      position: "relative",
      zIndex: 1,
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
      gap: 20,
      width: "min(980px, 100%)",
      margin: "0 auto",
    }

    const statusBarStyle = {
      position: "fixed",
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 3,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
      padding: "14px clamp(18px, 5vw, 44px)",
      borderTop: "1px solid rgba(148, 163, 184, 0.18)",
      background: "rgba(5, 5, 10, 0.88)",
      backdropFilter: "blur(18px)",
      color: "#cbd5e1",
      fontSize: 13,
      fontWeight: 700,
    }

    return (
      <main style={pageStyle}>
        <div style={gridOverlayStyle} />
        <section style={heroStyle}>
          <div>
            <div aria-label="ARIA logo" style={logoStyle}>
              AR
            </div>
            <h1
              style={{
                margin: 0,
                color: "#ffffff",
                fontSize: "clamp(56px, 11vw, 132px)",
                fontWeight: 950,
                letterSpacing: 0,
                lineHeight: 0.9,
                textShadow: "0 0 42px rgba(248, 250, 252, 0.16)",
              }}
            >
              ARIA
            </h1>
            <p
              style={{
                margin: "18px auto 0",
                maxWidth: 660,
                color: "#cbd5e1",
                fontSize: "clamp(18px, 2.4vw, 28px)",
                fontWeight: 700,
                letterSpacing: 0,
              }}
            >
              Adaptive Response & Inclusion Assistant
            </p>
            <div style={indicatorStyle}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#ef4444",
                  boxShadow: "0 0 18px #ef4444",
                }}
              />
              Active emergency channel
            </div>
          </div>
        </section>

        <section aria-label="Choose your role" style={roleGridStyle}>
          {roles.map((role) => {
            const Icon = role.icon
            const isHovered = hoveredRole === role.id

            return (
              <button
                key={role.id}
                onClick={() => setRole(role.id)}
                onMouseEnter={() => setHoveredRole(role.id)}
                onMouseLeave={() => setHoveredRole(null)}
                style={{
                  minHeight: 218,
                  padding: 24,
                  border: `1px solid ${isHovered ? role.color : "rgba(148, 163, 184, 0.2)"}`,
                  borderRadius: 18,
                  background:
                    "linear-gradient(155deg, rgba(15, 23, 42, 0.9), rgba(10, 10, 15, 0.68))",
                  color: "#f8fafc",
                  cursor: "pointer",
                  textAlign: "left",
                  boxShadow: isHovered
                    ? `0 24px 60px ${role.shadow}, inset 0 0 34px rgba(255,255,255,0.045)`
                    : "0 18px 44px rgba(0, 0, 0, 0.35)",
                  transform: isHovered ? "translateY(-10px)" : "translateY(0)",
                  transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
                }}
                type="button"
              >
                <div
                  style={{
                    display: "inline-grid",
                    placeItems: "center",
                    width: 54,
                    height: 54,
                    marginBottom: 34,
                    borderRadius: 14,
                    background: `${role.color}1f`,
                    color: role.color,
                    boxShadow: isHovered ? `0 0 28px ${role.shadow}` : "none",
                  }}
                >
                  <Icon size={28} />
                </div>
                <h2
                  style={{
                    margin: "0 0 10px",
                    color: "#ffffff",
                    fontSize: 28,
                    letterSpacing: 0,
                  }}
                >
                  {role.title}
                </h2>
                <p style={{ margin: 0, color: "#94a3b8", fontSize: 15, fontWeight: 700 }}>
                  {role.subtitle}
                </p>
              </button>
            )
          })}
        </section>

        <footer style={statusBarStyle}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
            <span
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: "#22c55e",
                boxShadow: "0 0 14px #22c55e",
              }}
            />
            SYSTEM ONLINE
          </span>
          <span>ARIA OPS CENTER / SECURE LOCAL MODE</span>
        </footer>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Adaptive Response & Inclusion Assistant</p>
          <h1>ARIA</h1>
        </div>
        <div className="status-pill">
          <Radio size={18} />
          Offline demo ready
        </div>
      </header>

      <nav className="screen-tabs" aria-label="Demo screens">
        {screens.map(({ id, label, icon: Icon }) => (
          <button
            className={screen === id ? "tab active" : "tab"}
            key={id}
            onClick={() => setScreen(id)}
            type="button"
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {screen === "citizen" && (
        <CitizenScreen profile={profile} setProfile={setProfile} setScreen={setScreen} />
      )}
      {screen === "cascade" && <CascadeScreen profile={profile} setScreen={setScreen} />}
      {screen === "responder" && <ResponderScreen profile={profile} setScreen={setScreen} />}
    </main>
  )
}
