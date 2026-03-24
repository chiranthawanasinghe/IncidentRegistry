import React from 'react'
import { Card, Statistic, Row, Col } from 'antd'
import {
  AlertOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'

export default function StatsCards({ incidents, isDark }) {
  const total = incidents.length
  const created = incidents.filter(i => i.status === 'Created').length
  const rcaAnalysis = incidents.filter(i => i.status === 'RCA & Impact Analysis').length
  const approved = incidents.filter(i => i.status === 'Approved').length
  const critical = incidents.filter(i => i.priority === 'Sev-1').length

  const cards = [
    {
      title: 'Total Incidents',
      value: total,
      icon: <AlertOutlined />,
      color: isDark ? '#7e9cbf' : '#1d2d44',
      bg: isDark ? '#1a2535' : '#e8ecf0',
    },
    {
      title: 'Created',
      value: created,
      icon: <ExclamationCircleOutlined />,
      color: '#1677ff',
      bg: isDark ? '#111d2c' : '#e6f4ff',
    },
    {
      title: 'RCA & Impact Analysis',
      value: rcaAnalysis,
      icon: <SyncOutlined spin />,
      color: '#fa8c16',
      bg: isDark ? '#2b1d11' : '#fff7e6',
    },
    {
      title: 'Approved',
      value: approved,
      icon: <CheckCircleOutlined />,
      color: '#52c41a',
      bg: isDark ? '#162312' : '#f6ffed',
    },
    {
      title: 'Sev-1',
      value: critical,
      icon: <CloseCircleOutlined />,
      color: '#f5222d',
      bg: isDark ? '#2a1215' : '#fff1f0',
    },
  ]

  return (
    <Row gutter={[16, 16]} className="mb-6">
      {cards.map(card => (
        <Col key={card.title} xs={24} sm={12} md={8} lg={8} xl={4} style={{ flex: '1 1 0' }}>
          <Card
            style={{ background: card.bg, border: 'none', borderRadius: 8 }}
            styles={{ body: { padding: '16px 20px' } }}
          >
            <div className="flex items-center justify-between">
              <Statistic
                title={<span style={{ color: '#555', fontSize: 13 }}>{card.title}</span>}
                value={card.value}
                valueStyle={{ color: card.color, fontWeight: 700, fontSize: 28 }}
              />
              <span style={{ fontSize: 28, color: card.color, opacity: 0.4 }}>
                {card.icon}
              </span>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  )
}
