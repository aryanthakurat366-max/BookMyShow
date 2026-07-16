import React, { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, message, Popconfirm, Tag } from 'antd'
import { getTheatres, addTheatre, updateTheatre, deleteTheatre } from '../../api/theatreApi'
import { getAllMovies } from '../../api/movieApi'
import AddShowModal from './AddShowModal'

const PartnerTheatreTable = () => {
  const [theatres, setTheatres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTheatre, setEditingTheatre] = useState(null);
  const [showModalOpen, setShowModalOpen] = useState(false);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [form] = Form.useForm();

  const fetchTheatres = async () => {
    setLoading(true);
    try {
      const response = await getTheatres();
      if (response?.success) {
        setTheatres(response.data);
      }
    } catch (error) {
      message.error("Failed to fetch theatres");
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

  useEffect(() => {
    fetchTheatres();
    fetchMovies();
  }, []);

  const openAddModal = () => {
    setEditingTheatre(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (theatre) => {
    setEditingTheatre(theatre);
    form.setFieldsValue({
      name: theatre.name,
      address: theatre.address,
      phone: theatre.phone,
      email: theatre.email,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      let response;
      if (editingTheatre) {
        response = await updateTheatre(editingTheatre._id, values);
      } else {
        response = await addTheatre(values);
      }

      if (response?.success) {
        message.success(editingTheatre ? "Theatre updated" : "Theatre added");
        setModalOpen(false);
        fetchTheatres();
      } else {
        message.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      message.error("Please check the form fields");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteTheatre(id);
      if (response?.success) {
        message.success("Theatre deleted");
        fetchTheatres();
      } else {
        message.error(response?.message || "Failed to delete theatre");
      }
    } catch (error) {
      message.error("Failed to delete theatre");
    }
  };

  const openShowModal = (theatre) => {
    setSelectedTheatre(theatre);
    setShowModalOpen(true);
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Address', dataIndex: 'address', key: 'address', ellipsis: true },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color = status === 'approved' ? 'green' : status === 'rejected' ? 'red' : 'gold';
        return <Tag color={color}>{status?.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Shows',
      key: 'shows',
      render: (_, record) => (
        <Button
          type="link"
          disabled={record.status !== 'approved'}
          onClick={() => openShowModal(record)}
        >
          + Shows
        </Button>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => openEditModal(record)}>Edit</Button>
          <Popconfirm title="Delete this theatre?" onConfirm={() => handleDelete(record._id)}>
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </>
      )
    }
  ];

  return (
    <div>
      <Button type="primary" onClick={openAddModal} style={{ marginBottom: 16 }}>
        Add Theatre
      </Button>

      <Table
        columns={columns}
        dataSource={theatres}
        rowKey="_id"
        loading={loading}
      />

      <Modal
        title={editingTheatre ? "Edit Theatre" : "Add Theatre"}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText={editingTheatre ? "Update" : "Add"}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Theatre Name" rules={[{ required: true, message: "Theatre name is required" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Address" rules={[{ required: true, message: "Address is required" }]}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true, message: "Phone is required" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: "Email is required" }, { type: 'email', message: "Enter a valid email" }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {selectedTheatre && (
        <AddShowModal
          open={showModalOpen}
          onClose={() => setShowModalOpen(false)}
          theatre={selectedTheatre}
          movies={movies}
          onSuccess={fetchTheatres}
        />
      )}
    </div>
  )
}

export default PartnerTheatreTable;