import React, { useState, useEffect } from 'react';
import PlanetSidebar from '../components/explore/PlanetSidebar';
import PlanetViewer from '../components/explore/PlanetViewer';
import PlanetInfoCard from '../components/explore/PlanetInfoCard';
import planetService from '../apis/planetApi';

function Explore() {
    const [planets, setPlanets] = useState([]);
    const [selectedPlanet, setSelectedPlanet] = useState(null);
    const [planetDetails, setPlanetDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    // Load danh sách planets khi component mount
    useEffect(() => {
        loadPlanets();
    }, []);
    // Load chi tiết planet khi chọn planet mới
    useEffect(() => {
        if (selectedPlanet) {
            loadPlanetDetails(selectedPlanet.id);
        }
    }, [selectedPlanet]);
    const loadPlanets = async () => {
        try {
            setLoading(true);
            const planetsArray = await planetService.getAll();
            setPlanets(planetsArray);
            // Tự động chọn planet đầu tiên (hoặc Trái Đất)
            const earth = planetsArray.find(p => p.planetId === 'earth');
            setSelectedPlanet(earth || planetsArray[0]);
        } catch (error) {
            console.error('Error loading planets:', error);
        } finally {
            setLoading(false);
        }
    };
    const loadPlanetDetails = async (planetId) => {
        try {
            const planetData = await planetService.getById(planetId);
            setPlanetDetails(planetData);
        } catch (error) {
            console.error('Error loading planet details:', error);
        }
    };
    const handleSelectPlanet = (planet) => {
        setSelectedPlanet(planet);
    };
    if (loading) {
        return <div className="flex items-center justify-center h-screen text-2xl text-indigo-500">Đang tải dữ liệu...</div>;
    }
    return (
        <div className="grid grid-cols-[250px_1fr_420px] xl:grid-cols-[220px_1fr_380px] lg:grid-cols-[200px_1fr] h-[90vh] bg-gradient-to-br from-[#0a0e27] to-[#1a1d3d] text-white overflow-hidden relative">
            <div className="absolute inset-0 pointer-events-none opacity-30 bg-[size:200px_200px] bg-[image:radial-gradient(2px_2px_at_20px_30px,white,transparent),radial-gradient(2px_2px_at_60px_70px,white,transparent),radial-gradient(1px_1px_at_50px_50px,white,transparent)]" />

            <PlanetSidebar
                planets={planets}
                selectedPlanet={selectedPlanet}
                onSelectPlanet={handleSelectPlanet}
            />
            <PlanetViewer planet={selectedPlanet} />
            <PlanetInfoCard
                planet={selectedPlanet}
                planetDetails={planetDetails}
            />
        </div>
    );
}
export default Explore;