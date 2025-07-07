import React, { useEffect, useState } from "react";
import { Button, Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import AmendBooking from "./AmendBooking";
import useLocalStorage from "use-local-storage";

export default function CurrentBookings() {
  const [bookings, setBookings] = useState([]);
  const [availabilityMap, setAvailabilityMap] = useState({});
  const [authToken] = useLocalStorage("authToken", "");
  const [userId] = useLocalStorage("userId", "");
  const [showAmendModal, setShowAmendModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const url =
    "https://5fd87737-6ead-47d4-99c7-419419ee0211-00-120gfp1y2h20u.pike.replit.dev";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get bookings
        const bookingRes = await axios.get(`${url}/booking/user/${userId}`);
        setBookings(bookingRes.data);

        // Get all availability data to map from ID
        const availabilityRes = await axios.get(`${url}/availability/all`);
        const map = {};
        availabilityRes.data.forEach((slot) => {
          map[slot.id] = {
            date: new Date(slot.available_date).toLocaleDateString("en-GB"),
            time: slot.available_time,
          };
        });
        setAvailabilityMap(map);
      } catch (err) {
        console.error("Error fetching bookings or availability:", err);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  const handleDelete = async (booking) => {
    if (!window.confirm("Are you sure you want to delete this booking?"))
      return;

    try {
      await axios.delete(`${url}/booking/delete`, {
        data: {
          id: booking.id,
          availability_id: booking.availability_id,
        },
      });
      setBookings((prev) => prev.filter((b) => b.id !== booking.id));
      alert("Booking deleted successfully.");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Error deleting booking.");
    }
  };

  const handleAmend = (booking) => {
    setSelectedBooking(booking);
    setShowAmendModal(true);
  };

  const handleAmendSuccess = () => {
    setShowAmendModal(false);
    window.location.reload(); // Refresh to show updated booking
  };

  return (
    <>
      <h3 className="mt-4">Your Current Bookings:</h3>
      <Row className="m-5">
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          bookings.map((booking) => {
            const slot = availabilityMap[booking.availability_id];
            return (
              <Col key={booking.id} md={6} lg={4}>
                <Card>
                  <Card.Body>
                    <Card.Title>Booking ID: {booking.id}</Card.Title>
                    <Card.Text>
                      Court ID: {booking.court_id}
                      <br />
                      {slot
                        ? `Date: ${slot.date} Time: ${slot.time}`
                        : "Loading availability..."}
                    </Card.Text>
                    <Button
                      variant="danger"
                      className="me-2"
                      onClick={() => handleDelete(booking)}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="warning"
                      onClick={() => handleAmend(booking)}
                    >
                      Amend
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })
        )}
      </Row>

      {selectedBooking && (
        <AmendBooking
          show={showAmendModal}
          onClose={() => setShowAmendModal(false)}
          booking={selectedBooking}
          authToken={authToken}
          onSuccess={handleAmendSuccess}
        />
      )}
    </>
  );
}
