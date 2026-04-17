import IslandList from './IslandList'
import './App.css'

const islands = [
  {
    id: 1,
    name: "Maui",
    nickname: "Valley Isle",
    segment: "Honeymoon",
    avgStay: 6.2,
    img: "https://picsum.photos/300/200?random=1"
  },
  {
    id: 2,
    name: "O'ahu",
    nickname: "Gathering Place",
    segment: "First-time",
    avgStay: 4.8,
    img: "https://picsum.photos/300/200?random=2"
  },
  {
    id: 3,
    name: "Kaua'i",
    nickname: "Garden Isle",
    segment: "Eco-tourist",
    avgStay: 7.1,
    img: "https://picsum.photos/300/200?random=3"
  },
  {
    id: 4,
    name: "Hawai'i",
    nickname: "Big Island",
    segment: "Adventure",
    avgStay: 8.3,
    img: "https://picsum.photos/300/200?random=4"
  },
  {
    id: 5,
    name: "Moloka'i",
    nickname: "Friendly Isle",
    segment: "Cultural",
    avgStay: 5.4,
    img: "https://picsum.photos/300/200?random=7"
  },
]

export default function App() {
  return (
    <div className="app">
      <header className="site-header">
        <h1>Hawaiʻi Visitor Overview</h1>
        <p className="subtitle">Island statistics by visitor segment</p>
      </header>
      <IslandList islands={islands} />
    </div>
  )
}