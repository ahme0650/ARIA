import { ArrowRight, CheckCircle2, Clock3, PhoneCall, RadioTower } from "lucide-react"

const contacts = {
  neighbor: {
    name: "Ari Chen",
    role: "Neighbor",
    detail: "2 minutes away, has apartment access code",
    action: "Check door, bring spare battery, confirm evacuation route",
  },
  volunteer: {
    name: "Jordan Lee",
    role: "CERT Volunteer",
    detail: "8 minutes away, trained in accessible evacuation",
    action: "Bring transfer sling and coordinate accessible transport",
  },
  responder: {
    name: "Station 4",
    role: "Emergency Response",
    detail: "Dispatched with disability guidance packet",
    action: "Prioritize power-dependent mobility and assisted evacuation",
  },
}

export default function CascadeScreen({ profile, setScreen }) {
  const order = profile?.cascadeOrder?.length ? profile.cascadeOrder : ["neighbor", "volunteer", "responder"]

  return (
    <section className="stacked-screen">
      <div className="panel hero-panel">
        <div>
          <p className="eyebrow">Caregiver cascade</p>
          <h2>ARIA activates the closest safe support first</h2>
        </div>
        <div className={`urgency-badge ${profile.urgency}`}>{profile.urgency}</div>
      </div>

      <div className="cascade-track">
        {order.map((key, index) => {
          const contact = contacts[key]
          const active = index === 0
          return (
            <article className={active ? "cascade-card active" : "cascade-card"} key={key}>
              <div className="cascade-topline">
                {active ? <PhoneCall size={20} /> : <Clock3 size={20} />}
                <span>Step {index + 1}</span>
              </div>
              <h3>{contact.name}</h3>
              <p className="role">{contact.role}</p>
              <p>{contact.detail}</p>
              <div className="dispatch-note">
                <CheckCircle2 size={18} />
                {contact.action}
              </div>
              {index < order.length - 1 && <ArrowRight className="flow-arrow" size={22} />}
            </article>
          )
        })}
      </div>

      <div className="panel split-panel">
        <div>
          <p className="eyebrow">Queued message</p>
          <h2>{profile.name} needs {profile.needs[0]?.toLowerCase()}</h2>
          <p>{profile.transcript || "No transcript available."}</p>
        </div>
        <button className="primary" onClick={() => setScreen("responder")} type="button">
          <RadioTower size={18} />
          Open responder view
        </button>
      </div>
    </section>
  )
}
