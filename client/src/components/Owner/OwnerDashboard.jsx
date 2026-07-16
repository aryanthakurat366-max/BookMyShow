import React, { useEffect, useState } from 'react'
import { Table, Tag, Button, message, Popconfirm, Space } from 'antd'
import { getTheatres, updateTheatreStatus } from '../../api/theatreApi'

const OwnerDashboard = () => {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const handleStatusChange = async (id, status) => {
    try {
      const response = await updateTheatreStatus(id, status);
      if (response?.success) {
        message.success(`Theatre ${status}`);
        fetchTheatres();
      } else {
        message.error(response?.message || "Failed to update status");
      }
    } catch (error) {
      message.error("Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'green';
      case 'rejected': return 'red';
      default: return 'gold';
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Address', dataIndex: 'address', key: 'address', ellipsis: true },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Submitted By',
      dataIndex: 'owner',
      key: 'owner',
      render: (owner) => (
        <div>
          <div>{owner?.name || '-'}</div>
          <Tag>{owner?.role?.toUpperCase()}</Tag>
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status?.toUpperCase()}</Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        record.status === 'pending' ? (
          <Space>
            <Popconfirm title="Approve this theatre?" onConfirm={() => handleStatusChange(record._id, 'approved')}>
              <Button type="link" style={{ color: 'green' }}>Approve</Button>
            </Popconfirm>
            <Popconfirm title="Reject this theatre?" onConfirm={() => handleStatusChange(record._id, 'rejected')}>
              <Button type="link" danger>Reject</Button>
            </Popconfirm>
          </Space>
        ) : (
          <Space>
            <Button
              type="link"
              onClick={() => handleStatusChange(record._id, record.status === 'approved' ? 'rejected' : 'approved')}
            >
              Change to {record.status === 'approved' ? 'Rejected' : 'Approved'}
            </Button>
          </Space>
        )
      )
    }
  ];

  return (
    <div style={{ padding: "2rem", margin: "2rem" }}>
      <h1>Owner Dashboard</h1>
      <h3 style={{ color: '#e50914' }}>Theatre Approvals</h3>

      <Table
        columns={columns}
        dataSource={theatres}
        rowKey="_id"
        loading={loading}
        style={{ marginTop: 16 }}
      />
    </div>
  )
}

export default OwnerDashboard;