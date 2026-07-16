import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Spin, Empty, message, Button, Row, Col } from 'antd'
import { getShowById } from '../api/showApi'
import { createOrder, verifyPayment } from '../api/bookingApi'

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const fetchShow = async () => {
    setLoading(true);
    try {
      const response = await getShowById(showId);
      if (response?.success) {
        setShow(response.data);
      }
    } catch (error) {
      message.error("Failed to load show details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShow();
  }, [showId]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!show) {
    return <Empty description="Show not found" style={{ marginTop: '4rem' }} />;
  }

  const bookedSeats = show.bookedSeats || [];
  const seatNumbers = Array.from({ length: show.totalSeats }, (_, i) => i + 1);
  const seatsPerRow = 10;

  const toggleSeat = (seatNum) => {
    if (bookedSeats.includes(seatNum)) return;

    setSelectedSeats((prev) =>
      prev.includes(seatNum)
        ? prev.filter((s) => s !== seatNum)
        : [...prev, seatNum]
    );
  };

  const totalPrice = selectedSeats.length * show.ticketPrice;

  const handlePayment = async () => {
    if (selectedSeats.length === 0) {
      message.warning("Please select at least one seat");
      return;
    }

    setProcessing(true);

    try {
      const orderRes = await createOrder(showId, selectedSeats);

      if (!orderRes?.success) {
        message.error(orderRes?.message || "Failed to create order");
        setProcessing(false);
        return;
      }

      const { orderId, amount, currency, bookingId, keyId } = orderRes.data;

      const user = JSON.parse(localStorage.getItem('user'));

      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "BookMyShow",
        description: `${show.movie?.title} - ${show.theatre?.name}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: bookingId,
            });

            if (verifyRes?.success) {
              message.success("Payment successful! Booking confirmed.");
              navigate('/my-bookings');
            } else {
              message.error(verifyRes?.message || "Payment verification failed");
            }
          } catch (error) {
            message.error("Payment verification failed");
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#e50914",
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      setProcessing(false);
    } catch (error) {
      message.error("Something went wrong while initiating payment");
      setProcessing(false);
    }
  };

  const rows = [];
  for (let i = 0; i < seatNumbers.length; i += seatsPerRow) {
    rows.push(seatNumbers.slice(i, i + seatsPerRow));
  }

  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <h1>{show.movie?.title}</h1>
      <p style={{ color: '#888', marginBottom: 24 }}>
        {show.theatre?.name} · {show.time} · ₹{show.ticketPrice} per seat
      </p>

      <Card style={{ marginBottom: 24 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            display: 'inline-block',
            padding: '8px 40px',
            background: '#333',
            borderRadius: 4,
            color: '#aaa',
            fontSize: 12,
            letterSpacing: 2
          }}>
            SCREEN
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} style={{ display: 'flex', gap: 8 }}>
              {row.map((seatNum) => {
                const isBooked = bookedSeats.includes(seatNum);
                const isSelected = selectedSeats.includes(seatNum);

                return (
                  <div
                    key={seatNum}
                    onClick={() => toggleSeat(seatNum)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      cursor: isBooked ? 'not-allowed' : 'pointer',
                      background: isBooked ? '#555' : isSelected ? '#e50914' : '#2a2a2a',
                      color: isBooked ? '#888' : '#fff',
                      border: '1px solid ' + (isSelected ? '#e50914' : '#444'),
                      transition: 'all 0.2s',
                    }}
                  >
                    {seatNum}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 24, fontSize: 13 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 16, height: 16, background: '#2a2a2a', border: '1px solid #444', borderRadius: 3 }} />
            Available
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 16, height: 16, background: '#e50914', borderRadius: 3 }} />
            Selected
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 16, height: 16, background: '#555', borderRadius: 3 }} />
            Booked
          </div>
        </div>
      </Card>

      <Card>
        <Row justify="space-between" align="middle">
          <Col>
            <div>Selected seats: <strong>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</strong></div>
            <div style={{ marginTop: 4, fontSize: 18 }}>
              Total: <strong>₹{totalPrice}</strong>
            </div>
          </Col>
          <Col>
            <Button type="primary" size="large" onClick={handlePayment} loading={processing}>
              Proceed to Payment
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  )
}

export default SeatSelection;