<script setup lang="ts">
import { ref, onMounted, computed, h } from 'vue'
import {
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Avatar,
  message,
  Modal
} from 'ant-design-vue'
import { SearchOutlined, UserOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons-vue'

interface User {
  id: number
  username: string
  nickname: string
  avatar: string
  phone: string
  email: string
  status: number
  createTime: string
}

const loading = ref(false)
const searchKeyword = ref('')
const statusFilter = ref<number | null>(null)
const users = ref<User[]>([])

const statusMap: Record<number, { text: string; color: string }> = {
  0: { text: '正常', color: 'success' },
  1: { text: '禁用', color: 'error' }
}

const filteredUsers = computed(() => {
  let data = [...users.value]
  if (searchKeyword.value) {
    data = data.filter(u =>
      u.username.includes(searchKeyword.value) ||
      u.nickname.includes(searchKeyword.value) ||
      u.phone.includes(searchKeyword.value)
    )
  }
  if (statusFilter.value !== null) {
    data = data.filter(u => u.status === statusFilter.value)
  }
  return data
})

const loadUsers = () => {
  loading.value = true
  // 模拟数据
  setTimeout(() => {
    users.value = [
      {
        id: 1,
        username: 'zhangsan',
        nickname: '张三',
        avatar: '',
        phone: '13800138000',
        email: 'zhangsan@example.com',
        status: 0,
        createTime: '2024-01-01 10:00:00'
      },
      {
        id: 2,
        username: 'lisi',
        nickname: '李四',
        avatar: '',
        phone: '13800138001',
        email: 'lisi@example.com',
        status: 0,
        createTime: '2024-01-05 15:30:00'
      },
      {
        id: 3,
        username: 'wangwu',
        nickname: '王五',
        avatar: '',
        phone: '13800138002',
        email: 'wangwu@example.com',
        status: 1,
        createTime: '2024-01-10 09:20:00'
      },
      {
        id: 4,
        username: 'zhaoliu',
        nickname: '赵六',
        avatar: '',
        phone: '13800138003',
        email: 'zhaoliu@example.com',
        status: 0,
        createTime: '2024-01-12 14:00:00'
      },
      {
        id: 5,
        username: 'sunqi',
        nickname: '孙七',
        avatar: '',
        phone: '13800138004',
        email: 'sunqi@example.com',
        status: 0,
        createTime: '2024-01-15 11:10:00'
      }
    ]
    loading.value = false
  }, 500)
}

const handleViewDetail = (id: number) => {
  Modal.info({
    title: '用户详情',
    content: `用户ID: ${id}，功能开发中...`
  })
}

const handleToggleStatus = (record: User) => {
  const newStatus = record.status === 0 ? 1 : 0
  const user = users.value.find(u => u.id === record.id)
  if (user) {
    user.status = newStatus
    message.success(newStatus === 0 ? '已启用' : '已禁用')
  }
}

const columns = [
  {
    title: '头像',
    dataIndex: 'avatar',
    key: 'avatar',
    width: 80
  },
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username'
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    key: 'nickname'
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone'
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: '注册时间',
    dataIndex: 'createTime',
    key: 'createTime'
  },
  {
    title: '操作',
    key: 'action',
    width: 160
  }
]

onMounted(() => {
  loadUsers()
})
</script>

<template>
  <div class="user-list">
    <div class="toolbar">
      <Space>
        <Input
          v-model:value="searchKeyword"
          placeholder="搜索用户名/昵称/手机号"
          style="width: 240px"
          allow-clear
        >
          <template #prefix>
            <SearchOutlined />
          </template>
        </Input>
        <Select
          v-model:value="statusFilter"
          placeholder="用户状态"
          style="width: 120px"
          allow-clear
        >
          <Select.Option :value="0">正常</Select.Option>
          <Select.Option :value="1">禁用</Select.Option>
        </Select>
        <Button type="primary" @click="loadUsers">
          <SearchOutlined />
          搜索
        </Button>
      </Space>
    </div>

    <Table
      :columns="columns"
      :data-source="filteredUsers"
      :loading="loading"
      row-key="id"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'avatar'">
          <Avatar :icon="h(UserOutlined)" :src="record.avatar || undefined" />
        </template>
        <template v-else-if="column.key === 'status'">
          <Tag :color="statusMap[record.status].color">
            {{ statusMap[record.status].text }}
          </Tag>
        </template>
        <template v-else-if="column.key === 'action'">
          <Space>
            <Button size="small" type="link" @click="handleViewDetail(record.id)">
              <EyeOutlined />
              查看
            </Button>
            <Button size="small" type="link" @click="handleToggleStatus(record)">
              {{ record.status === 0 ? '禁用' : '启用' }}
            </Button>
          </Space>
        </template>
      </template>
    </Table>
  </div>
</template>

<style scoped>
.user-list {
  padding: 0;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}
</style>
