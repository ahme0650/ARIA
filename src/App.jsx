import { useEffect, useState } from "react"
import { ClipboardList, Radio, ShieldCheck, Siren, UsersRound } from "lucide-react"
import CitizenScreen from "./screens/CitizenScreen"
import CascadeScreen from "./screens/CascadeScreen"
import ProfileSetup from "./screens/ProfileSetup"
import ResponderScreen from "./screens/ResponderScreen"

const initialProfile = {
  name: "Maya Rodriguez",
  age: 29,
  urgency: "critical",
  location: "Sector 7B, 700 W University Ave, second floor",
  needs: ["Non-verbal", "Power wheelchair", "Battery backup required", "Unable to self-evacuate"],
  communicationMethod: "Use large written yes/no prompts, AAC choices, and extra response time. Do not require speech.",
  medicalDependencies: ["Powered mobility device", "Anti-seizure medication within 2 hours"],
  responderGuidance:
    "Approach from the front, identify yourself visually, and ask one question at a time. Keep Maya with her wheelchair, charger, medication bag, and communication board during evacuation.",
  cascadeOrder: ["neighbor", "volunteer", "emergency", "911"],
  disabilities: ["Non-speaking", "Mobility disability", "Low stamina during evacuation"],
  doNotDo: ["Do not separate Maya from her wheelchair", "Do not speak only to caregivers", "Do not rush AAC responses"],
  approachSteps: [
    "Confirm identity and show responder badge.",
    "Ask yes/no questions using large readable text.",
    "Secure wheelchair charger and medication bag.",
    "Evacuate using accessible route or trained lift team.",
  ],
}

const roleCards = [
  {
    id: "profile",
    title: "Set Up Profile",
    subtitle: "Save disability and contact details before disaster",
    color: "#38bdf8",
    glow: "rgba(56, 189, 248, 0.52)",
    icon: ClipboardList,
  },
  {
    id: "citizen",
    title: "I Need Help",
    subtitle: "Accessible alert intake for disabled residents",
    color: "#ef4444",
    glow: "rgba(239, 68, 68, 0.6)",
    icon: Siren,
  },
  {
    id: "cascade",
    title: "I'm a Caregiver",
    subtitle: "Coordinate trusted support in sequence",
    color: "#f59e0b",
    glow: "rgba(245, 158, 11, 0.55)",
    icon: UsersRound,
  },
  {
    id: "responder",
    title: "I'm a Responder",
    subtitle: "Open active cases and AI briefings",
    color: "#22c55e",
    glow: "rgba(34, 197, 94, 0.52)",
    icon: ShieldCheck,
  },
]

