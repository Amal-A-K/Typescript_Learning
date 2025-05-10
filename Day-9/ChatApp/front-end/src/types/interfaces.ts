export interface User {
    _id?: string;
    name: string;
    email: string;
    token?: string;
    // Add other user properties as needed
  }

export interface ErrorResponse {
    error: boolean;
    message: string;
    // Add other error properties as needed
    }

export interface RegisterInfo {
    name: string;
    email: string;
    password: string;
  }

export interface LoginInfo {
    email: string;
    password: string;
  }

export interface AuthContextType {
  user: User | null;
  registerInfo: RegisterInfo;
  updateRegisterInfo: (info: RegisterInfo) => void;
  registerUser: (e: React.FormEvent) => Promise<void>;
  registerError: ErrorResponse | null;
  isRegisterLoading: boolean;
  logoutUser: () => void;
  loginUser: (e: React.FormEvent) => Promise<void>;
  loginError: ErrorResponse | null;
  isLoginLoading: boolean;
  updateLoginInfo: (info: LoginInfo) => void;
  loginInfo: LoginInfo;
}