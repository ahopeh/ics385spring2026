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
                        <button className="nav-btn" onClick={() => onNavigate('admin')}>
                            Admin
                        </button>
                    </li>
                </ul>
            </nav>
        </header>
    )
  }