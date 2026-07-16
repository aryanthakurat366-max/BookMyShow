import React, { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, InputNumber, DatePicker, Select, message, Popconfirm } from 'antd'
import { getAllShows, addShow, updateShow, deleteShow } from '../../api/showApi'
import { getAllMovies } from '../../api/movieApi'
import { getTheatres } from '../../api/theatreApi'
import dayjs from 'dayjs'

const ShowTable = () => {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingShow, setEditingShow] = useState(null);
  const [form] = Form.useForm();

  const fetchShows = async () => {
    setLoading(true);
    try {
      const response = await getAllShows();
      if (response?.success) {
        setShows(response.data);
      }
    } catch (error) {
      message.error("Failed to fetch shows");
    } finally {
      setLoading(false);
    }
  };

  const fetchMovies = async () => {
    try {
      const response = await getAllMovies();
      if (response?.success) {
        setMovies(response.data);
      }
    } catch (error) {
      message.error("Failed to fetch movies");
    }
  };

  const fetchApprovedTheatres = async () => {
    try {
      const response = await getTheatres();
      if (response?.success) {
        const approvedOnly = response.data.filter(t => t.status === 'approved');
        setTheatres(approvedOnly);
      }
    } catch (error) {
      message.error("Failed to fetch theatres");
    }
  };

  useEffect(() => {
    fetchShows();
    fetchMovies();
    fetchApprovedTheatres();
  }, []);

  const openAddModal = () => {
    setEditingShow(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (show) => {
    setEditingShow(show);
    form.setFieldsValue({
      name: show.name,
      date: show.date ? dayjs(show.date) : null,
      time: show.time,
      movie: show.movie?._id,
      theatre: show.theatre?._id,
      ticketPrice: show.ticketPrice,
      totalSeats: show.totalSeats,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        name: values.name,
        date: values.date?.toISOString(),
        time: values.time,
        movie: values.movie,
        theatre: values.theatre,
        ticketPrice: Number(values.ticketPrice),
        totalSeats: Number(values.totalSeats),
      };

      let response;
      if (editingShow) {
        response = await updateShow(editingShow._id, payload);
      } else {
        response = await addShow(payload);
      }

      if (response?.success) {
        message.success(editingShow ? "Show updated" : "Show added");
        setModalOpen(false);
        fetchShows();
      } else {
        message.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      message.error("Please check the form fields");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteShow(id);
      if (response?.success) {
        message.success("Show deleted");
        fetchShows();
      } else {
        message.error(response?.message || "Failed to delete show");
      }
    } catch (error) {
      message.error("Failed to delete show");
    }
  };

  const columns = [
    { title: 'Show Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Movie',
      dataIndex: 'movie',
      key: 'movie',
      render: (movie) => movie?.title || '-'
    },
    {
      title: 'Theatre',
      dataIndex: 'theatre',
      key: 'theatre',
      render: (theatre) => theatre?.name || '-'
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => date ? new Date(date).toLocaleDateString() : '-'
    },
    { title: 'Time', dataIndex: 'time', key: 'time' },
    { title: 'Price (₹)', dataIndex: 'ticketPrice', key: 'ticketPrice' },
    { title: 'Total Seats', dataIndex: 'totalSeats', key: 'totalSeats' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => openEditModal(record)}>Edit</Button>
          <Popconfirm title="Delete this show?" onConfirm={() => handleDelete(record._id)}>
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </>
      )
    }
  ];

  return (
    <div>
      <Button type="primary" onClick={openAddModal} style={{ marginBottom: 16 }}>
        Add Show
      </Button>

      <Table
        columns={columns}
        dataSource={shows}
        rowKey="_id"
        loading={loading}
      />

      <Modal
        title={editingShow ? "Edit Show" : "Add Show"}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText={editingShow ? "Update" : "Add"}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Show Name"
            rules={[{ required: true, message: "Show name is required" }]}
          >
            <Input placeholder="e.g. Morning Show, Evening Show" />
          </Form.Item>

          <Form.Item
            name="movie"
            label="Movie"
            rules={[{ required: true, message: "Please select a movie" }]}
          >
            <Select placeholder="Select movie">
              {movies.map(m => (
                <Select.Option key={m._id} value={m._id}>{m.title}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="theatre"
            label="Theatre"
            rules={[{ required: true, message: "Please select a theatre" }]}
          >
            <Select placeholder="Select approved theatre">
              {theatres.map(t => (
                <Select.Option key={t._id} value={t._id}>{t.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="date"
            label="Show Date"
            rules={[{ required: true, message: "Date is required" }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="time"
            label="Show Time"
            rules={[{ required: true, message: "Time is required" }]}
          >
            <Input placeholder="e.g. 6:30 PM" />
          </Form.Item>

          <Form.Item
            name="ticketPrice"
            label="Ticket Price (₹)"
            rules={[{ required: true, message: "Price is required" }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="totalSeats"
            label="Total Seats"
            rules={[{ required: true, message: "Total seats is required" }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ShowTable;