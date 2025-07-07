import { Button, Col, Image, Row, Modal, Form } from "react-bootstrap";
import "../App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import useLocalStorage from "use-local-storage";
import { useNavigate } from "react-router-dom";
import React from "react";
import logo from "/images/courtmania_logo.png";
import loginImage from "/images/background1.png";
import backgroundImage from "/images/background2.png";

export default function AuthPage() {
  const url =
    "https://5fd87737-6ead-47d4-99c7-419419ee0211-00-120gfp1y2h20u.pike.replit.dev";

  const [modalShow, setModalShow] = useState(null);
  const handleShowSignUp = () => setModalShow("SignUp");
  const handleShowLogin = () => setModalShow("Login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authToken, setAuthToken] = useLocalStorage("authToken", "");
  const [userId, setUserId] = useLocalStorage("userId", "");

  const navigate = useNavigate();
  const goHome = () => {
    navigate("/homepage");
  };

  useEffect(() => {
    if (authToken) {
      navigate("/profile");
    }
  }, [authToken, navigate]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/signup`, { username, password });
      console.log(res.data);
      alert("User successfully registered");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("User registeration failed. Please check the console log.");
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/login`, { username, password });
      if (res.data && res.data.auth === true && res.data.token) {
        setAuthToken(res.data.token); // Save token to local storage
        setUserId(res.data.id);
        console.log("Login was successful token saved");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleClose = () => setModalShow(null);

  return (
    <Row className="g-0 vh-100">
      <Col sm={6}>
        <Image
          src={loginImage}
          className="w-100 h-100 object-fit-cover"
          alt="Login Visual"
        />
      </Col>
      <Col
        sm={6}
        className="p4"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Image
          src={logo}
          style={{ width: "20%", cursor: "pointer" }}
          alt="logo"
          onClick={goHome}
        />
        <p className="m-5" style={{ fontSize: 64 }}>
          Get Active <br />
          This Summer!
        </p>
        <p className="m-5" style={{ fontSize: 31 }}>
          Join CourtMania Today!
        </p>
        <Col sm={12} className="d-grid gap-1">
          <Button
            className="rounded-pill btn-fixed"
            variant="primary"
            onClick={handleShowLogin}
          >
            Log In
          </Button>
          <br />
          <Button
            className="rounded-pill btn-fixed"
            onClick={handleShowSignUp}
            variant="outline-primary"
          >
            Create an Account
          </Button>
          <p className="mx-5 my-1" style={{ fontSize: "12px" }}>
            By signing up, you agree to the Terms of Service and Privacy Policy
            including Cookie Use
          </p>
        </Col>

        {/* modals that pop up to show sign up or login */}

        <Modal
          show={modalShow != null}
          onHide={handleClose}
          animation={false}
          centered
        >
          <Modal.Body>
            <h2 className="mb-4" style={{ fontWeight: "bold" }}>
              {modalShow === "SignUp"
                ? "Create your account"
                : "Login to your account"}
            </h2>
            <Form
              className="d-grid gap-2 px-5"
              onSubmit={modalShow === "SignUp" ? handleSignUp : handleLogin}
            >
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control
                  onChange={(e) => setUsername(e.target.value)}
                  type="email"
                  placeholder="Enter email"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Control
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                />
              </Form.Group>

              <p style={{ fontSize: "12px" }}>
                By signing up, you agree to the Terms of Service and Privacy
                Policy, including Cookie Use. SigmaTweets may use your contact
                information, including your email address and phone number for
                purposes outlined in our Privacy Policy, like keeping your
                account seceure and personalising our services, including ads.
                Learn more. Others will be able to find you by email or phone
                number, when provided, unless you choose otherwise here.
              </p>
              <Button className="rounded-pill" type="submit">
                {modalShow === "SignUp" ? "Sign up" : " Log in"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Col>
    </Row>
  );
}
