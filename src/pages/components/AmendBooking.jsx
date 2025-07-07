/* eslint-disable react/prop-types */

import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

export default function AmendBooking({
  show,
  onClose,
  booking,
  authToken,
  onSuccess,
}) {
  const [courtId, setCourtId] = useState(booking.court_id);
  const [availabilityId, setAvailabilityId] = useState(booking.availability_id);
  const [availableSlots, setAvailableSlots] = useState([]);

  const url =
    "https://5fd87737-6ead-47d4-99c7-419419ee0211-00-120gfp1y2h20u.pike.replit.dev";

  // Hardcoded court options from your courts table
  const courtOptions = [
    { id: 1, name: "Pickleball Court" },
    { id: 2, name: "Badminton Court" },
  ];

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        const res = await axios.get(`${url}/availability`);
        setAvailableSlots(res.data);
      } catch (err) {
        console.error("Error fetching availability:", err);
      }
    };

    if (show) {
      fetchAvailableSlots();
    }
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${url}/booking/edit`, {
        booking_id: booking.id,
        user_id: booking.user_id,
        court_id: parseInt(courtId),
        availability_id: parseInt(availabilityId),
      });

      alert("Booking amended successfully!");
      onSuccess(res.data); // update parent state
      onClose();
    } catch (err) {
      console.error("Error amending booking:", err);
      alert("An error occurred while amending the booking.");
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Amend Booking</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Court selection */}
          <Form.Group className="mb-3">
            <Form.Label>Select New Court</Form.Label>
            <Form.Select
              value={courtId}
              onChange={(e) => setCourtId(e.target.value)}
              required
            >
              <option value="">-- Select Court --</option>
              {courtOptions.map((court) => (
                <option key={court.id} value={court.id}>
                  {court.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Time slot selection */}
          <Form.Group>
            <Form.Label>Select New Time Slot</Form.Label>
            <Form.Select
              value={availabilityId}
              onChange={(e) => setAvailabilityId(e.target.value)}
              required
            >
              <option value="">-- Select Time Slot --</option>
              {availableSlots
                .filter(
                  (slot) =>
                    !slot.is_booked && slot.court_id === parseInt(courtId)
                ) // ✅ show only available
                .sort((a, b) => {
                  const dateA = new Date(a.available_date);
                  const dateB = new Date(b.available_date);
                  if (dateA - dateB !== 0) return dateA - dateB;
                  return a.available_time === "morning" ? -1 : 1;
                })
                .map((slot) => {
                  const formattedDate = new Date(
                    slot.available_date
                  ).toLocaleDateString("en-GB");
                  const formattedTime =
                    slot.available_time.charAt(0).toUpperCase() +
                    slot.available_time.slice(1);
                  return (
                    <option key={slot.id} value={slot.id}>
                      {formattedDate} - {formattedTime}
                    </option>
                  );
                })}
            </Form.Select>
          </Form.Group>

          <div className="text-end my-2">
            <Button variant="secondary" onClick={onClose} className="me-2">
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Confirm Amend
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
