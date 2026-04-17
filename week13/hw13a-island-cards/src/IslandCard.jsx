export default function IslandCard({ name, nickname, segment, avgStay, img }) {
    return (
        <div className="island-card">
            <img src={img} alt={`${name} — ${nickname} island photo`} />
            <div className="card-body">
                <h2>{name}</h2>
                <p className="nickname">{nickname}</p>
                <span className="segment-badge">{segment}</span>
                <p className="avg-stay">Avg stay: <strong>{avgStay} days</strong></p>
            </div>
        </div>
    )
  }