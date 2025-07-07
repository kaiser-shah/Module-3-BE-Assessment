import { Container, Button, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import React from "react";
import logo from "/images/courtmania_logo.png";
import logo2 from "/images/b&w_Logo.png";
import backgroundImage from "/images/homepage_bg.jpg";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        color: "white",
        textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
      }}
    >
      <Container
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Image src={logo2} style={{ width: "55%" }} alt="logo" />

        <Image src={logo} style={{ width: "55%" }} alt="logo" />
        <Button
          style={{ backgroundColor: "blue", color: "white" }}
          className="px-5 py-3 fs-4 mb-5"
          onClick={() => navigate("/Login")}
        >
          Get Started!
        </Button>
      </Container>

      {/* <div
          style={{
            border: "2px solid #fff",
            padding: "20px 30px",
            borderRadius: "15px",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            boxShadow: "0 0 10px rgba(255, 255, 255, 0.2)",
          }}
        >
          <h1 className="mb-3 display-4">welcome to CourtMania</h1>
        </div> */}
    </div>
  );
}
