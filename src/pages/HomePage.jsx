import { Container, Button, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import React from "react";

export default function Home() {
  const navigate = useNavigate();
  const backgroundImage = "src/assets/homepage_bg.jpg";
  const logo = "src/assets/courtmania_logo.png";
  const logo2 = "src/assets/b&w_Logo.png";

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
