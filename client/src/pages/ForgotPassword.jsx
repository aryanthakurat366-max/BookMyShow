import React, { useState } from 'react'
import { Form, Input, Button, Card, message } from 'antd'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../api/authApi'

const ForgotPassword = () => {
  const [sent, setSent] = useState(false);

  const onFinish = async (values) => {
    try {
      const response = await forgotPassword(values.email);
      if (response?.success) {
        message.success("Reset link sent to your email");
        setSent(true);
      } else {
        message.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '4rem auto', padding: '0 1rem' }}>
      <Card title="Forgot Password">
        {sent ? (
          <p>Check your email for a password reset link. It's valid for 15 minutes.</p>
        ) : (
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Email is required" }, { type: 'email', message: "Enter a valid email" }]}
            >
              <Input />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              Send Reset Link
            </Button>
          </Form>
        )}
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Link to="/login">Back to Login</Link>
        </div>
      </Card>
    </div>
  )
}

export default ForgotPassword;