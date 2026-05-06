function CTASection({ onBooking, onResearch }) {
    return (
        <section className="cta">
            <div className="cta-content">
                <div className="cta-card">
                    <h2>Book a Stay</h2>
                    <p>Join us for an unforgettable experience near Kīlauea. Workshops, trails, dining, and wellness — all in one place.</p>
                    <button onClick={onBooking} className="cta-button">
                        Book a Stay
                    </button>
                </div>
                <div className="cta-card">
                    <h2>Plan a Research Visit</h2>
                    <p>Dedicated research spaces, networking opportunities, and proximity to the crater — everything you need to do your best work.</p>
                    <button onClick={onResearch} className="cta-button cta-button-research">
                        Plan a Research Visit
                    </button>
                </div>
            </div>
        </section>
    );
}

export default CTASection;