import { useMemo, useRef, useState } from "react"
import { ArrowLeft, CheckCircle2, LocateFixed, Mic, Send, ShieldAlert, Type } from "lucide-react"

const symbolTiles = [
  { id: "cant_breathe", emoji: "🫁", label: "Can't breathe", need: "Respiratory distress" },
  { id: "cant_move", emoji: "♿", label: "Can't move", need: "Mobility assistance" },
  { id: "need_meds", emoji: "💊", label: "Need medication", need: "Medication access" },
  { id: "alone", emoji: "🙋", label: "I'm alone", need: "No support person nearby" },
  { id: "children", emoji: "👶", label: "Children with me", need: "Child evacuation support" },
  { id: "device", emoji: "🔌", label: "Medical device dependent", need: "Device power continuity" },
  { id: "deaf", emoji: "🦻", label: "Deaf", need: "Visual communication" },
  { id: "nonverbal", emoji: "🤐", label: "Non-verbal", need: "AAC communication" },
  { id: "vision", emoji: "👁️", label: "Vision impairment", need: "Guided navigation" },
]

function fallbackProfile({ selectedLabels, selectedNeeds, textInput, voiceInput, location }) {
  const combined = `${selectedLabels.join(", ")} ${textInput} ${voiceInput}`.toLowerCase()
  const critical = combined.includes("breathe") || combined.includes("oxygen") || combined.includes("device")

  return {
    name: "Maya Rodriguez",
    age: 29,
    urgency: critical ? "critical" : "high",
    location: location
      ? `GPS ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
      : "Location pending, last known residence on file",
    needs: [...new Set(selectedNeeds.length ? selectedNeeds : ["Emergency welfare check"])],
    communicationMethod: combined.includes("non-verbal")
      ? "Use large written yes/no prompts and AAC choices. Do not require spoken answers."
      : "Speak calmly, ask one question at a time, and confirm understanding before moving.",
    medicalDependencies: combined.includes("device")
      ? ["Powered mobility or medical device", "Backup battery or generator access"]
      : ["Medication and mobility aids should remain with resident"],
    responderGuidance:
      "Approach from the front, identify yourself, and explain each step before touch or movement. Keep the resident with essential devices, medication, chargers, and communication aids.",
    cascadeOrder: critical ? ["neighbor", "emergency", "volunteer", "911"] : ["neighbor", "volunteer", "emergency", "911"],
    disabilities: selectedLabels.filter((label) =>
      ["Deaf", "Non-verbal", "Vision impairment", "Can't move"].includes(label),
    ),
    doNotDo: [
      "Do not separate the resident from assistive technology.",
      "Do not assume speech is required for consent.",
      "Do not move mobility equipment separately unless medically necessary.",
    ],
    approachSteps: [
      "Announce presence and show identification.",
      "Confirm immediate danger using yes/no prompts.",
      "Collect medication, charger, mobility device, and communication tools.",
      "Evacuate through accessible route or request lift-trained support.",
    ],
    transcript: `Symbols: ${selectedLabels.join(", ") || "none"} | Voice: ${voiceInput || "none"} | Text: ${textInput || "none"}`,
    generatedBy: "local fallback",
  }
}

async function generateProfileWithOpenAI(payload) {
  const response = await fetch("/api/triage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Triage service unavailable: ${response.status}`)
  }

  return response.json()
}

