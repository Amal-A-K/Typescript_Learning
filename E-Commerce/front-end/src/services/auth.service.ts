import api from './api';

// Add axios interceptors for authentication
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            // Auto logout if 401 or 403 response returned from api
            new AuthService().logout();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData extends LoginData {
    name: string;
    image?: File[];
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
    message: string;
}

class AuthService {
    private setAuthHeader(token: string | null) {
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete api.defaults.headers.common['Authorization'];
        }
    }    async login(data: LoginData, isAdmin: boolean = false): Promise<AuthResponse> {
        try {
            const endpoint = isAdmin ? '/admin/login' : '/users/login';
            const response = await api.post(endpoint, data);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('userType', isAdmin ? 'admin' : 'user');
                this.setAuthHeader(response.data.token);
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async register(data: RegisterData): Promise<AuthResponse> {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('password', data.password);
        if (data.image) {
            data.image.forEach(file => formData.append('image', file));
        }

        const response = await api.post('/users/registration', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userType');
        this.setAuthHeader(null);
        // Clear all auth-related items from localStorage
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('auth_') || key === 'token' || key === 'user' || key === 'userType') {
                localStorage.removeItem(key);
            }
        });
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (userStr && token) {
            this.setAuthHeader(token);
            return JSON.parse(userStr);
        }
        return null;
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    }

    async updateUser(userId: string, data: Partial<{
        name: string;
        email: string;
        password: string;
        role: string;
        image?: File[];
    }>) {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (key === 'image' && Array.isArray(value)) {
                value.forEach(file => formData.append('image', file));
            } else if (value !== undefined) {
                formData.append(key, value.toString());
            }
        });

        const response = await api.put(`/users/${userId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data.user;
    }
}

export default new AuthService();
