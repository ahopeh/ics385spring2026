function IslandCard({ name, description, tip }) {
    return (
        <div className="island-card">
            <h2>{name}</h2>
            <p>{description}</p>
            <p className="tip"><strong>Tip:</strong> {tip}</p>
        </div>
    );
}

export default IslandCard;