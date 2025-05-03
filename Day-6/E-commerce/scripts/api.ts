interface ApiResponse<T> {
    data: T | null;
    success: boolean;
    error?: string;
}

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string = '') {
        this.baseUrl = baseUrl;
    }

    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(`${this.baseUrl}/${endpoint}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data: T = await response.json();
            return { data, success: true };
        } catch (error) {
            return { 
                data: null, 
                success: false, 
                error: error instanceof Error ? error.message : 'Unknown error' 
            };
        }
    }

    async post<T, U>(endpoint: string, body: U): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(`${this.baseUrl}/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data: T = await response.json();
            return { data, success: true };
        } catch (error) {
            return { 
                data: null, 
                success: false, 
                error: error instanceof Error ? error.message : 'Unknown error' 
            };
        }
    }
}

export const apiClient = new ApiClient('https://api.example.com');