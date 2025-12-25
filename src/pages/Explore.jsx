import React, { useState, useEffect } from 'react';
import PlanetSidebar from '../components/explore/PlanetSidebar';
import PlanetViewer from '../components/explore/PlanetViewer';
import PlanetInfoCard from '../components/explore/PlanetInfoCard';
import planetService from '../services/planetService';
import '../components/explore/Explore.css';
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
        return <div className="explore-loading">Đang tải dữ liệu...</div>;
    }
    return (
        <div className="explore-page">
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