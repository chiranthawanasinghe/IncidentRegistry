import React, { useState, useEffect } from 'react'
import { Layout, Typography, ConfigProvider, theme } from 'antd'
import Header from './components/Header'
import StatsCards from './components/StatsCards'
import IncidentTable from './components/IncidentTable'
import { incidents } from './data/dummyData'

const { Content } = Layout
const { Text } = Typography

export default function App() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Layout className="min-h-screen" style={{ background: isDark ? '#141414' : '#f0f2f5' }}>
        <Header isDark={isDark} onToggle={() => setIsDark(d => !d)} />
        <Content className="p-6">
          <div className="mb-5">
            <Text className="text-sm" type="secondary">
              Showing all incidents — Confluence integration coming soon
            </Text>
          </div>
          <StatsCards incidents={incidents} isDark={isDark} />
          <IncidentTable incidents={incidents} isDark={isDark} />
        </Content>
      </Layout>
    </ConfigProvider>
  )
}
