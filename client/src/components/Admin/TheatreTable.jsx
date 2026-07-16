import React, { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, message, Popconfirm, Tag } from 'antd'
import { getTheatres, addTheatre, updateTheatre, deleteTheatre } from '../../api/theatreApi'

const TheatreTable = () => {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTheatre, setEditingTheatre] = useState(null);
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

  useEffect(() => {
    fetchTheatres();
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

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Address', dataIndex: 'address', key: 'address', ellipsis: true },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Owner',
      dataIndex: 'owner',
      key: 'owner',
      render: (owner) => owner?.name || '-'
    },
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
          <Form.Item
            name="name"
            label="Theatre Name"
            rules={[{ required: true, message: "Theatre name is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Address is required" }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: "Phone is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Email is required" }, { type: 'email', message: "Enter a valid email" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default TheatreTable;