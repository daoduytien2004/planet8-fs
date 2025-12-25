import React, { useState, useEffect } from 'react';
import QuizHeader from '../components/Quiz/QuizHeader';
import QuizCard from '../components/Quiz/QuizCard';
import QuizSelectionModal from '../components/Quiz/QuizSelectionModal';
import planetService from '../services/planetService';
import quizService from '../services/quizService';
import levelService from '../services/levelService';
import authService from '../services/authService';
import '../components/Quiz/Quiz.css';

function Quiz() {
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
    }, []);

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
                    const quizzes = await quizService.getQuizzesByPlanet(planet.id);
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
            <div className="quiz-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="quiz-page">
                <div className="error-container">
                    <p className="error-text">{error}</p>
                    <button className="retry-button" onClick={loadPlanetsAndQuizzes}>
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="quiz-page">
            {/* Header with Stats */}
            <QuizHeader
                userStats={userStats}
                levels={levels}
            />

            {/* Quiz Cards Grid */}
            <div className="quiz-content">
                <div className="quiz-grid">
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
                        <div className="no-results">
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
