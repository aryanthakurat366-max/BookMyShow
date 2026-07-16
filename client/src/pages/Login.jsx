import React from 'react'
import { Form, Input, Button, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../api/authApi'

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await loginUser(values);
      console.log(response);

      if (response?.success) {
        message.success(response?.message || 'Login successful');
        localStorage.setItem('user', JSON.stringify(response?.data));
        navigate('/');
      } else {
        message.warning(response?.message);
      }
    } catch (error) {
      message.error(error);
    }
  };

  return (
    <main className='App-header'>
      <h1>Login to BookMyShow</h1>
      <section>
        <Form layout='vertical' onFinish={onFinish}>

          <Form.Item label="Email" htmlFor='email' name="email" className='d-block' rules={[
            { required: true, message: 'Please enter your email' },
            { type: "email", message: 'Please enter a valid email' }
          ]}>
            <Input id='email' type="text" placeholder='Enter your email' />
          </Form.Item>

          <Form.Item label="Password" htmlFor='password' name="password" className='d-block' rules={[
            { required: true, message: 'Please enter your password' },
            { min: 6, message: 'Password must be at least 6 characters' }
          ]}>
            <Input.Password id='password' placeholder='Enter your password' />
          </Form.Item>

          <p style={{ textAlign: 'right', marginTop: -8, marginBottom: 16 }}>
            <Link to='/forgot-password'>Forgot password?</Link>
          </p>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>

          <p className='text-center'>
            Not registered yet? <Link to='/register'>Register here</Link>
          </p>

        </Form>
      </section>
    </main>
  )
}

export default Login;