import React from 'react'
import { Tabs } from 'antd'
import PartnerTheatreTable from '../components/Partner/PartnerTheatreTable'
import ShowTable from '../components/Partner/ShowTable'

export const Partner = () => {
  const items = [
    {
      key: "theatres",
      label: "Theatres",
      children: <PartnerTheatreTable />
    },
    {
      key: "shows",
      label: "Shows",
      children: <ShowTable />
    }
  ]

  return (
    <div style={{ padding: "2rem", margin: "2rem" }}>
      <h1>Partner Dashboard</h1>
      <Tabs items={items} defaultActiveKey="theatres" />
    </div>
  )
}

export default Partner;