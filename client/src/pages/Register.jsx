import React from 'react'
import { Form, Input, Button, Radio, Card, message } from 'antd'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../api/authApi'

const Register = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await registerUser(values);
      if (response?.success) {
        message.success("Registration successful! Please login.");
        navigate('/login');
      } else {
        message.error(response?.message || "Registration failed");
      }
    } catch (error) {
      message.error("Registration failed");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '4rem auto', padding: '0 1rem' }}>
      <Card title="Register for BookMyShow">
        <Form layout="vertical" onFinish={onFinish} initialValues={{ role: 'user' }}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Name is required" }]}
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

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Password is required" }, { min: 6, message: "Minimum 6 characters" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="role"
            label="I want to join as"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Radio.Group>
              <Radio value="user">User (Book movie tickets)</Radio>
              <Radio value="partner">Partner (List my theatre)</Radio>
            </Radio.Group>
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Register
          </Button>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </Card>
    </div>
  )
}

export default Register;