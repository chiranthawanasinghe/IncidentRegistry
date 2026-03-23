import React from 'react'
import { Layout, Typography } from 'antd'
import Header from './components/Header'
import StatsCards from './components/StatsCards'
import IncidentTable from './components/IncidentTable'
import { incidents } from './data/dummyData'

const { Content } = Layout
const { Text } = Typography

export default function App() {
  return (
    <Layout className="min-h-screen" style={{ background: '#f0f2f5' }}>
      <Header />
      <Content className="p-6">
        <div className="mb-5">
          <Text className="text-gray-500 text-sm">
            Showing all incidents — Confluence integration coming soon
          </Text>
        </div>
        <StatsCards incidents={incidents} />
        <IncidentTable incidents={incidents} />
      </Content>
    </Layout>
  )
}
