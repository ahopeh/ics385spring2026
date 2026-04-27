function ConditionsSnapshot({ alertLevel, alertMessage }) {
    const alertColors = {
        NORMAL: "#3b6e4f",
        ADVISORY: "#E8A030",
        WATCH: "#D85A30",
        WARNING: "#C0392B",
    };

    const color = alertColors[alertLevel] || alertColors.ADVISORY;

    return (
        <section className="conditions">
            <div className="conditions-content">
                <h2>Current Conditions</h2>
                <div className="conditions-status" style={{ borderLeftColor: color }}>
                    <span className="conditions-level" style={{ color }}>
                        {alertLevel}
                    </span>
                    <p>{alertMessage}</p>
                    <a href="#" className="conditions-link">
                        View Full Conditions →
                    </a>
                </div>
            </div>
        </section>
    );
}

export default ConditionsSnapshot;