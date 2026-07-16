import React, { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, InputNumber, DatePicker, message, Popconfirm } from 'antd'
import { getAllMovies, addMovie, updateMovie, deleteMovie } from '../../api/movieApi'
import dayjs from 'dayjs'

const MovieTable = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [form] = Form.useForm();

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

  const openAddModal = () => {
    setEditingMovie(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (movie) => {
    setEditingMovie(movie);
    form.setFieldsValue({
      title: movie.title,
      description: movie.description,
      poster: movie.poster,
      duration: movie.duration,
      languages: movie.languages?.join(', '),
      genre: movie.genre?.join(', '),
      releaseDate: movie.releaseDate ? dayjs(movie.releaseDate) : null,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        title: values.title,
        description: values.description,
        poster: values.poster,
        duration: Number(values.duration),
        languages: values.languages.split(',').map(l => l.trim()),
        genre: values.genre.split(',').map(g => g.trim()),
        releaseDate: values.releaseDate?.toISOString(),
      };

      let response;
      if (editingMovie) {
        response = await updateMovie(editingMovie._id, payload);
      } else {
        response = await addMovie(payload);
      }

      if (response?.success) {
        message.success(editingMovie ? "Movie updated" : "Movie added");
        setModalOpen(false);
        fetchMovies();
      } else {
        message.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      message.error("Please check the form fields");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteMovie(id);
      if (response?.success) {
        message.success("Movie deleted");
        fetchMovies();
      } else {
        message.error(response?.message || "Failed to delete movie");
      }
    } catch (error) {
      message.error("Failed to delete movie");
    }
  };

  const columns = [
    {
      title: 'Poster',
      dataIndex: 'poster',
      key: 'poster',
      render: (poster) => (
        <img src={poster} alt="poster" style={{ width: 50, height: 70, objectFit: 'cover', borderRadius: 4 }} />
      )
    },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: 200,
    },
    { title: 'Genre', dataIndex: 'genre', key: 'genre', render: (g) => g?.join(', ') },
    { title: 'Duration (min)', dataIndex: 'duration', key: 'duration' },
    { title: 'Languages', dataIndex: 'languages', key: 'languages', render: (l) => l?.join(', ') },
    {
      title: 'Release Date',
      dataIndex: 'releaseDate',
      key: 'releaseDate',
      render: (date) => date ? new Date(date).toLocaleDateString() : '-'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => openEditModal(record)}>Edit</Button>
          <Popconfirm title="Delete this movie?" onConfirm={() => handleDelete(record._id)}>
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </>
      )
    }
  ];

  return (
    <div>
      <Button type="primary" onClick={openAddModal} style={{ marginBottom: 16 }}>
        Add Movie
      </Button>

      <Table
        columns={columns}
        dataSource={movies}
        rowKey="_id"
        loading={loading}
      />

      <Modal
        title={editingMovie ? "Edit Movie" : "Add Movie"}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText={editingMovie ? "Update" : "Add"}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Movie Name"
            rules={[{ required: true, message: "Movie name is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Description is required" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="poster"
            label="Poster URL"
            rules={[{ required: true, message: "Poster URL is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="duration"
            label="Duration (in minutes)"
            rules={[{ required: true, message: "Duration is required" }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="languages"
            label="Language"
            rules={[{ required: true, message: "Language is required" }]}
          >
            <Input placeholder="English, Hindi" />
          </Form.Item>

          <Form.Item
            name="genre"
            label="Genre"
            rules={[{ required: true, message: "Genre is required" }]}
          >
            <Input placeholder="Action, Drama" />
          </Form.Item>

          <Form.Item
            name="releaseDate"
            label="Release Date"
            rules={[{ required: true, message: "Release date is required" }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default MovieTable;