import React from 'react'
import { Form, Input, Button, Card, message } from 'antd'
import { useParams, useNavigate } from 'react-router-dom'
import { resetPassword } from '../api/authApi'

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await resetPassword(token, values.password);
      if (response?.success) {
        message.success("Password reset successful! Please login.");
        navigate('/login');
      } else {
        message.error(response?.message || "Reset failed, link may be expired");
      }
    } catch (error) {
      message.error("Reset failed");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '4rem auto', padding: '0 1rem' }}>
      <Card title="Reset Your Password">
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="password"
            label="New Password"
            rules={[{ required: true, message: "Password is required" }, { min: 6, message: "Minimum 6 characters" }]}
          >
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Reset Password
          </Button>
        </Form>
      </Card>
    </div>
  )
}

export default ResetPassword;