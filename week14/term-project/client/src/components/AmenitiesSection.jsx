function AmenityCard({ name, description }) {
    return (
        <div className="amenity-card">
            <h3>{name}</h3>
            <p>{description}</p>
        </div>
    );
}

function AmenitiesSection({ amenities }) {
    return (
        <section className="amenities">
            <div className="amenities-content">
                <h2>What We Offer</h2>
                <div className="amenities-grid">
                    {amenities.map(amenity => (
                        <AmenityCard
                            key={amenity.id}
                            name={amenity.name}
                            description={amenity.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default AmenitiesSection;