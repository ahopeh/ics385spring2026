import { islandColors } from '../data/hawaiiData'

export default function IslandSelector({ selectedIslands, onToggle }) {
    const islands = Object.keys(islandColors)

    return (
        <div className="island-selector">
            {islands.map(island => {
                const isSelected = selectedIslands.includes(island)
                const color = islandColors[island]
                return (
                    <button
                        key={island}
                        className={`island-btn ${isSelected ? 'selected' : ''}`}
                        onClick={() => onToggle(island)}
                        style={{
                            borderColor: color,
                            backgroundColor: isSelected ? color : 'transparent',
                            color: isSelected ? '#1a1008' : color,
                        }}
                    >
                        {island}
                    </button>
                )
            })}
        </div>
    )
}