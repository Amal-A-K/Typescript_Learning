import React,{ useContext } from "react";
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

interface RegisterInfo {
  name: string;
  email: string;
  password: string;
}

interface AuthContextType {
  registerInfo: RegisterInfo;
  updateRegisterInfo: (info: Partial<RegisterInfo>) => void;
  registerUser: (e: React.FormEvent) => Promise<void>;
  registerError: { error: boolean; message: string } | null;
  isRegisterLoading: boolean;
}

const Register = () => {
  const { 
    registerInfo, 
    updateRegisterInfo, 
    registerUser, 
    registerError, 
    isRegisterLoading 
  } = useContext(AuthContext) as AuthContextType;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateRegisterInfo({ [name]: value } as Partial<RegisterInfo>);
  };

  return (
    <Form onSubmit={registerUser}>
      <Row style={{
        height: "100vh",
        justifyContent: "center",
        paddingTop: "10%"
      }}>
        <Col xs={6}>
          <Stack gap={3}>
            <h2 style={{ textAlign: "center" }}>Register</h2>
            <Form.Control 
              type="text" 
              name="name"
              placeholder="Name" 
              value={registerInfo.name}
              onChange={handleInputChange}
            />
            <Form.Control 
              type="email" 
              name="email"
              placeholder="Email" 
              value={registerInfo.email}
              onChange={handleInputChange}
            />
            <Form.Control 
              type="password" 
              name="password"
              placeholder="Password" 
              value={registerInfo.password}
              onChange={handleInputChange}
            />
            <Button variant="primary" type="submit" disabled={isRegisterLoading}>
              {isRegisterLoading ? "Creating your Account" : "Register"}
            </Button>
            {registerError?.error && (
              <Alert variant="danger">
                <p>{registerError.message}</p>
              </Alert>
            )}
          </Stack>
        </Col>
      </Row>
    </Form>
  );
};

export default Register;