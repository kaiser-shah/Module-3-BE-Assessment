import React, { useEffect, useState } from "react";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import useLocalStorage from "use-local-storage";

export default function NewBooking() {
  const [authToken] = useLocalStorage("authToken", "");
  const backgroundImage = "src/assets/background2.png";
  const [userId, setUserId] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [courtId, setCourtId] = useState("1"); // default to Pickleball
  const baseUrl =
    "https://5fd87737-6ead-47d4-99c7-419419ee0211-00-120gfp1y2h20u.pike.replit.dev";

  // Fetch user ID from token
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${baseUrl}/username`, {
          headers: {
            Authorization: authToken,
          },
        });
        setUserId(res.data.id);
      } catch (err) {
        console.error("Failed to fetch user ID:", err);
      }
    };

    if (authToken) {
      fetchUser();
    }
  }, [authToken]);

  // Fetch availability
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await axios.get(`${baseUrl}/availability`);
        const sorted = res.data.sort((a, b) => {
          const dateA = new Date(a.available_date);
          const dateB = new Date(b.available_date);
          if (dateA - dateB !== 0) return dateA - dateB;
          return a.available_time === "morning" ? -1 : 1;
        });
        setAvailability(sorted);
      } catch (err) {
        console.error("Failed to fetch availability:", err);
      }
    };

    fetchAvailability();
  }, []);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedSlot || isNaN(selectedSlot) || !userId) {
      console.log("DEBUG selectedSlot:", selectedSlot, typeof selectedSlot);
      console.log("DEBUG userId:", userId);
      return alert("Select a time slot first!");
    }

    try {
      await axios.post(`${baseUrl}/book`, {
        user_id: userId,
        court_id: courtId,
        availability_id: selectedSlot,
      });
      alert("Booking successful!");
      window.location.reload();
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <Container
      className="my-3 border border-dark bg-light p-3 rounded"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h4>Make a New Booking</h4>
      <Form onSubmit={handleBooking}>
        <Row className="mb-3">
          <Col sm={5}>
            <Form.Label>Select Court</Form.Label>
            <Form.Select
              value={courtId}
              onChange={(e) => setCourtId(Number(e.target.value))} // ✅ convert to number
            >
              <option defaultValue="-- Select a Court --"></option>
              <option value="1">Pickleball (Court 1)</option>
              <option value="2">Badminton (Court 2)</option>
            </Form.Select>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={5}>
            <Form.Label>Select Available Time Slot</Form.Label>
            <Form.Select
              value={selectedSlot}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedSlot(value === "" ? "" : Number(value));
              }}
            >
              <option value="">-- Select a time slot --</option>
              {availability
                .filter(
                  (slot) => !slot.is_booked && slot.court_id === Number(courtId)
                )
                .map((slot) => {
                  const formattedDate = new Date(
                    slot.available_date
                  ).toLocaleDateString("en-GB");
                  const label = `${formattedDate} - ${
                    slot.available_time.charAt(0).toUpperCase() +
                    slot.available_time.slice(1)
                  }`;
                  return (
                    <option key={slot.id} value={slot.id}>
                      {label}
                    </option>
                  );
                })}
            </Form.Select>
          </Col>
        </Row>
        <Button variant="success" type="submit" disabled={!selectedSlot}>
          Book Now
        </Button>
      </Form>
    </Container>
  );
}
