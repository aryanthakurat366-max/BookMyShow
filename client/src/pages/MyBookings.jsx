import React, { useEffect, useState } from 'react'
import { Card, Spin, Empty, message, Tag } from 'antd'
import { getMyBookings } from '../api/bookingApi'

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await getMyBookings();
      if (response?.success) {
        setBookings(response.data);
      }
    } catch (error) {
      message.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
      <h1>My Bookings</h1>

      {bookings.length === 0 ? (
        <Empty description="No bookings yet" style={{ marginTop: '2rem' }} />
      ) : (
        bookings.map((booking) => (
          <Card key={booking._id} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 16 }}>
              <img
                src={booking.show?.movie?.poster}
                alt={booking.show?.movie?.title}
                style={{ width: 80, height: 110, objectFit: 'cover', borderRadius: 4 }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ marginBottom: 4 }}>{booking.show?.movie?.title}</h3>
                <p style={{ margin: 0, color: '#888' }}>{booking.show?.theatre?.name}</p>
                <p style={{ margin: 0, color: '#888' }}>{booking.show?.time} · {new Date(booking.createdAt).toLocaleDateString()}</p>
                <p style={{ margin: '8px 0 0' }}>
                  Seats: <strong>{booking.seats.join(', ')}</strong>
                </p>
                <p style={{ margin: '4px 0 0' }}>
                  Total: <strong>₹{booking.totalAmount}</strong>
                </p>
                <Tag color="green" style={{ marginTop: 8 }}>CONFIRMED</Tag>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  )
}

export default MyBookings;