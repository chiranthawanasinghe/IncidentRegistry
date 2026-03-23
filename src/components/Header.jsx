import React from 'react'
import { Layout, Typography, Button, Tooltip } from 'antd'
import { AlertOutlined, SunOutlined, MoonOutlined } from '@ant-design/icons'

const { Header: AntHeader } = Layout
const { Title, Text } = Typography

export default function Header({ isDark, onToggle }) {
  return (
    <AntHeader className="flex items-center gap-3 px-6" style={{ background: '#1d2d44', height: 64, lineHeight: 'normal' }}>
      <AlertOutlined style={{ fontSize: 24, color: '#f0a500' }} />
      <div className="flex-1">
        <Title level={4} style={{ color: '#fff', margin: 0, lineHeight: 1.2 }}>
          Incident Registry
        </Title>
        <Text style={{ color: '#a0aec0', fontSize: 12 }}>
          Incident tracking and management
        </Text>
      </div>
      <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
        <Button
          type="text"
          icon={isDark ? <SunOutlined /> : <MoonOutlined />}
          onClick={onToggle}
          style={{ color: '#a0aec0', fontSize: 16 }}
        />
      </Tooltip>
    </AntHeader>
  )
}