export default function CitizenScreen({ setProfile, setRole }) {
  const [selected, setSelected] = useState(["nonverbal", "cant_move", "device", "alone"])
  const [voiceInput, setVoiceInput] = useState("")
  const [textInput, setTextInput] = useState("Power is out. I am on the second floor and cannot self-evacuate.")
  const [location, setLocation] = useState(null)
  const [listening, setListening] = useState(false)
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [apiNote, setApiNote] = useState("")
  const recognitionRef = useRef(null)

  const selectedTiles = useMemo(
    () => symbolTiles.filter((tile) => selected.includes(tile.id)),
    [selected],
  )

  function toggleTile(id) {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  function startVoiceInput() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setApiNote("Voice input is unavailable in this browser. Text and symbol input remain active.")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = "en-US"
    recognition.continuous = false
    recognition.onresult = (event) => {
      setVoiceInput(event.results[0][0].transcript)
      setListening(false)
    }
    recognition.onerror = () => setListening(false)
    recognition.onend = () => setListening(false)
    recognitionRef.current = recognition
    recognition.start()
    setListening(true)
  }

  function shareLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => setLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
      () => {
        setLocation({ lat: 30.2849, lng: -97.7341 })
        setApiNote("Using demo GPS coordinates after location permission was unavailable.")
      },
      { enableHighAccuracy: true, timeout: 4500 },
    )
  }

  async function submitAlert() {
    setLoading(true)
    setApiNote("")
    const payload = {
      selectedLabels: selectedTiles.map((tile) => tile.label),
      selectedNeeds: selectedTiles.map((tile) => tile.need),
      voiceInput,
      textInput,
      location,
    }

    try {
      const generated = await generateProfileWithOpenAI(payload)
      setProfile({ ...generated, generatedBy: "gpt-4o" })
      setApiNote("GPT-4o triage profile generated and transmitted.")
    } catch (error) {
      setProfile(fallbackProfile(payload))
      setApiNote(`Secure local triage used for demo continuity. ${error.message}`)
    } finally {
      setLoading(false)
      setConfirmed(true)
    }
  }

  if (confirmed) {
    return (
      <main style={styles.page}>
        <button style={styles.backButton} onClick={() => setRole("landing")} type="button">
          <ArrowLeft size={18} />
          Role select
        </button>
        <section style={styles.confirmation}>
          <CheckCircle2 size={70} color="#ef4444" />
          <p style={styles.kicker}>Emergency alert received</p>
          <h1 style={styles.confirmTitle}>Your care network is being activated</h1>
          <p style={styles.confirmText}>
            ARIA has generated a disability-aware triage profile, queued your location, and prepared
            guidance for caregivers and responders.
          </p>
          <div style={styles.confirmGrid}>
            <div style={styles.confirmCard}>Profile received</div>
            <div style={styles.confirmCard}>Caregiver cascade notified</div>
            <div style={styles.confirmCard}>Responder briefing prepared</div>
          </div>
          <button style={styles.primaryButton} onClick={() => setRole("cascade")} type="button">
            View activated care network
          </button>
          {apiNote && <p style={styles.apiNote}>{apiNote}</p>}
        </section>
      </main>
    )
  }

  return (
    <main style={styles.page}>
      <button style={styles.backButton} onClick={() => setRole("landing")} type="button">
        <ArrowLeft size={18} />
        Role select
      </button>
      <section style={styles.header}>
        <div>
          <p style={styles.kicker}>Citizen emergency intake</p>
          <h1 style={styles.title}>Tell ARIA what you need</h1>
          <p style={styles.subtitle}>
            Use symbols, voice, text, or GPS. Large controls stay usable under stress.
          </p>
        </div>
        <div style={styles.alertBadge}>
          <ShieldAlert size={18} />
          Accessible SOS channel
        </div>
      </section>

      <section style={styles.layout}>
        <div style={styles.panel}>
          <h2 style={styles.sectionTitle}>Tap-able symbol board</h2>
          <div style={styles.symbolGrid}>
            {symbolTiles.map((tile) => {
              const active = selected.includes(tile.id)
              return (
                <button
                  key={tile.id}
                  onClick={() => toggleTile(tile.id)}
                  style={{
                    ...styles.symbolTile,
                    borderColor: active ? "#ef4444" : "rgba(248, 250, 252, 0.14)",
                    background: active ? "rgba(127, 29, 29, 0.58)" : "rgba(15, 23, 42, 0.74)",
                    boxShadow: active ? "0 0 28px rgba(239, 68, 68, 0.25)" : "none",
                  }}
                  type="button"
                >
                  <span style={styles.emoji}>{tile.emoji}</span>
                  <span>{tile.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <aside style={styles.sidePanel}>
          <button
            style={{
              ...styles.inputButton,
              borderColor: listening ? "#ef4444" : "rgba(248, 250, 252, 0.14)",
            }}
            onClick={startVoiceInput}
            type="button"
          >
            <Mic size={23} />
            {listening ? "Listening..." : "Voice input"}
          </button>
          {voiceInput && <p style={styles.captureText}>Captured: {voiceInput}</p>}

          <label style={styles.textLabel}>
            <span style={styles.labelText}>
              <Type size={18} />
              Text fallback
            </span>
            <textarea
              style={styles.textarea}
              onChange={(event) => setTextInput(event.target.value)}
              value={textInput}
            />
          </label>

          <button style={styles.inputButton} onClick={shareLocation} type="button">
            <LocateFixed size={23} />
            {location ? "Location shared" : "One-tap location share"}
          </button>

          <button style={styles.emergencyButton} disabled={loading} onClick={submitAlert} type="button">
            <Send size={24} />
            {loading ? "Generating triage..." : "Send emergency alert"}
          </button>
          {apiNote && <p style={styles.apiNote}>{apiNote}</p>}
        </aside>
      </section>
    </main>
  )
}

const styles = {
  page: {
    minHeight: "100svh",
    padding: "28px",
    background:
      "radial-gradient(circle at top left, rgba(239, 68, 68, 0.2), transparent 28%), #0a0a0f",
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
    margin: "26px 0",
  },
  kicker: {
    margin: "0 0 8px",
    color: "#fca5a5",
    fontSize: 13,
    fontWeight: 900,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  title: {
    margin: 0,
    color: "#ffffff",
    fontSize: "clamp(40px, 6vw, 78px)",
    lineHeight: 0.95,
    letterSpacing: 0,
  },
  subtitle: {
    maxWidth: 720,
    margin: "14px 0 0",
    color: "#cbd5e1",
    fontSize: 20,
    lineHeight: 1.45,
  },
  alertBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 9,
    padding: "12px 14px",
    border: "1px solid rgba(239, 68, 68, 0.36)",
    borderRadius: 999,
    background: "rgba(127, 29, 29, 0.38)",
    color: "#fecaca",
    fontWeight: 900,
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.5fr) minmax(320px, 0.7fr)",
    gap: 18,
  },
  panel: {
    padding: 22,
    border: "1px solid rgba(248, 250, 252, 0.12)",
    borderRadius: 16,
    background: "rgba(15, 23, 42, 0.68)",
    boxShadow: "0 24px 70px rgba(0, 0, 0, 0.34)",
  },
  sectionTitle: {
    margin: "0 0 16px",
    color: "#ffffff",
    fontSize: 24,
  },
  symbolGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
    gap: 12,
  },
  symbolTile: {
    display: "grid",
    gap: 10,
    placeItems: "center",
    minHeight: 142,
    padding: 18,
    border: "1px solid rgba(248, 250, 252, 0.14)",
    borderRadius: 14,
    color: "#ffffff",
    cursor: "pointer",
    fontSize: 19,
    fontWeight: 900,
  },
  emoji: {
    fontSize: 38,
  },
  sidePanel: {
    display: "grid",
    alignContent: "start",
    gap: 14,
    padding: 22,
    border: "1px solid rgba(248, 250, 252, 0.12)",
    borderRadius: 16,
    background: "rgba(8, 13, 24, 0.86)",
  },
  inputButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    minHeight: 64,
    padding: "12px 16px",
    border: "1px solid rgba(248, 250, 252, 0.14)",
    borderRadius: 12,
    background: "rgba(15, 23, 42, 0.82)",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: 18,
    fontWeight: 900,
  },
  textLabel: {
    display: "grid",
    gap: 8,
  },
  labelText: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    color: "#e5e7eb",
    fontWeight: 900,
  },
  textarea: {
    minHeight: 126,
    padding: 14,
    border: "1px solid rgba(248, 250, 252, 0.16)",
    borderRadius: 12,
    background: "rgba(2, 6, 23, 0.76)",
    color: "#ffffff",
    resize: "vertical",
    font: "inherit",
    fontSize: 17,
  },
  emergencyButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    minHeight: 76,
    padding: "14px 18px",
    border: "1px solid #ef4444",
    borderRadius: 14,
    background: "linear-gradient(135deg, #dc2626, #7f1d1d)",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: 20,
    fontWeight: 950,
    boxShadow: "0 0 34px rgba(239, 68, 68, 0.42)",
  },
  captureText: {
    margin: 0,
    padding: 12,
    borderRadius: 10,
    background: "rgba(239, 68, 68, 0.12)",
    color: "#fecaca",
    lineHeight: 1.45,
  },
  apiNote: {
    margin: 0,
    color: "#fca5a5",
    fontSize: 13,
    lineHeight: 1.4,
  },
  confirmation: {
    display: "grid",
    placeItems: "center",
    minHeight: "72svh",
    textAlign: "center",
  },
  confirmTitle: {
    maxWidth: 820,
    margin: 0,
    color: "#ffffff",
    fontSize: "clamp(42px, 7vw, 86px)",
    lineHeight: 0.95,
    letterSpacing: 0,
  },
  confirmText: {
    maxWidth: 680,
    margin: "18px 0",
    color: "#cbd5e1",
    fontSize: 20,
    lineHeight: 1.5,
  },
  confirmGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 12,
    width: "min(760px, 100%)",
    margin: "12px 0 22px",
  },
  confirmCard: {
    padding: 16,
    border: "1px solid rgba(239, 68, 68, 0.32)",
    borderRadius: 12,
    background: "rgba(127, 29, 29, 0.28)",
    color: "#fee2e2",
    fontWeight: 900,
  },
  primaryButton: {
    minHeight: 52,
    padding: "12px 18px",
    border: "1px solid #ef4444",
    borderRadius: 10,
    background: "#ef4444",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 900,
  },
}
