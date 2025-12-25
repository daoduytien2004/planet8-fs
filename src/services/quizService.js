import axiosInstance from '../config/axiosConfig';

const quizService = {
    getQuizzesByPlanet: async (planetId) => {
        try {
            const response = await axiosInstance.get(`/quizzes/planet/${planetId}`);
            // Backend returns {success: true, data: {items: [...], pagination: {...}}}
            // Extract the items array from the nested structure
            return response.data.data?.items || [];
        } catch (error) {
            console.error(`Error fetching quizzes for planet ${planetId}:`, error);
            throw error;
        }
    },

    // Get a specific quiz by ID
    getById: async (id) => {
        try {
            const response = await axiosInstance.get(`/quizzes/${id}`);
            return response.data.data || null;
        } catch (error) {
            console.error(`Error fetching quiz ${id}:`, error);
            throw error;
        }
    },

    // Start a quiz attempt
    startQuiz: async (quizId) => {
        try {
            const response = await axiosInstance.post(`/quizzes/start`, { quizId });
            // Returns { attemptId, questionIds }
            return response.data.data;
        } catch (error) {
            console.error(`Error starting quiz ${quizId}:`, error);
            throw error;
        }
    },

    // Get a specific question by ID (includes options)
    getQuestion: async (questionId) => {
        try {
            const response = await axiosInstance.get(`/questions/${questionId}`);
            // Returns question with options array
            return response.data.data;
        } catch (error) {
            console.error(`Error fetching question ${questionId}:`, error);
            throw error;
        }
    },

    // Submit an answer for a question
    submitAnswer: async (attemptId, questionId, selectedOptionId) => {
        try {
            const response = await axiosInstance.post(`/quizzes/answer`, {
                attemptId,
                questionId,
                selectedOptionId
            });
            return response.data;
        } catch (error) {
            console.error(`Error submitting answer:`, error);
            throw error;
        }
    },

    // Get quiz attempt status and results
    getAttemptStatus: async (attemptId) => {
        try {
            const response = await axiosInstance.get(`/quizzes/attempt/${attemptId}`);
            return response.data.data;
        } catch (error) {
            console.error(`Error fetching attempt status:`, error);
            throw error;
        }
    },

    // Get user's completed quizzes
    getCompletedQuizzes: async () => {
        try {
            const response = await axiosInstance.get('/quizzes/completed');
            return response.data.data.completedQuizIds || [];
        } catch (error) {
            console.error('Error fetching completed quizzes:', error);
            throw error;
        }
    }
}

export default quizService;
