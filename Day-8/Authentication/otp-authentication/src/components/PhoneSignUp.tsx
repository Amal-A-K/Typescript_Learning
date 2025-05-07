import React, { useState, FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useUserAuth } from "../context/UserAuthContext";
import { ConfirmationResult } from "firebase/auth";

const PhoneSignUp = () => {
  const [error, setError] = useState<string>("");
  const [number, setNumber] = useState<string>("");
  const [flag, setFlag] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [result, setResult] = useState<ConfirmationResult | null>(null);
  const { setUpRecaptcha, resetRecaptcha } = useUserAuth(); // Updated function name and added reset
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      // Clean up reCAPTCHA when component unmounts
      resetRecaptcha();
    };
  }, [resetRecaptcha]);

  const getOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!number) {
      return setError("Please enter a valid phone number!");
    }

    try {
      const response = await setUpRecaptcha(number);
      setResult(response);
      setFlag(true);
    } catch (err: any) {
      setError(err.message);
      resetRecaptcha(); // Reset on error
    }
  };

  const verifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!otp) {
      return setError("Please enter the OTP!");
    }

    try {
      await result?.confirm(otp);
      resetRecaptcha(); // Clean up after successful verification
      navigate("/home");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="p-4 box">
        <h2 className="mb-3">Firebase Phone Auth</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={getOtp} style={{ display: !flag ? "block" : "none" }}>
          <Form.Group className="mb-3" controlId="formBasicPhone">
            <PhoneInput
              international
              defaultCountry="IN"
              value={number}
              onChange={(value) => setNumber(value || "")}
              placeholder="Enter phone number"
              className="form-control"
            />
            <div id="recaptcha-container" className="mt-2"></div>
          </Form.Group>
          <div className="button-right">
            <Link to="/">
              <Button variant="secondary">Cancel</Button>
            </Link>
            &nbsp;
            <Button type="submit" variant="primary">
              Send OTP
            </Button>
          </div>
        </Form>

        <Form onSubmit={verifyOtp} style={{ display: flag ? "block" : "none" }}>
          <Form.Group className="mb-3" controlId="formBasicOtp">
            <Form.Control
              type="text"
              placeholder="Enter OTP"
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
            />
          </Form.Group>
          <div className="button-right">
            <Link to="/">
              <Button variant="secondary">Cancel</Button>
            </Link>
            &nbsp;
            <Button type="submit" variant="primary">
              Verify
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default PhoneSignUp;