import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Layout, Button } from 'antd'
import { HomeOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons'

const { Header, Content, Footer } = Layout;

const ProtectedRoutes = ({ children }) => {
  const navigate = useNavigate();
  const user = localStorage.getItem('user');

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px'
      }}>
        <div
          style={{
            color: '#fff',
            fontSize: '20px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/')}
        >
          <HomeOutlined />
          BookMyShow
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Button
            type="text"
            icon={<UserOutlined style={{ color: '#fff' }} />}
            style={{ color: '#fff' }}
            onClick={() => navigate('/profile')}
          >
            Profile
          </Button>

          <Button
            type="text"
            icon={<LogoutOutlined style={{ color: '#fff' }} />}
            style={{ color: '#fff' }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </Header>

      <Content style={{ padding: '24px', minHeight: 'calc(100vh - 134px)' }}>
        {children}
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        © 2026 BookMyShow. All rights reserved.
      </Footer>
    </Layout>
  );
}

export default ProtectedRoutes;