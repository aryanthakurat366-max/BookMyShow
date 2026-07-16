import React from 'react'
import { Tabs } from 'antd'
import MovieTable from '../components/Admin/MovieTable'
import TheatreTable from '../components/Admin/TheatreTable'

const Admin = () => {
  const tabItems = [
    {
      key: "1",
      label: "Movies",
      children: <MovieTable />
    },
    {
      key: "2",
      label: "Theatres",
      children: <TheatreTable />
    }
  ]
  return (
    <div style={{ padding: "2rem", margin: "2rem" }}>
      <h1>Admin Dashboard</h1>
      <Tabs items={tabItems} defaultActiveKey="1" />
    </div>
  );
};
export default Admin;