import React from 'react';
import './Explore.css';

const PlanetInfoCard = ({ planet, planetDetails }) => {
    if (!planet) {
        return null;
    }

    // Helper functions for formatting
    const formatNumber = (num) => {
        if (!num && num !== 0) return 'N/A';
        return num.toLocaleString('vi-VN');
    };

    const formatMass = (massKg) => {
        if (!massKg) return 'N/A';
        // Convert to scientific notation (e.g., 3.3×10²³)
        const exp = Math.floor(Math.log10(massKg));
        const mantissa = (massKg / Math.pow(10, exp)).toFixed(2);
        return `${mantissa}×10${exp >= 0 ? '⁺' : '⁻'}${Math.abs(exp)} kg`;
    };

    const formatDistance = (km) => {
        if (!km) return 'N/A';
        // Convert to triệu km
        const million = km / 1000000;
        return `${million.toFixed(1)} triệu km`;
    };

    const formatRotation = (hours) => {
        if (!hours && hours !== 0) return 'N/A';
        if (hours < 24) return `${hours.toFixed(1)} giờ`;
        const days = (hours / 24).toFixed(1);
        return `${days} ngày`;
    };

    // Extract data
    const physical = planetDetails?.physical || {};
    const orbit = planetDetails?.orbit || {};
    const moons = planetDetails?.moons || [];
    const gases = planetDetails?.gases || [];

    return (
        <div className="planet-info-card">
            {/* Header */}
            <div className="card-header">
                <span className="planet-order">
                    VỊ TRÍ THỨ {orbit.orderFromSun || planet.id}
                </span>
            </div>

            {/* Title */}
            <h1 className="planet-title">{planet.nameVi}</h1>
            <p className="planet-subtitle">
                {planet.nameEn || planet.shortDescription || 'The Blue Planet'}
            </p>

            {/* Description */}
            <p className="planet-description">
                {planet.overview || planetDetails?.overview || 'Đang tải thông tin...'}
            </p>

            {/* Physical Properties Section */}
            <div className="explore-info-section">
                <h3 className="section-title"> Đặc Điểm Vật Lý</h3>
                <div className="explore-stats-grid">
                    <div className="explore-stat-item">
                        <div className="explore-stat-label">
                            BÁN KÍNH
                        </div>
                        <div className="explore-stat-value">
                            {physical.radiusKm ? `${formatNumber(physical.radiusKm)} km` : 'N/A'}
                        </div>
                    </div>
                    <div className="explore-stat-item">
                        <div className="explore-stat-label">
                            KHỐI LƯỢNG
                        </div>
                        <div className="explore-stat-value">
                            {formatMass(physical.massKg)}
                        </div>
                    </div>
                    <div className="explore-stat-item">
                        <div className="explore-stat-label">
                            NHIỆT ĐỘ TB
                        </div>
                        <div className="explore-stat-value">
                            {physical.temperatureAvgC ? `${physical.temperatureAvgC}°C` : 'N/A'}
                        </div>
                    </div>
                    <div className="explore-stat-item">
                        <div className="explore-stat-label">
                            TRỌNG LỰC
                        </div>
                        <div className="explore-stat-value">
                            {physical.gravity ? `${physical.gravity} m/s²` : 'N/A'}
                        </div>
                    </div>
                    <div className="explore-stat-item">
                        <div className="explore-stat-label">
                            MẬT ĐỘ
                        </div>
                        <div className="explore-stat-value">
                            {physical.density ? `${physical.density} g/cm³` : 'N/A'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Orbital Properties Section */}
            <div className="explore-info-section">
                <h3 className="section-title">Thông Số Quỹ Đạo</h3>
                <div className="explore-stats-grid">
                    <div className="explore-stat-item">
                        <div className="explore-stat-label">
                            KHOẢNG CÁCH
                        </div>
                        <div className="explore-stat-value">
                            {formatDistance(orbit.distanceFromSunKm)}
                        </div>
                    </div>
                    <div className="explore-stat-item">
                        <div className="explore-stat-label">
                            CHU KỲ QUỸ ĐẠO
                        </div>
                        <div className="explore-stat-value">
                            {orbit.orbitalPeriodDays ? `${formatNumber(orbit.orbitalPeriodDays)} ngày` : 'N/A'}
                        </div>
                    </div>
                    <div className="explore-stat-item">
                        <div className="explore-stat-label">
                            CHU KỲ TỰ QUAY
                        </div>
                        <div className="explore-stat-value">
                            {formatRotation(orbit.rotationPeriodHours)}
                        </div>
                    </div>
                    <div className="explore-stat-item">
                        <div className="explore-stat-label">
                            GÓC NGHIÊNG
                        </div>
                        <div className="explore-stat-value">
                            {orbit.axialTiltDeg !== null && orbit.axialTiltDeg !== undefined
                                ? `${orbit.axialTiltDeg}°`
                                : 'N/A'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Atmospheric Composition */}
            {gases && gases.length > 0 && (
                <div className="explore-info-section">
                    <h3 className="section-title">Thành Phần Khí Quyển</h3>
                    <div className="atmosphere-bars">
                        {gases
                            .sort((a, b) => b.PlanetAtmosphere.percentage - a.PlanetAtmosphere.percentage)
                            .map((gas, index) => (
                                <div key={gas.id || index} className="gas-bar">
                                    <div className="gas-info">
                                        <span className="gas-name">{gas.name}</span>
                                        <span className="gas-percentage">
                                            {gas.PlanetAtmosphere.percentage}%
                                        </span>
                                    </div>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${gas.PlanetAtmosphere.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* Moons */}
            {moons && moons.length > 0 && (
                <div className="explore-info-section">
                    <h3 className="section-title">Vệ Tinh ({moons.length})</h3>
                    <div className="moons-list">
                        {moons.slice(0, 5).map((moon, index) => (
                            <span key={moon.id || index} className="moon-tag">
                                {moon.nameVi || moon.nameEn || `Moon ${index + 1}`}
                            </span>
                        ))}
                        {moons.length > 5 && (
                            <span className="moon-tag more">+{moons.length - 5} khác</span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlanetInfoCard;