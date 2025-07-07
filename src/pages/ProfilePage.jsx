import { Navbar, Container, Button, Image } from "react-bootstrap";
import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "use-local-storage";
import axios from "axios";
import CurrentBookings from "./components/CurrentBookings";
import NewBooking from "./components/NewBooking";
import logo from "/images/courtmania_logo.png";

export default function ProfilePage() {
  const [authToken, setAuthToken] = useLocalStorage("authToken", "");
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const url =
    "https://5fd87737-6ead-47d4-99c7-419419ee0211-00-120gfp1y2h20u.pike.replit.dev";

  // Check for authToken immediately upon component mount, and whenever authToken Changes

  useEffect(() => {
    if (!authToken) {
      navigate("/login"); //Navigate to login if no authToken is present
    }
  }, [authToken, navigate]);

  useEffect(() => {
    const fetchName = async () => {
      try {
        const res = await axios.get(`${url}/name`, {
          headers: {
            Authorization: authToken, // Send token in Authorisation header}})
          },
        });
        setName(res.data.name); //expects name
      } catch (err) {
        console.error("failed to fetch name", err);
      }
    };
    if (authToken) {
      fetchName();
    }
  }, [authToken]);

  const handleLogout = () => {
    setAuthToken(""); // Clear authToken from local storage
  };

  return (
    <>
      <Navbar bg="light">
        <Container>
          <Navbar.Brand href="/">
            <Image src={logo} style={{ width: "15%" }} alt="logo" />
          </Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Button variant="primary" onClick={handleLogout}>
              Logout
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-3">
        <h2>Welcome back, {name}!</h2>
      </Container>
      <Container className="mt-3">
        <CurrentBookings />
      </Container>
      <Container className="mt-3">
        <NewBooking />
      </Container>
    </>
  );
}
