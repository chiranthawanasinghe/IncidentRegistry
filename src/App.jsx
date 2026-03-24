import React, { useState, useEffect } from 'react'
import { Layout, Typography, ConfigProvider, theme, Spin, Alert } from 'antd'
import Header from './components/Header'
import StatsCards from './components/StatsCards'
import IncidentTable from './components/IncidentTable'
import { fetchAllIncidents } from './api/confluence'
import { incidents as dummyIncidents } from './data/dummyData'

const { Content } = Layout
const { Text } = Typography

export default function App() {
  const [isDark, setIsDark] = useState(false)
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  useEffect(() => {
    fetchAllIncidents()
      .then(data => {
        if (data.length === 0) {
          setError('API connected but no incidents were parsed — check the browser console for table header details')
          setIncidents(dummyIncidents)
        } else {
          setIncidents(data)
        }
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setIncidents(dummyIncidents)
        setLoading(false)
      })
  }, [])

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Layout className="min-h-screen" style={{ background: isDark ? '#141414' : '#f0f2f5' }}>
        <Header isDark={isDark} onToggle={() => setIsDark(d => !d)} />
        <Content className="p-6">
          {error && (
            <Alert
              message="Could not load from Confluence"
              description={error}
              type="warning"
              showIcon
              closable
              className="mb-4"
            />
          )}
          <div className="mb-5">
            <Text className="text-sm" type="secondary">
              {loading
                ? 'Loading incidents from Confluence...'
                : error
                ? 'Showing sample data — check your .env credentials'
                : 'Live data from Confluence'}
            </Text>
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Spin size="large" />
            </div>
          ) : (
            <>
              <StatsCards incidents={incidents} isDark={isDark} />
              <IncidentTable incidents={incidents} isDark={isDark} />
            </>
          )}
        </Content>
      </Layout>
    </ConfigProvider>
  )
}
