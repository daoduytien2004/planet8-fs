import React, { useState, useEffect } from 'react';
import QuizHeader from '../components/Quiz/QuizHeader';
import QuizCard from '../components/Quiz/QuizCard';
import QuizSelectionModal from '../components/Quiz/QuizSelectionModal';
import planetService from '../apis/planetApi';
import quizService from '../apis/quizApi';
import levelService from '../apis/levelApi';
import authService from '../apis/authApi';

function Quiz() {
    const token = authService.getToken()
    const [planets, setPlanets] = useState([]);
    const [planetQuizzes, setPlanetQuizzes] = useState({});
    const [userStats, setUserStats] = useState(null);
    const [levels, setLevels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [completedQuizIds, setCompletedQuizIds] = useState([]);

    // Modal state
    const [selectedPlanet, setSelectedPlanet] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Load planets and their quizzes
    useEffect(() => {
        loadPlanetsAndQuizzes();
    }, [token]);

    const loadPlanetsAndQuizzes = async () => {
        try {
            setLoading(true);
            setError(null);

            // Load user stats, levels, planets, and completed quizzes in parallel
            const [statsData, levelsData, planetsData, completedIds] = await Promise.all([
                authService.getMyStats(),
                levelService.getAll(),
                planetService.getAll(),
                quizService.getCompletedQuizzes()
            ]);
            setUserStats(statsData);
            setLevels(levelsData);
            setPlanets(planetsData);
            setCompletedQuizIds(completedIds);

            // Fetch quizzes for each planet
            const quizzesMap = {};
            for (const planet of planetsData) {
                try {
                    const response = await quizService.getQuizzesByPlanet(planet.id);
                    const quizzes = response.items;
                    quizzesMap[planet.id] = quizzes;
                } catch (err) {
                    console.error(`Failed to load quizzes for planet ${planet.id}:`, err);
                    quizzesMap[planet.id] = [];
                }
            }
            setPlanetQuizzes(quizzesMap);

        } catch (err) {
            console.error('Error loading planets and quizzes:', err);
            setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const handleStartQuiz = (planet) => {
        setSelectedPlanet(planet);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPlanet(null);
    };

    if (loading) {
        return (
            <div className="h-[90vh] bg-gradient-to-br from-[#0a0e27] to-[#1a1d3d] overflow-x-hidden relative">
                <div className="absolute inset-0 pointer-events-none opacity-30 bg-[size:200px_200px] bg-[image:radial-gradient(2px_2px_at_20px_30px,white,transparent),radial-gradient(2px_2px_at_60px_70px,white,transparent),radial-gradient(1px_1px_at_50px_50px,white,transparent)] animate-[twinkle_5s_ease-in-out_infinite]" />
                <div className="flex flex-col items-center justify-center min-h-[90vh] gap-6 relative z-10">
                    <div className="w-[60px] h-[60px] border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                    <p className="text-xl text-slate-400 font-medium">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-[90vh] bg-gradient-to-br from-[#0a0e27] to-[#1a1d3d] overflow-x-hidden relative">
                <div className="absolute inset-0 pointer-events-none opacity-30 bg-[size:200px_200px] bg-[image:radial-gradient(2px_2px_at_20px_30px,white,transparent),radial-gradient(2px_2px_at_60px_70px,white,transparent),radial-gradient(1px_1px_at_50px_50px,white,transparent)] animate-[twinkle_5s_ease-in-out_infinite]" />
                <div className="flex flex-col items-center justify-center min-h-[90vh] gap-6 p-8 relative z-10">
                    <p className="text-xl text-red-500 text-center">{error}</p>
                    <button className="px-8 py-4 bg-indigo-500 border-none text-white rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-indigo-600 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(99,102,241,0.4)]" onClick={loadPlanetsAndQuizzes}>
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[90vh] bg-gradient-to-br from-[#0a0e27] to-[#1a1d3d] overflow-x-hidden relative">
            <div className="absolute inset-0 pointer-events-none opacity-30 bg-[size:200px_200px] bg-[image:radial-gradient(2px_2px_at_20px_30px,white,transparent),radial-gradient(2px_2px_at_60px_70px,white,transparent),radial-gradient(1px_1px_at_50px_50px,white,transparent)] animate-[twinkle_5s_ease-in-out_infinite]" />
            <style jsx>{`
                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.5; }
                }
            `}</style>

            {/* Header with Stats */}
            <QuizHeader
                userStats={userStats}
                levels={levels}
            />

            {/* Quiz Cards Grid */}
            <div className="px-8 pb-12 md:px-6 md:pb-8 relative z-10">
                <div className="max-w-[1400px] mx-auto grid grid-cols-4 gap-6 xl:grid-cols-3 lg:gap-5 md:grid-cols-1 md:gap-6">
                    {planets.length > 0 ? (
                        planets.map(planet => (
                            <QuizCard
                                key={planet.id}
                                planet={planet}
                                quizzes={planetQuizzes[planet.id] || []}
                                userLevel={userStats?.user?.level || 1}
                                completedQuizIds={completedQuizIds}
                                onStartQuiz={handleStartQuiz}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center p-12 text-slate-400 text-lg">
                            <p>Không tìm thấy hành tinh nào</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Quiz Selection Modal */}
            {showModal && selectedPlanet && (
                <QuizSelectionModal
                    planet={selectedPlanet}
                    quizzes={planetQuizzes[selectedPlanet.id] || []}
                    userLevel={userStats?.user?.level || 1}
                    completedQuizIds={completedQuizIds}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}

export default Quiz;
