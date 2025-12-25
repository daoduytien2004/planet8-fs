import React from 'react';

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
        <div className="bg-slate-900/90 backdrop-blur-sm border-l border-indigo-500/20 p-8 overflow-y-auto z-10 flex flex-col hidden lg:flex">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-indigo-500 font-semibold tracking-widest">
                    VỊ TRÍ THỨ {orbit.orderFromSun || planet.id}
                </span>
            </div>

            {/* Title */}
            <h1 className="text-[2.5rem] font-bold mb-2 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">{planet.nameVi}</h1>
            <p className="text-lg text-slate-400 mb-6">
                {planet.nameEn || planet.shortDescription || 'The Blue Planet'}
            </p>

            {/* Description */}
            <p className="text-sm leading-relaxed text-slate-300 mb-8">
                {planet.overview || planetDetails?.overview || 'Đang tải thông tin...'}
            </p>

            {/* Physical Properties Section */}
            <div className="mb-8">
                <h3 className="text-base font-semibold text-slate-200 mb-4 pb-2 border-b border-indigo-500/20 flex items-center gap-2"> Đặc Điểm Vật Lý</h3>
                <div className="grid grid-cols-2 gap-3 mb-8 w-full">
                    <div className="bg-slate-800/50 border border-indigo-500/20 rounded-xl p-4 w-auto max-w-none">
                        <div className="flex items-center gap-2 text-[0.7rem] text-slate-400 font-semibold tracking-wider mb-2">
                            BÁN KÍNH
                        </div>
                        <div className="text-base font-bold text-white">
                            {physical.radiusKm ? `${formatNumber(physical.radiusKm)} km` : 'N/A'}
                        </div>
                    </div>
                    <div className="bg-slate-800/50 border border-indigo-500/20 rounded-xl p-4 w-auto max-w-none">
                        <div className="flex items-center gap-2 text-[0.7rem] text-slate-400 font-semibold tracking-wider mb-2">
                            KHỐI LƯỢNG
                        </div>
                        <div className="text-base font-bold text-white">
                            {formatMass(physical.massKg)}
                        </div>
                    </div>
                    <div className="bg-slate-800/50 border border-indigo-500/20 rounded-xl p-4 w-auto max-w-none">
                        <div className="flex items-center gap-2 text-[0.7rem] text-slate-400 font-semibold tracking-wider mb-2">
                            NHIỆT ĐỘ TB
                        </div>
                        <div className="text-base font-bold text-white">
                            {physical.temperatureAvgC ? `${physical.temperatureAvgC}°C` : 'N/A'}
                        </div>
                    </div>
                    <div className="bg-slate-800/50 border border-indigo-500/20 rounded-xl p-4 w-auto max-w-none">
                        <div className="flex items-center gap-2 text-[0.7rem] text-slate-400 font-semibold tracking-wider mb-2">
                            TRỌNG LỰC
                        </div>
                        <div className="text-base font-bold text-white">
                            {physical.gravity ? `${physical.gravity} m/s²` : 'N/A'}
                        </div>
                    </div>
                    <div className="bg-slate-800/50 border border-indigo-500/20 rounded-xl p-4 w-auto max-w-none">
                        <div className="flex items-center gap-2 text-[0.7rem] text-slate-400 font-semibold tracking-wider mb-2">
                            MẬT ĐỘ
                        </div>
                        <div className="text-base font-bold text-white">
                            {physical.density ? `${physical.density} g/cm³` : 'N/A'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Orbital Properties Section */}
            <div className="mb-8">
                <h3 className="text-base font-semibold text-slate-200 mb-4 pb-2 border-b border-indigo-500/20 flex items-center gap-2">Thông Số Quỹ Đạo</h3>
                <div className="grid grid-cols-2 gap-3 mb-8 w-full">
                    <div className="bg-slate-800/50 border border-indigo-500/20 rounded-xl p-4 w-auto max-w-none">
                        <div className="flex items-center gap-2 text-[0.7rem] text-slate-400 font-semibold tracking-wider mb-2">
                            KHOẢNG CÁCH
                        </div>
                        <div className="text-base font-bold text-white">
                            {formatDistance(orbit.distanceFromSunKm)}
                        </div>
                    </div>
                    <div className="bg-slate-800/50 border border-indigo-500/20 rounded-xl p-4 w-auto max-w-none">
                        <div className="flex items-center gap-2 text-[0.7rem] text-slate-400 font-semibold tracking-wider mb-2">
                            CHU KỲ QUỸ ĐẠO
                        </div>
                        <div className="text-base font-bold text-white">
                            {orbit.orbitalPeriodDays ? `${formatNumber(orbit.orbitalPeriodDays)} ngày` : 'N/A'}
                        </div>
                    </div>
                    <div className="bg-slate-800/50 border border-indigo-500/20 rounded-xl p-4 w-auto max-w-none">
                        <div className="flex items-center gap-2 text-[0.7rem] text-slate-400 font-semibold tracking-wider mb-2">
                            CHU KỲ TỰ QUAY
                        </div>
                        <div className="text-base font-bold text-white">
                            {formatRotation(orbit.rotationPeriodHours)}
                        </div>
                    </div>
                    <div className="bg-slate-800/50 border border-indigo-500/20 rounded-xl p-4 w-auto max-w-none">
                        <div className="flex items-center gap-2 text-[0.7rem] text-slate-400 font-semibold tracking-wider mb-2">
                            GÓC NGHIÊNG
                        </div>
                        <div className="text-base font-bold text-white">
                            {orbit.axialTiltDeg !== null && orbit.axialTiltDeg !== undefined
                                ? `${orbit.axialTiltDeg}°`
                                : 'N/A'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Atmospheric Composition */}
            {gases && gases.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-base font-semibold text-slate-200 mb-4 pb-2 border-b border-indigo-500/20 flex items-center gap-2">Thành Phần Khí Quyển</h3>
                    <div className="flex flex-col gap-3">
                        {gases
                            .sort((a, b) => b.PlanetAtmosphere.percentage - a.PlanetAtmosphere.percentage)
                            .map((gas, index) => (
                                <div key={gas.id || index} className="flex flex-col gap-1">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-300 font-medium">{gas.name}</span>
                                        <span className="text-indigo-500 font-bold text-xs">
                                            {gas.PlanetAtmosphere.percentage}%
                                        </span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-[width] duration-500"
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
                <div className="mb-8">
                    <h3 className="text-base font-semibold text-slate-200 mb-4 pb-2 border-b border-indigo-500/20 flex items-center gap-2">Vệ Tinh ({moons.length})</h3>
                    <div className="flex flex-wrap gap-2">
                        {moons.slice(0, 5).map((moon, index) => (
                            <span key={moon.id || index} className="px-4 py-2 bg-indigo-500/15 border border-indigo-500/30 rounded-full text-xs text-slate-200 font-medium transition-all duration-300 hover:bg-indigo-500/25 hover:-translate-y-0.5">
                                {moon.nameVi || moon.nameEn || `Moon ${index + 1}`}
                            </span>
                        ))}
                        {moons.length > 5 && (
                            <span className="px-4 py-2 bg-blue-500/15 border border-blue-500/30 text-slate-400 rounded-full text-xs font-medium transition-all duration-300 hover:bg-indigo-500/25 hover:-translate-y-0.5">+{moons.length - 5} khác</span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlanetInfoCard;