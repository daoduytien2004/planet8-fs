const TOKEN_KEY = 'planet8_auth_token';
const USER_KEY = 'planet8_user';

const tokenService = {
    // Store token in localStorage
    setToken: (token) => {
        if (token) {
            localStorage.setItem(TOKEN_KEY, token);
        }
    },

    // Get token from localStorage
    getToken: () => {
        return localStorage.getItem(TOKEN_KEY);
    },

    // Remove token from localStorage
    removeToken: () => {
        localStorage.removeItem(TOKEN_KEY);
    },

    // Store user data
    setUser: (user) => {
        if (user) {
            localStorage.setItem(USER_KEY, JSON.stringify(user));
        }
    },

    // Get user data
    getUser: () => {
        const userData = localStorage.getItem(USER_KEY);
        return userData ? JSON.parse(userData) : null;
    },

    // Remove user data
    removeUser: () => {
        localStorage.removeItem(USER_KEY);
    },
};

export default tokenService;
