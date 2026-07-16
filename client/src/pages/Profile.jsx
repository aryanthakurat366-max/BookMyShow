import React, { useEffect, useState } from 'react'
import { message, Card, Descriptions, Tag, Spin } from 'antd'
import { getCurrentUser } from '../api/authApi'
import Admin from './Admin'
import { Partner } from './Partner'
import OwnerDashboard from '../components/Owner/OwnerDashboard'

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      const response = await getCurrentUser();
      if (response?.success) {
        setUserInfo(response?.data);
      }
    } catch (error) {
      message.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'red';
      case 'owner': return 'gold';
      case 'partner': return 'blue';
      default: return 'green';
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!userInfo) {
    return <div style={{ textAlign: 'center', marginTop: '3rem' }}>No user data found.</div>;
  }

  if (userInfo.role === 'admin') {
    return <Admin />;
  }

  if (userInfo.role === 'partner') {
    return <Partner />;
  }

  if (userInfo.role === 'owner') {
    return <OwnerDashboard />;
  }

  return (
    <Card title="My Profile" style={{ maxWidth: 500, margin: '2rem auto' }}>
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Name">{userInfo.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{userInfo.email}</Descriptions.Item>
        <Descriptions.Item label="Role">
          <Tag color={getRoleColor(userInfo.role)}>
            {userInfo.role?.toUpperCase()}
          </Tag>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  )
}

export default Profile;