export default function Header({ onNavigate }) {
    return (
        <header className="header">
            <nav className="nav">
                <button className="nav-logo" onClick={() => onNavigate('home')}>
                    Hale Ōhiʻa Lehua
                </button>
                <ul className="nav-links">
                    <li>
                        <button className="nav-btn" onClick={() => {
                            onNavigate('home')
                            setTimeout(() => {
                                document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })
                            }, 100)
                        }}>
                            Book Now
                        </button>
                    </li>
                    <li>
                        <button className="nav-btn" onClick={() => onNavigate('dashboard')}>
                            Visitor Dashboard
                        </button>
                    </li>
                    <li>
                        <a className="nav-btn" href="http://localhost:3000/admin/login">
                            Admin
                        </a>
                    </li>
                </ul>
            </nav>
        </header>
    )
  }