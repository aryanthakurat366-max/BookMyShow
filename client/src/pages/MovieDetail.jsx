import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Row, Col, Tag, Spin, Empty, message, Button, Descriptions } from 'antd'
import { getMovieById } from '../api/movieApi'
import { getShowsByMovie } from '../api/showApi'

const formatDuration = (minutes) => {
  if (!minutes) return '';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${minutes} min (${hrs}h ${mins}m)`;
};

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const movieRes = await getMovieById(id);
      if (movieRes?.success) {
        setMovie(movieRes.data);
      }

      const showsRes = await getShowsByMovie(id);
      if (showsRes?.success) {
        setShows(showsRes.data);
      }
    } catch (error) {
      message.error("Failed to load movie details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!movie) {
    return <Empty description="Movie not found" style={{ marginTop: '4rem' }} />;
  }

  const showsByTheatre = shows.reduce((acc, show) => {
    const theatreName = show.theatre?.name || 'Unknown Theatre';
    if (!acc[theatreName]) acc[theatreName] = [];
    acc[theatreName].push(show);
    return acc;
  }, {});

  return (
    <div style={{ padding: '2rem' }}>
      <Row gutter={32}>
        <Col xs={24} md={8}>
          <img
            src={movie.poster}
            alt={movie.title}
            style={{ width: '100%', borderRadius: 8 }}
          />
        </Col>

        <Col xs={24} md={16}>
          <h1 style={{ marginBottom: 4 }}>{movie.title}</h1>

          <div style={{ marginBottom: 16 }}>
            {movie.genre?.map((g) => (
              <Tag color="red" key={g}>{g}</Tag>
            ))}
          </div>

          <Card style={{ marginBottom: 16 }}>
            <Descriptions column={1} colon={true}>
              <Descriptions.Item label="Duration">
                {formatDuration(movie.duration)}
              </Descriptions.Item>
              <Descriptions.Item label="Language">
                {movie.languages?.join(', ')}
              </Descriptions.Item>
              <Descriptions.Item label="Genre">
                {movie.genre?.join(', ')}
              </Descriptions.Item>
              <Descriptions.Item label="Release Date">
                {movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Storyline">
            <p style={{ margin: 0, lineHeight: 1.7 }}>{movie.description}</p>
          </Card>
        </Col>
      </Row>

      <h2 style={{ marginTop: '2rem' }}>Showtimes</h2>

      {Object.keys(showsByTheatre).length === 0 ? (
        <Empty description="No shows available for this movie yet" />
      ) : (
        Object.entries(showsByTheatre).map(([theatreName, theatreShows]) => (
          <Card key={theatreName} title={theatreName} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {theatreShows.map((show) => (
                <Button
                  key={show._id}
                  type="default"
                  onClick={() => navigate(`/booking/${show._id}`)}
                >
                  {show.time} · ₹{show.ticketPrice}
                </Button>
              ))}
            </div>
          </Card>
        ))
      )}
    </div>
  )
}

export default MovieDetail;