const USER_KEY = 'user';

const localStorageService = {
    // Get user data from local storage
    getUser: () => {
        try {
            const user = localStorage.getItem(USER_KEY);
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error('Error getting user from local storage:', error);
            return null;
        }
    },

    // Set user data in local storage
    setUser: (user) => {
        try {
            localStorage.setItem(USER_KEY, JSON.stringify(user));
        } catch (error) {
            console.error('Error setting user in local storage:', error);
        }
    },

    // Remove user data from local storage
    removeUser: () => {
        try {
            localStorage.removeItem(USER_KEY);
        } catch (error) {
            console.error('Error removing user from local storage:', error);
        }
    }
};

export default localStorageService; 