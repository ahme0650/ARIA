import { useEffect, useState } from "react"
import { ArrowLeft, Save, ShieldCheck, Trash2 } from "lucide-react"
import useIsMobile from "../useIsMobile"

const storageKey = "aria-saved-citizen-profile"

const emptyProfile = {
  name: "",
  primaryDisability: "",
  medicalDevices: "",
  communicationMethod: "",
  emergencyContacts: "",
  medicationNotes: "",
  evacuationNotes: "",
}

export default function ProfileSetup({ setRole }) {
  const isMobile = useIsMobile()
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem(storageKey)
    return saved ? { ...emptyProfile, ...JSON.parse(saved) } : emptyProfile
  })
  const [savedMessage, setSavedMessage] = useState("")

  useEffect(() => {
    if (!savedMessage) return undefined
    const timer = window.setTimeout(() => setSavedMessage(""), 2600)
    return () => window.clearTimeout(timer)
  }, [savedMessage])

  function updateField(field, value) {
    setProfile((current) => ({ ...current, [field]: value }))
  }

  function saveProfile(event) {
    event.preventDefault()
    localStorage.setItem(storageKey, JSON.stringify({ ...profile, updatedAt: new Date().toISOString() }))
    setSavedMessage("Saved locally on this device. No internet required.")
  }

  function clearProfile() {
    localStorage.removeItem(storageKey)
    setProfile(emptyProfile)
    setSavedMessage("Saved profile cleared from this device.")
  }

  return (
    <main aria-label="Pre-disaster ARIA profile setup" style={sx(styles.page, isMobile, mobileStyles.page)}>
      <button
        aria-label="Return to ARIA role selection"
        style={styles.backButton}
        onClick={() => setRole("landing")}
        type="button"
      >
        <ArrowLeft aria-hidden="true" size={18} />
        Role select
      </button>

      <header style={sx(styles.header, isMobile, mobileStyles.header)}>
        <div>
          <p style={styles.kicker}>Pre-disaster registration</p>
          <h1 style={sx(styles.title, isMobile, mobileStyles.title)}>Build your emergency profile before you need it</h1>
          <p style={sx(styles.subtitle, isMobile, mobileStyles.subtitle)}>
            Store disability, device, communication, and contact details locally on this device for
            one-tap emergency use later.
          </p>
        </div>
        <div aria-label="Local offline profile storage enabled" role="status" style={styles.storageBadge}>
          <ShieldCheck aria-hidden="true" size={18} />
          Offline local storage
        </div>
      </header>

      <form aria-describedby="profile-storage-note" onSubmit={saveProfile} style={sx(styles.form, isMobile, mobileStyles.form)}>
        <section aria-label="Profile details" style={sx(styles.panel, isMobile, mobileStyles.panel)}>
          <LabeledInput
            label="Name"
            field="name"
            value={profile.name}
            onChange={updateField}
            placeholder="Example: Maya Rodriguez"
          />
          <LabeledInput
            label="Primary disability"
            field="primaryDisability"
            value={profile.primaryDisability}
            onChange={updateField}
            placeholder="Example: Non-speaking, mobility disability"
          />
          <LabeledInput
            label="Medical devices I depend on"
            field="medicalDevices"
            value={profile.medicalDevices}
            onChange={updateField}
            placeholder="Example: Power wheelchair, oxygen concentrator, ventilator, charger"
            multiline
          />
          <LabeledInput
            label="Preferred communication method"
            field="communicationMethod"
            value={profile.communicationMethod}
            onChange={updateField}
            placeholder="Example: Large written yes/no questions, AAC board, ASL, speak clearly"
            multiline
          />
        </section>

        <section aria-label="Emergency support details" style={sx(styles.panel, isMobile, mobileStyles.panel)}>
          <LabeledInput
            label="Emergency contacts"
            field="emergencyContacts"
            value={profile.emergencyContacts}
            onChange={updateField}
            placeholder="Example: Ari Chen, neighbor, 512-555-0104; Jordan Lee, sister, 512-555-0188"
            multiline
          />
          <LabeledInput
            label="Medication or treatment notes"
            field="medicationNotes"
            value={profile.medicationNotes}
            onChange={updateField}
            placeholder="Example: Anti-seizure medication in backpack; insulin must stay cold"
            multiline
          />
          <LabeledInput
            label="Evacuation notes"
            field="evacuationNotes"
            value={profile.evacuationNotes}
            onChange={updateField}
            placeholder="Example: Cannot use stairs without lift team. Keep wheelchair and charger with me."
            multiline
          />

          <p id="profile-storage-note" style={styles.note}>
            ARIA saves this only in your browser's localStorage. It remains available on this device
            even with no internet connection.
          </p>
        </section>

        <div style={sx(styles.actions, isMobile, mobileStyles.actions)}>
          <button aria-label="Save emergency profile to this device" style={sx(styles.saveButton, isMobile, mobileStyles.actionButton)} type="submit">
            <Save aria-hidden="true" size={20} />
            Save Profile
          </button>
          <button aria-label="Clear saved emergency profile from this device" onClick={clearProfile} style={sx(styles.clearButton, isMobile, mobileStyles.actionButton)} type="button">
            <Trash2 aria-hidden="true" size={20} />
            Clear
          </button>
          <button aria-label="Open citizen emergency screen" onClick={() => setRole("citizen")} style={sx(styles.useButton, isMobile, mobileStyles.actionButton)} type="button">
            Use in emergency
          </button>
        </div>
        {savedMessage && <p aria-live="polite" style={styles.savedMessage}>{savedMessage}</p>}
      </form>
    </main>
  )
}

