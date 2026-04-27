export default function VolcanoLoader() {
    return (
        <div className="volcano-loader">
            <svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg" className="volcano-svg">
                {/* Lava streams */}
                <path className="lava-stream lava-1" d="M50 20 Q45 35 40 50" stroke="#e8a245" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path className="lava-stream lava-2" d="M50 20 Q52 35 55 50" stroke="#c0501a" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path className="lava-stream lava-3" d="M50 20 Q48 30 44 42" stroke="#e85d04" strokeWidth="2" fill="none" strokeLinecap="round" />
                {/* Sparks */}
                <circle className="spark spark-1" cx="50" cy="18" r="2" fill="#e8a245" />
                <circle className="spark spark-2" cx="46" cy="14" r="1.5" fill="#ffbe0b" />
                <circle className="spark spark-3" cx="54" cy="12" r="1" fill="#e8a245" />
                <circle className="spark spark-4" cx="48" cy="10" r="1.5" fill="#c0501a" />
                {/* Volcano body */}
                <polygon points="20,75 50,20 80,75" fill="#2e1f0e" stroke="#5a3e2b" strokeWidth="1" />
                {/* Lava pool at base */}
                <ellipse cx="50" cy="75" rx="30" ry="4" fill="#c0501a" opacity="0.6" />
            </svg>
            <p className="loader-text">Loading conditions…</p>
        </div>
    )
  }