export default function App() {
  const [role, setRole] = useState("landing")
  const [hoveredRole, setHoveredRole] = useState(null)
  const [pulseOn, setPulseOn] = useState(true)
  const [profile, setProfile] = useState(() => {
    const stored = localStorage.getItem("aria-triage-profile")
    return stored ? JSON.parse(stored) : initialProfile
  })

  useEffect(() => {
    localStorage.setItem("aria-triage-profile", JSON.stringify(profile))
  }, [profile])

  useEffect(() => {
    document.body.style.margin = "0"
    document.body.style.background = "#0a0a0f"
    document.body.style.color = "#f8fafc"
    document.body.style.fontFamily =
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"

    const timer = window.setInterval(() => setPulseOn((value) => !value), 760)
    return () => window.clearInterval(timer)
  }, [])

  if (role === "citizen") {
    return <CitizenScreen profile={profile} setProfile={setProfile} setRole={setRole} />
  }

  if (role === "profile") {
    return <ProfileSetup setRole={setRole} />
  }

  if (role === "cascade") {
    return <CascadeScreen profile={profile} setRole={setRole} />
  }

  if (role === "responder") {
    return <ResponderScreen profile={profile} setRole={setRole} />
  }

  return (
    <main
      style={{
        position: "relative",
        minHeight: "100svh",
        overflow: "hidden",
        padding: "clamp(22px, 5vw, 72px)",
        paddingBottom: 94,
        background:
          "radial-gradient(circle at 50% 18%, rgba(185, 28, 28, 0.22), transparent 32%), radial-gradient(circle at 12% 78%, rgba(14, 165, 233, 0.11), transparent 25%), #0a0a0f",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(148, 163, 184, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.06) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.18))",
        }}
      />

      <section
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          placeItems: "center",
          minHeight: "48svh",
          textAlign: "center",
        }}
      >
        <div>
          <div
            aria-label="ARIA logo"
            style={{
              display: "inline-grid",
              placeItems: "center",
              width: 118,
              height: 118,
              marginBottom: 24,
              border: "1px solid rgba(248, 250, 252, 0.22)",
              borderRadius: 28,
              background:
                "linear-gradient(145deg, rgba(248, 250, 252, 0.13), rgba(248, 250, 252, 0.03))",
              boxShadow:
                "0 0 54px rgba(239, 68, 68, 0.26), inset 0 0 28px rgba(248, 250, 252, 0.06)",
              color: "#ffffff",
              fontSize: 34,
              fontWeight: 950,
              letterSpacing: 0,
            }}
          >
            AR
          </div>
          <h1
            style={{
              margin: 0,
              color: "#ffffff",
              fontSize: "clamp(58px, 11vw, 138px)",
              fontWeight: 950,
              letterSpacing: 0,
              lineHeight: 0.9,
              textShadow: "0 0 42px rgba(248, 250, 252, 0.18)",
            }}
          >
            ARIA
          </h1>
          <p
            style={{
              margin: "18px auto 0",
              maxWidth: 720,
              color: "#dbeafe",
              fontSize: "clamp(18px, 2.4vw, 28px)",
              fontWeight: 750,
              letterSpacing: 0,
            }}
          >
            Adaptive Response & Inclusion Assistant
          </p>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginTop: 24,
              padding: "10px 16px",
              border: "1px solid rgba(239, 68, 68, 0.42)",
              borderRadius: 999,
              background: "rgba(127, 29, 29, 0.32)",
              color: "#fecaca",
              fontSize: 13,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              boxShadow: pulseOn
                ? "0 0 36px rgba(239, 68, 68, 0.64)"
                : "0 0 12px rgba(239, 68, 68, 0.2)",
              transform: pulseOn ? "scale(1.02)" : "scale(1)",
              transition: "transform 420ms ease, box-shadow 420ms ease",
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#ef4444",
                boxShadow: "0 0 18px #ef4444",
              }}
            />
            Active emergency indicator
          </div>
        </div>
      </section>

      <section
        aria-label="Choose your role"
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: 20,
          width: "min(1040px, 100%)",
          margin: "0 auto",
        }}
      >
        {roleCards.map((card) => {
          const Icon = card.icon
          const isHovered = hoveredRole === card.id
          return (
            <button
              key={card.id}
              onClick={() => setRole(card.id)}
              onMouseEnter={() => setHoveredRole(card.id)}
              onMouseLeave={() => setHoveredRole(null)}
              style={{
                minHeight: 230,
                padding: 26,
                border: `1px solid ${isHovered ? card.color : "rgba(148, 163, 184, 0.22)"}`,
                borderRadius: 18,
                background:
                  "linear-gradient(155deg, rgba(15, 23, 42, 0.92), rgba(10, 10, 15, 0.74))",
                color: "#f8fafc",
                cursor: "pointer",
                textAlign: "left",
                boxShadow: isHovered
                  ? `0 24px 64px ${card.glow}, inset 0 0 34px rgba(255,255,255,0.05)`
                  : "0 18px 44px rgba(0, 0, 0, 0.38)",
                transform: isHovered ? "translateY(-10px)" : "translateY(0)",
                transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
                font: "inherit",
              }}
              type="button"
            >
              <div
                style={{
                  display: "inline-grid",
                  placeItems: "center",
                  width: 56,
                  height: 56,
                  marginBottom: 36,
                  borderRadius: 14,
                  background: `${card.color}20`,
                  color: card.color,
                  boxShadow: isHovered ? `0 0 28px ${card.glow}` : "none",
                }}
              >
                <Icon size={29} />
              </div>
              <h2 style={{ margin: "0 0 10px", color: "#ffffff", fontSize: 29, letterSpacing: 0 }}>
                {card.title}
              </h2>
              <p style={{ margin: 0, color: "#94a3b8", fontSize: 15, fontWeight: 750 }}>
                {card.subtitle}
              </p>
            </button>
          )
        })}
      </section>

      <footer
        style={{
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
          background: "rgba(5, 5, 10, 0.9)",
          backdropFilter: "blur(18px)",
          color: "#cbd5e1",
          fontSize: 13,
          fontWeight: 800,
          boxSizing: "border-box",
        }}
      >
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
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Radio size={16} />
          ARIA OPS CENTER / SECURE LOCAL MODE
        </span>
      </footer>
    </main>
  )
}