function LabeledInput({ label, field, value, onChange, placeholder, multiline = false }) {
  const id = `profile-${field}`
  const commonProps = {
    id,
    "aria-label": label,
    onChange: (event) => onChange(field, event.target.value),
    placeholder,
    style: multiline ? styles.textarea : styles.input,
    value,
  }

  return (
    <label htmlFor={id} style={styles.label}>
      <span>{label}</span>
      {multiline ? <textarea {...commonProps} /> : <input {...commonProps} />}
    </label>
  )
}

const styles = {
  page: {
    minHeight: "100svh",
    padding: 28,
    background:
      "radial-gradient(circle at top left, rgba(56, 189, 248, 0.16), transparent 30%), #0a0a0f",
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
    color: "#7dd3fc",
    fontSize: 13,
    fontWeight: 950,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  title: {
    maxWidth: 900,
    margin: 0,
    color: "#ffffff",
    fontSize: "clamp(38px, 5vw, 72px)",
    lineHeight: 0.98,
    letterSpacing: 0,
  },
  subtitle: {
    maxWidth: 760,
    margin: "14px 0 0",
    color: "#cbd5e1",
    fontSize: 18,
    lineHeight: 1.5,
  },
  storageBadge: {
    display: "inline-flex",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 9,
    padding: "12px 14px",
    border: "1px solid rgba(56, 189, 248, 0.42)",
    borderRadius: 999,
    background: "rgba(12, 74, 110, 0.32)",
    color: "#bae6fd",
    fontWeight: 950,
  },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 18,
  },
  panel: {
    display: "grid",
    alignContent: "start",
    gap: 16,
    padding: 22,
    border: "1px solid rgba(248, 250, 252, 0.12)",
    borderRadius: 16,
    background: "rgba(15, 23, 42, 0.72)",
  },
  label: {
    display: "grid",
    gap: 8,
    color: "#e0f2fe",
    fontWeight: 900,
  },
  input: {
    minHeight: 52,
    padding: "12px 14px",
    border: "1px solid rgba(248, 250, 252, 0.16)",
    borderRadius: 12,
    background: "rgba(2, 6, 23, 0.76)",
    color: "#ffffff",
    font: "inherit",
  },
  textarea: {
    minHeight: 118,
    padding: "12px 14px",
    border: "1px solid rgba(248, 250, 252, 0.16)",
    borderRadius: 12,
    background: "rgba(2, 6, 23, 0.76)",
    color: "#ffffff",
    font: "inherit",
    resize: "vertical",
  },
  note: {
    margin: 0,
    padding: 14,
    border: "1px solid rgba(56, 189, 248, 0.28)",
    borderRadius: 12,
    background: "rgba(12, 74, 110, 0.18)",
    color: "#bae6fd",
    lineHeight: 1.5,
    fontWeight: 750,
  },
  actions: {
    gridColumn: "1 / -1",
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
  },
  saveButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: 9,
    minHeight: 56,
    padding: "13px 18px",
    border: "1px solid #38bdf8",
    borderRadius: 12,
    background: "#38bdf8",
    color: "#04111f",
    cursor: "pointer",
    fontSize: 17,
    fontWeight: 950,
  },
  clearButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: 9,
    minHeight: 56,
    padding: "13px 18px",
    border: "1px solid rgba(248, 250, 252, 0.14)",
    borderRadius: 12,
    background: "rgba(15, 23, 42, 0.84)",
    color: "#f8fafc",
    cursor: "pointer",
    fontSize: 17,
    fontWeight: 950,
  },
  useButton: {
    minHeight: 56,
    padding: "13px 18px",
    border: "1px solid rgba(239, 68, 68, 0.64)",
    borderRadius: 12,
    background: "rgba(127, 29, 29, 0.42)",
    color: "#fecaca",
    cursor: "pointer",
    fontSize: 17,
    fontWeight: 950,
  },
  savedMessage: {
    gridColumn: "1 / -1",
    margin: 0,
    color: "#bae6fd",
    fontWeight: 900,
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
    gap: 14,
    margin: "20px 0",
  },
  title: {
    fontSize: "clamp(32px, 10vw, 46px)",
    lineHeight: 1.05,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    gridTemplateColumns: "1fr",
    gap: 14,
  },
  panel: {
    padding: 16,
    borderRadius: 12,
  },
  actions: {
    display: "grid",
    gridTemplateColumns: "1fr",
  },
  actionButton: {
    width: "100%",
    justifyContent: "center",
    textAlign: "center",
    whiteSpace: "normal",
  },
}
