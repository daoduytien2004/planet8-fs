import './Explore.css';
function PlanetSidebar({ planets, selectedPlanet, onSelectPlanet }) {
    return (
        <div className="planet-sidebar">
            <div className="sidebar-heading">
                <h3>DANH SÁCH HÀNH TINH</h3>
            </div>
            <div className="planet-list">
                {planets.map(planet => {
                    return (
                        <div key={planet.id} className={`planet-item ${planet.id === selectedPlanet?.id ? 'active' : ''}`}
                            onClick={() => onSelectPlanet(planet)}>
                            <div className="explore-planet-name">{planet.nameVi}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
export default PlanetSidebar;