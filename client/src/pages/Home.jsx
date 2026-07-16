import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Tag, Spin, Empty, message, Input, Select } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { getAllMovies } from '../api/movieApi'

const { Meta } = Card;

const formatDuration = (minutes) => {
  if (!minutes) return '';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${minutes} min (${hrs}h ${mins}m)`;
};

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [genreFilter, setGenreFilter] = useState(null);
  const [languageFilter, setLanguageFilter] = useState(null);
  const navigate = useNavigate();

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await getAllMovies();
      if (response?.success) {
        setMovies(response.data);
      }
    } catch (error) {
      message.error("Failed to fetch movies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <Spin size="large" />
      </div>
    );
  }

  // unique genres aur languages nikal filter dropdown ke liye
  const allGenres = [...new Set(movies.flatMap(m => m.genre || []))];
  const allLanguages = [...new Set(movies.flatMap(m => m.languages || []))];

  // filtering logic
  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title?.toLowerCase().includes(searchText.toLowerCase());
    const matchesGenre = !genreFilter || movie.genre?.includes(genreFilter);
    const matchesLanguage = !languageFilter || movie.languages?.includes(languageFilter);
    return matchesSearch && matchesGenre && matchesLanguage;
  });

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Now Showing</h1>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={10}>
          <Input
            placeholder="Search movies by name..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </Col>
        <Col xs={12} sm={6} md={7}>
          <Select
            placeholder="Filter by genre"
            style={{ width: '100%' }}
            value={genreFilter}
            onChange={setGenreFilter}
            allowClear
          >
            {allGenres.map((g) => (
              <Select.Option key={g} value={g}>{g}</Select.Option>
            ))}
          </Select>
        </Col>
        <Col xs={12} sm={6} md={7}>
          <Select
            placeholder="Filter by language"
            style={{ width: '100%' }}
            value={languageFilter}
            onChange={setLanguageFilter}
            allowClear
          >
            {allLanguages.map((l) => (
              <Select.Option key={l} value={l}>{l}</Select.Option>
            ))}
          </Select>
        </Col>
      </Row>

      {filteredMovies.length === 0 ? (
        <Empty description="No movies match your search" />
      ) : (
        <Row gutter={[24, 24]}>
          {filteredMovies.map((movie) => (
            <Col xs={24} sm={12} md={8} lg={6} key={movie._id}>
              <Card
                hoverable
                onClick={() => navigate(`/movie/${movie._id}`)}
                cover={
                  <img
                    alt={movie.title}
                    src={movie.poster}
                    style={{ height: 350, objectFit: 'cover' }}
                  />
                }
              >
                <Meta
                  title={movie.title}
                  description={
                    <>
                      <div style={{ marginBottom: 8 }}>
                        {movie.genre?.map((g) => (
                          <Tag color="red" key={g}>{g}</Tag>
                        ))}
                      </div>
                      <div>{formatDuration(movie.duration)} · {movie.languages?.join(', ')}</div>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}

export default Home;