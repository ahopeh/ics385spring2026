function Footer({ onNavigate}) {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p className="footer-logo">Hale Ōhiʻa Lehua</p>
                <nav className="footer-nav">
                    <button className="footer-nav-btn" onClick={() => onNavigate('home')}>Home</button>
                    <button className="footer-nav-btn" onClick={() => onNavigate('dashboard')}>Dashboard</button>
                    <a href="http://localhost:3000/admin/login">Admin</a>
                </nav>
                <p className="footer-copy">© 2026 Hale Ōhiʻa Lehua · Hawaiʻi Island</p>
            </div>
        </footer>
    );
}

export default Footer;