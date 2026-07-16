import React from 'react'
import { Modal, Form, Input, InputNumber, DatePicker, TimePicker, Select, message } from 'antd'
import { addShow } from '../../api/showApi'

const AddShowModal = ({ open, onClose, theatre, movies, onSuccess }) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        name: values.name,
        date: values.date?.toISOString(),
        time: values.time?.format('h:mm A'),
        movie: values.movie,
        theatre: theatre?._id,
        ticketPrice: Number(values.ticketPrice),
        totalSeats: Number(values.totalSeats),
      };

      const response = await addShow(payload);

      if (response?.success) {
        message.success("Show added successfully");
        form.resetFields();
        onSuccess();
        onClose();
      } else {
        message.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      message.error("Please check the form fields");
    }
  };

  return (
    <Modal
      title={theatre?.name}
      open={open}
      onOk={handleSubmit}
      onCancel={onClose}
      okText="Add Show"
      cancelText="Go Back"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Show Name"
          rules={[{ required: true, message: "Show name is required" }]}
        >
          <Input placeholder="Enter the show name" />
        </Form.Item>

        <Form.Item
          name="date"
          label="Show Date"
          rules={[{ required: true, message: "Show date is required" }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="time"
          label="Show Timing"
          rules={[{ required: true, message: "Show timing is required" }]}
        >
          <TimePicker style={{ width: '100%' }} format="h:mm A" use12Hours />
        </Form.Item>

        <Form.Item
          name="movie"
          label="Select Movie"
          rules={[{ required: true, message: "Please select a movie" }]}
        >
          <Select placeholder="Select movie">
            {movies.map(m => (
              <Select.Option key={m._id} value={m._id}>{m.title}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="ticketPrice"
          label="Ticket Price"
          rules={[{ required: true, message: "Ticket price is required" }]}
        >
          <InputNumber style={{ width: '100%' }} placeholder="Enter ticket price" />
        </Form.Item>

        <Form.Item
          name="totalSeats"
          label="Total Seats"
          rules={[{ required: true, message: "Total seats is required" }]}
        >
          <InputNumber style={{ width: '100%' }} placeholder="Enter total seats" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddShowModal;