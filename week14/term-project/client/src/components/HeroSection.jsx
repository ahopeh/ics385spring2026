function HeroSection({ name, island, tagline }) {
    return (
        <section className="hero">
            <video
                className="hero-video"
                autoPlay
                muted
                loop
                playsInline
                aria-label="Kīlauea volcano lava fountaining at Halemaʻumaʻu crater, Hawaiʻi Island"
            >
                <source src="/videos/hero.mp4" type="video/mp4" />
            </video>
            <div className="hero-overlay" />
            <div className="hero-content">
                <p className="hero-island">{island}</p>
                <h1 className="hero-title">{name}</h1>
                <p className="hero-tagline">{tagline}</p>
            </div>
        </section>
    );
}

export default HeroSection;