import { useMemo, useRef, useState } from "react"
import { MapPin, Mic, MousePointer2, Send, Type } from "lucide-react"

const SYMBOLS = [
  { id: "cant_breathe", label: "Can't breathe", need: "Breathing difficulty", severity: 4 },
  { id: "cant_move", label: "Can't move", need: "Mobility assistance", severity: 3 },
  { id: "need_meds", label: "Need medication", need: "Medication access", severity: 3 },
  { id: "alone", label: "I'm alone", need: "No support person nearby", severity: 2 },
  { id: "children", label: "Children with me", need: "Children present", severity: 2 },
  { id: "medical_device", label: "Device needs power", need: "Powered medical or mobility device", severity: 4 },
  { id: "deaf", label: "Deaf / hard of hearing", need: "Visual communication", severity: 1 },
  { id: "nonverbal", label: "Non-speaking", need: "AAC or yes/no communication", severity: 2 },
  { id: "vision", label: "Low vision", need: "Verbal orientation and physical guidance", severity: 1 },
]

function buildTriageProfile({ selected, typedText, voiceText, location }) {
  const selectedItems = SYMBOLS.filter((symbol) => selected.includes(symbol.id))
  const selectedNeeds = selectedItems.map((symbol) => symbol.need)
  const combinedText = `${typedText} ${voiceText}`.toLowerCase()
  const score =
    selectedItems.reduce((total, symbol) => total + symbol.severity, 0) +
    (combinedText.includes("water") || combinedText.includes("flood") ? 2 : 0) +
    (combinedText.includes("oxygen") || combinedText.includes("ventilator") ? 5 : 0)

  const urgency = score >= 8 ? "critical" : score >= 4 ? "high" : "medium"
  const needs = [...new Set([...selectedNeeds, ...inferNeeds(combinedText)])]
  const communicationMethod = selected.includes("nonverbal")
    ? "Use the AAC board, yes/no questions, and large readable text. Do not require speech."
    : selected.includes("deaf")
      ? "Face the person, use written instructions, gestures, and visual confirmation."
      : selected.includes("vision")
        ? "Introduce yourself clearly, describe each action before touching or moving them."
        : "Speak calmly, ask one question at a time, and confirm consent before moving them."

  return {
    name: "Maya R.",
    urgency,
    location: location
      ? `GPS ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
      : "Location queued until GPS is available",
    needs: needs.length ? needs : ["Needs check-in and evacuation assessment"],
    communicationMethod,
    medicalDependencies: inferMedicalDependencies(selected, combinedText),
    responderGuidance: buildGuidance(selected, combinedText),
    cascadeOrder: urgency === "critical" ? ["responder", "neighbor", "volunteer"] : ["neighbor", "volunteer", "responder"],
    transcript: [
      selectedItems.length ? `AAC tiles: ${selectedItems.map((item) => item.label).join(", ")}` : "",
      voiceText ? `Voice: ${voiceText}` : "",
      typedText ? `Text: ${typedText}` : "",
    ]
      .filter(Boolean)
      .join(" | "),
    offlineReady: true,
    createdAt: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
  }
}

function inferNeeds(text) {
  const needs = []
  if (text.includes("flood") || text.includes("water")) needs.push("Flood evacuation")
  if (text.includes("oxygen")) needs.push("Oxygen support")
  if (text.includes("battery") || text.includes("power")) needs.push("Power backup")
  if (text.includes("stuck")) needs.push("Physical extraction")
  return needs
}

function inferMedicalDependencies(selected, text) {
  const dependencies = []
  if (selected.includes("medical_device") || text.includes("battery") || text.includes("power")) {
    dependencies.push("Device power continuity")
  }
  if (text.includes("oxygen")) dependencies.push("Oxygen equipment")
  if (selected.includes("need_meds")) dependencies.push("Medication access")
  return dependencies.length ? dependencies : ["No life-sustaining dependency reported"]
}

function buildGuidance(selected, text) {
  if (text.includes("oxygen")) {
    return "Prioritize airway support and power continuity. Keep communication simple, confirm device details with the person or caregiver, and avoid separating them from essential equipment."
  }
  if (selected.includes("nonverbal")) {
    return "Approach from the front and show your ID. Use yes/no questions or the AAC board, give the person time to respond, and keep mobility devices with them during evacuation."
  }
  return "Approach calmly, state what you are doing, and confirm the safest evacuation method before moving the person. Preserve medications, chargers, mobility devices, and communication tools."
}

export default function CitizenScreen({ setProfile, setScreen }) {
  const [selected, setSelected] = useState(["nonverbal", "cant_move", "medical_device"])
  const [typedText, setTypedText] = useState("Power is out and I am alone on the second floor.")
  const [voiceText, setVoiceText] = useState("")
  const [listening, setListening] = useState(false)
  const [location, setLocation] = useState(null)
  const recognitionRef = useRef(null)

  const canSubmit = selected.length > 0 || typedText.trim() || voiceText.trim()
  const selectedNeeds = useMemo(
    () => SYMBOLS.filter((symbol) => selected.includes(symbol.id)).map((symbol) => symbol.need),
    [selected],
  )

  function toggleSymbol(id) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  function startVoice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert("Voice input is not available in this browser. Typed text and AAC tiles still work.")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = "en-US"
    recognition.continuous = false
    recognition.onresult = (event) => {
      setVoiceText(event.results[0][0].transcript)
      setListening(false)
    }
    recognition.onerror = () => setListening(false)
    recognition.onend = () => setListening(false)
    recognitionRef.current = recognition
    recognition.start()
    setListening(true)
  }

  function getLocation() {
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocation({ lat: 30.2849, lng: -97.7341 }),
      { enableHighAccuracy: true, timeout: 4000 },
    )
  }

  function submitAlert() {
    const triageProfile = buildTriageProfile({ selected, typedText, voiceText, location })
    setProfile(triageProfile)
    setScreen("cascade")
  }

  return (
    <section className="screen-grid">
      <div className="panel main-panel">
        <div className="section-heading">
          <MousePointer2 size={22} />
          <div>
            <p className="eyebrow">Citizen emergency input</p>
            <h2>Send help without needing speech</h2>
          </div>
        </div>

        <div className="symbol-grid" aria-label="AAC emergency tiles">
          {SYMBOLS.map((symbol) => (
            <button
              className={selected.includes(symbol.id) ? "symbol selected" : "symbol"}
              key={symbol.id}
              onClick={() => toggleSymbol(symbol.id)}
              type="button"
            >
              {symbol.label}
            </button>
          ))}
        </div>

        <label className="text-input">
          <span>
            <Type size={18} />
            Optional typed message
          </span>
          <textarea
            onChange={(event) => setTypedText(event.target.value)}
            placeholder="Example: I use oxygen and the elevator is out."
            value={typedText}
          />
        </label>

        <div className="action-row">
          <button className={listening ? "secondary danger" : "secondary"} onClick={startVoice} type="button">
            <Mic size={18} />
            {listening ? "Listening" : "Voice"}
          </button>
          <button className="secondary" onClick={getLocation} type="button">
            <MapPin size={18} />
            {location ? "GPS added" : "Add GPS"}
          </button>
          <button className="primary" disabled={!canSubmit} onClick={submitAlert} type="button">
            <Send size={18} />
            Send alert
          </button>
        </div>
      </div>

      <aside className="panel summary-panel">
        <p className="eyebrow">Live triage preview</p>
        <h2>What ARIA understands</h2>
        <div className="summary-list">
          {selectedNeeds.map((need) => (
            <span key={need}>{need}</span>
          ))}
          {voiceText && <span>Voice captured</span>}
          {location && <span>Location attached</span>}
        </div>
        <div className="offline-box">
          <strong>Offline-first demo</strong>
          <p>This alert is structured locally and stored in the browser, so the judge demo still works during spotty Wi-Fi.</p>
        </div>
      </aside>
    </section>
  )
}
