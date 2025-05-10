import React,{ useContext } from "react";
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

interface LoginInfo {
  email: string;
  password: string;
}

interface AuthContextType {
  loginInfo: LoginInfo;
  updateLoginInfo: (info: Partial<LoginInfo>) => void;
  loginUser: (e: React.FormEvent) => Promise<void>;
  loginError: { error: boolean; message: string } | null;
  isLoginLoading: boolean;
}

const Login = () => {
  const { 
    loginUser, 
    loginError, 
    isLoginLoading, 
    updateLoginInfo, 
    loginInfo 
  } = useContext(AuthContext) as AuthContextType;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateLoginInfo({ [name]: value } as Partial<LoginInfo>);
  };

  return (
    <Form onSubmit={loginUser}>
      <Row style={{
        height: "100vh",
        justifyContent: "center",
        paddingTop: "10%"
      }}>
        <Col xs={6}>
          <Stack gap={3}>
            <h2 style={{ textAlign: "center" }}>Login</h2>
            <Form.Control 
              type="email" 
              name="email"
              placeholder="Email" 
              value={loginInfo.email}
              onChange={handleInputChange}
            />
            <Form.Control 
              type="password" 
              name="password"
              placeholder="Password" 
              value={loginInfo.password}
              onChange={handleInputChange}
            />
            <Button 
              variant="primary" 
              type="submit"
              disabled={isLoginLoading}
            >
              {isLoginLoading ? "Logging in" : "Login"}
            </Button>
            {loginError?.error && (
              <Alert variant="danger">
                <p>{loginError.message}</p>
              </Alert>
            )}
          </Stack>
        </Col>
      </Row>
    </Form>
  );
};

export default Login;