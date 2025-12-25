function PlanetSidebar({ planets, selectedPlanet, onSelectPlanet }) {
    return (
        <div className="bg-slate-900/80 backdrop-blur-sm border-r border-indigo-500/20 flex flex-col z-10">
            <div className="p-6 border-b border-indigo-500/20">
                <h3 className="text-lg font-semibold tracking-widest text-slate-400 uppercase">DANH SÁCH HÀNH TINH</h3>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
                {planets.map(planet => {
                    return (
                        <div key={planet.id} className={`flex items-center gap-4 px-6 py-4 cursor-pointer transition-all duration-300 border-l-[3px] hover:bg-indigo-500/10 ${planet.id === selectedPlanet?.id ? 'bg-indigo-500/20 border-l-indigo-500' : 'border-transparent'}`}
                            onClick={() => onSelectPlanet(planet)}>
                            <div className="text-base font-bold text-white mb-0">{planet.nameVi}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
export default PlanetSidebar;