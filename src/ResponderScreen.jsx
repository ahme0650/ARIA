import { AlertTriangle, ClipboardCheck, MessageSquareText, Route, Zap } from "lucide-react"

export default function ResponderScreen({ profile, setScreen }) {
  return (
    <section className="screen-grid responder-grid">
      <div className="panel main-panel">
        <div className="case-header">
          <div>
            <p className="eyebrow">Responder co-pilot</p>
            <h2>{profile.name} emergency profile</h2>
          </div>
          <div className={`urgency-badge ${profile.urgency}`}>{profile.urgency}</div>
        </div>

        <div className="case-location">
          <Route size={20} />
          <span>{profile.location}</span>
        </div>

        <div className="guidance-block">
          <MessageSquareText size={22} />
          <div>
            <h3>Communication plan</h3>
            <p>{profile.communicationMethod}</p>
          </div>
        </div>

        <div className="guidance-block warning">
          <AlertTriangle size={22} />
          <div>
            <h3>Responder guidance</h3>
            <p>{profile.responderGuidance}</p>
          </div>
        </div>

        <button className="secondary" onClick={() => setScreen("citizen")} type="button">
          Start another alert
        </button>
      </div>

      <aside className="panel summary-panel">
        <p className="eyebrow">At-a-glance</p>
        <h2>Field checklist</h2>
        <div className="checklist">
          {profile.needs.map((need) => (
            <div key={need}>
              <ClipboardCheck size={18} />
              <span>{need}</span>
            </div>
          ))}
        </div>

        <div className="dependency-box">
          <Zap size={20} />
          <div>
            <strong>Dependencies</strong>
            <p>{profile.medicalDependencies.join(", ")}</p>
          </div>
        </div>
      </aside>
    </section>
  )
}
