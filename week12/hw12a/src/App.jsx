import IslandCard from './components/IslandCard';
import './App.css';

const islands = [
  {
    id: 1,
    name: "Maui",
    description: "Known as the Valley Isle, famous for Road to Hana and Haleakalā.",
    tip: "Visit Haleakalā crater at sunrise — arrive 30 minutes early.",
  },
  {
    id: 2,
    name: "Oahu",
    description: "Home to Honolulu, Waikiki Beach, and Pearl Harbor.",
    tip: "Take TheBus — it covers the entire island and is very affordable.",
  },
  {
    id: 3,
    name: "Kauaʻi",
    description: "The Garden Isle, renowned for Nā Pali Coast and Waimea Canyon.",
    tip: "Rent a kayak to reach Honopu Beach — no other access is permitted.",
  },
];

function App() {
  return (
    <div className="app">
      <h1>Hawaii Island Cards</h1>
      {islands.map(island => (
        <IslandCard key={island.id} {...island} />
      ))}
    </div>
  );
}

export default App;