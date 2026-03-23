import React, { useState, useMemo } from 'react'
import { Table, Input, Select, Tag, Button, Space, Tooltip, Card } from 'antd'
import { SearchOutlined, ReloadOutlined, LinkOutlined } from '@ant-design/icons'
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '../data/dummyData'

const STATUS_COLOR = {
  'Open': 'blue',
  'In Progress': 'orange',
  'Resolved': 'green',
  'Closed': 'default',
}

const PRIORITY_COLOR = {
  'Critical': 'red',
  'High': 'volcano',
  'Medium': 'gold',
  'Low': 'cyan',
}

export default function IncidentTable({ incidents, isDark }) {
  const c = {
    primary: isDark ? '#e5e7eb' : '#111827',
    secondary: isDark ? '#9ca3af' : '#374151',
    muted: isDark ? '#6b7280' : '#6b7280',
  }
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState([])
  const [priorityFilter, setPriorityFilter] = useState([])

  const filtered = useMemo(() => {
    return incidents.filter(inc => {
      const matchesSearch =
        !search ||
        inc.title.toLowerCase().includes(search.toLowerCase()) ||
        inc.id.toLowerCase().includes(search.toLowerCase()) ||
        inc.assignee.toLowerCase().includes(search.toLowerCase()) ||
        inc.category.toLowerCase().includes(search.toLowerCase())

      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(inc.status)
      const matchesPriority = priorityFilter.length === 0 || priorityFilter.includes(inc.priority)

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [incidents, search, statusFilter, priorityFilter])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      sorter: (a, b) => a.id.localeCompare(b.id),
      render: id => <span className="font-mono text-sm" style={{ color: c.secondary }}>{id}</span>,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (title, record) => (
        <div>
          <div className="font-medium" style={{ color: c.primary }}>{title}</div>
          <div className="text-xs mt-0.5" style={{ color: c.muted }}>{record.category}</div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: status => (
        <Tag color={STATUS_COLOR[status]} style={{ borderRadius: 12, fontWeight: 500 }}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 110,
      sorter: (a, b) => {
        const order = { Critical: 0, High: 1, Medium: 2, Low: 3 }
        return order[a.priority] - order[b.priority]
      },
      render: priority => (
        <Tag color={PRIORITY_COLOR[priority]} style={{ borderRadius: 12, fontWeight: 500 }}>
          {priority}
        </Tag>
      ),
    },
    {
      title: 'Assignee',
      dataIndex: 'assignee',
      key: 'assignee',
      width: 140,
      sorter: (a, b) => a.assignee.localeCompare(b.assignee),
      render: assignee => <span className="text-sm" style={{ color: c.primary }}>{assignee}</span>,
    },
    {
      title: 'Reporter',
      dataIndex: 'reporter',
      key: 'reporter',
      width: 140,
      render: reporter => <span className="text-sm" style={{ color: c.secondary }}>{reporter}</span>,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 110,
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: date => <span className="text-sm" style={{ color: c.secondary }}>{date}</span>,
    },
    {
      title: 'Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 110,
      sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
      render: date => <span className="text-sm" style={{ color: c.secondary }}>{date}</span>,
    },
    {
      title: '',
      key: 'actions',
      width: 60,
      render: (_, record) => (
        <Tooltip title="Open in Confluence">
          <Button
            type="text"
            icon={<LinkOutlined />}
            size="small"
            href={record.confluenceUrl}
            target="_blank"
            style={{ color: '#1677ff' }}
          />
        </Tooltip>
      ),
    },
  ]

  const handleReset = () => {
    setSearch('')
    setStatusFilter([])
    setPriorityFilter([])
  }

  return (
    <Card style={{ borderRadius: 8, border: 'none' }} styles={{ body: { padding: 0 } }}>
      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3 items-center p-4 border-b border-gray-100 dark:border-gray-700">
        <Input
          placeholder="Search by title, ID, assignee, category..."
          prefix={<SearchOutlined style={{ color: '#bbb' }} />}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 320 }}
          allowClear
        />
        <Select
          mode="multiple"
          placeholder="Filter by Status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={STATUS_OPTIONS.map(s => ({ label: s, value: s }))}
          style={{ minWidth: 200 }}
          maxTagCount="responsive"
          allowClear
        />
        <Select
          mode="multiple"
          placeholder="Filter by Priority"
          value={priorityFilter}
          onChange={setPriorityFilter}
          options={PRIORITY_OPTIONS.map(p => ({ label: p, value: p }))}
          style={{ minWidth: 200 }}
          maxTagCount="responsive"
          allowClear
        />
        <Button icon={<ReloadOutlined />} onClick={handleReset}>
          Reset
        </Button>
        <span className="ml-auto text-sm text-gray-400 dark:text-gray-500">
          {filtered.length} of {incidents.length} incidents
        </span>
      </div>

      {/* Table */}
      <Table
        dataSource={filtered}
        columns={columns}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} incidents`,
        }}
        scroll={{ x: 1000 }}
        size="middle"
        onRow={record => ({
          style: record.priority === 'Critical' && record.status === 'Open'
            ? { background: isDark ? 'rgba(239,68,68,0.08)' : 'rgba(239,68,68,0.05)' }
            : {},
        })}
        expandable={{
          expandedRowRender: record => (
            <div className="px-4 py-2 text-sm" style={{ background: isDark ? '#1f2937' : '#ffffff', color: isDark ? '#d1d5db' : '#374151', borderRadius: 6 }}>
              <span className="font-medium" style={{ color: isDark ? '#f3f4f6' : '#111827' }}>Description: </span>
              {record.description}
            </div>
          ),
          rowExpandable: record => !!record.description,
        }}
      />
    </Card>
  )
}
