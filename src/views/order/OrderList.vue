<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  DatePicker,
  message
} from 'ant-design-vue'
import { SearchOutlined, EyeOutlined } from '@ant-design/icons-vue'

interface Order {
  id: string
  orderNo: string
  userName: string
  totalAmount: number
  status: number
  payMethod: number
  createTime: string
}

const router = useRouter()

const loading = ref(false)
const searchKeyword = ref('')
const statusFilter = ref<number | null>(null)
const orders = ref<Order[]>([])

const statusMap: Record<number, { text: string; color: string }> = {
  0: { text: '待付款', color: 'orange' },
  1: { text: '待发货', color: 'blue' },
  2: { text: '待收货', color: 'cyan' },
  3: { text: '已完成', color: 'green' },
  4: { text: '已取消', color: 'default' }
}

const payMethodMap: Record<number, string> = {
  1: '微信支付',
  2: '支付宝',
  3: '银行卡'
}

const filteredOrders = computed(() => {
  let data = [...orders.value]
  if (searchKeyword.value) {
    data = data.filter(o => o.orderNo.includes(searchKeyword.value) || o.userName.includes(searchKeyword.value))
  }
  if (statusFilter.value !== null) {
    data = data.filter(o => o.status === statusFilter.value)
  }
  return data
})

const loadOrders = () => {
  loading.value = true
  // 模拟数据
  setTimeout(() => {
    orders.value = [
      {
        id: '1',
        orderNo: 'ORDER202401150001',
        userName: '张三',
        totalAmount: 7999,
        status: 3,
        payMethod: 1,
        createTime: '2024-01-15 10:30:00'
      },
      {
        id: '2',
        orderNo: 'ORDER202401150002',
        userName: '李四',
        totalAmount: 1999,
        status: 2,
        payMethod: 2,
        createTime: '2024-01-15 11:20:00'
      },
      {
        id: '3',
        orderNo: 'ORDER202401150003',
        userName: '王五',
        totalAmount: 12999,
        status: 1,
        payMethod: 1,
        createTime: '2024-01-15 14:10:00'
      },
      {
        id: '4',
        orderNo: 'ORDER202401150004',
        userName: '赵六',
        totalAmount: 4599,
        status: 0,
        payMethod: 3,
        createTime: '2024-01-15 15:30:00'
      },
      {
        id: '5',
        orderNo: 'ORDER202401150005',
        userName: '钱七',
        totalAmount: 2999,
        status: 4,
        payMethod: 2,
        createTime: '2024-01-14 09:00:00'
      }
    ]
    loading.value = false
  }, 500)
}

const handleViewDetail = (id: string) => {
  router.push(`/orders/${id}`)
}

const columns = [
  {
    title: '订单编号',
    dataIndex: 'orderNo',
    key: 'orderNo'
  },
  {
    title: '用户',
    dataIndex: 'userName',
    key: 'userName'
  },
  {
    title: '订单金额',
    dataIndex: 'totalAmount',
    key: 'totalAmount'
  },
  {
    title: '支付方式',
    dataIndex: 'payMethod',
    key: 'payMethod'
  },
  {
    title: '订单状态',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: '下单时间',
    dataIndex: 'createTime',
    key: 'createTime'
  },
  {
    title: '操作',
    key: 'action',
    width: 120
  }
]

onMounted(() => {
  loadOrders()
})
</script>

<template>
  <div class="order-list">
    <div class="toolbar">
      <Space>
        <Input
          v-model:value="searchKeyword"
          placeholder="搜索订单号/用户名"
          style="width: 200px"
          allow-clear
        >
          <template #prefix>
            <SearchOutlined />
          </template>
        </Input>
        <Select
          v-model:value="statusFilter"
          placeholder="订单状态"
          style="width: 120px"
          allow-clear
        >
          <Select.Option :value="0">待付款</Select.Option>
          <Select.Option :value="1">待发货</Select.Option>
          <Select.Option :value="2">待收货</Select.Option>
          <Select.Option :value="3">已完成</Select.Option>
          <Select.Option :value="4">已取消</Select.Option>
        </Select>
        <Button type="primary" @click="loadOrders">
          <SearchOutlined />
          搜索
        </Button>
      </Space>
    </div>

    <Table
      :columns="columns"
      :data-source="filteredOrders"
      :loading="loading"
      row-key="id"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'totalAmount'">
          ¥{{ record.totalAmount.toLocaleString() }}
        </template>
        <template v-else-if="column.key === 'payMethod'">
          {{ payMethodMap[record.payMethod] }}
        </template>
        <template v-else-if="column.key === 'status'">
          <Tag :color="statusMap[record.status].color">
            {{ statusMap[record.status].text }}
          </Tag>
        </template>
        <template v-else-if="column.key === 'action'">
          <Button size="small" type="link" @click="handleViewDetail(record.id)">
            <EyeOutlined />
            查看详情
          </Button>
        </template>
      </template>
    </Table>
  </div>
</template>

<style scoped>
.order-list {
  padding: 0;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}
</style>
