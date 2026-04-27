function CTASection({ bookingEmail, researchEmail }) {
    return (
        <section className="cta">
            <div className="cta-content">
                <div className="cta-card">
                    <h2>Book a Stay</h2>
                    <p>Join us for an unforgettable experience near Kīlauea. Workshops, trails, dining, and wellness — all in one place.</p>
                    <a href={`mailto:${bookingEmail}`} className="cta-button">
                        Book a Stay
                    </a>
                </div>
                <div className="cta-card">
                    <h2>Plan a Research Visit</h2>
                    <p>Dedicated research spaces, networking opportunities, and proximity to the crater — everything you need to do your best work.</p>
                    <a href={`mailto:${researchEmail}`} className="cta-button cta-button-research">
                        Plan a Research Visit
                    </a>
                </div>
            </div>
        </section>
    );
}

export default CTASection;