import React from 'react'
import { Card, Statistic, Row, Col } from 'antd'
import {
  AlertOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'

export default function StatsCards({ incidents }) {
  const total = incidents.length
  const open = incidents.filter(i => i.status === 'Open').length
  const inProgress = incidents.filter(i => i.status === 'In Progress').length
  const resolved = incidents.filter(i => i.status === 'Resolved').length
  const critical = incidents.filter(i => i.priority === 'Critical').length

  const cards = [
    {
      title: 'Total Incidents',
      value: total,
      icon: <AlertOutlined />,
      color: '#1d2d44',
      bg: '#e8ecf0',
    },
    {
      title: 'Open',
      value: open,
      icon: <ExclamationCircleOutlined />,
      color: '#1677ff',
      bg: '#e6f4ff',
    },
    {
      title: 'In Progress',
      value: inProgress,
      icon: <SyncOutlined spin />,
      color: '#fa8c16',
      bg: '#fff7e6',
    },
    {
      title: 'Resolved',
      value: resolved,
      icon: <CheckCircleOutlined />,
      color: '#52c41a',
      bg: '#f6ffed',
    },
    {
      title: 'Critical',
      value: critical,
      icon: <CloseCircleOutlined />,
      color: '#f5222d',
      bg: '#fff1f0',
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
