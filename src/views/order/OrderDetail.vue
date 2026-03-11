<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Descriptions, Button, Card, Table, Space, Tag, message, Modal } from 'ant-design-vue'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()
const loading = ref(false)

interface OrderItem {
  id: number
  name: string
  image: string
  price: number
  quantity: number
}

interface OrderInfo {
  id: string
  orderNo: string
  userName: string
  userPhone: string
  userAddress: string
  totalAmount: number
  status: number
  payMethod: number
  payTime: string
  createTime: string
  items: OrderItem[]
}

const orderInfo = ref<OrderInfo | null>(null)

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

const loadOrderDetail = () => {
  loading.value = true
  // 模拟加载订单详情
  setTimeout(() => {
    orderInfo.value = {
      id: route.params.id as string,
      orderNo: 'ORDER202401150001',
      userName: '张三',
      userPhone: '13800138000',
      userAddress: '广东省深圳市南山区科技园xxx',
      totalAmount: 7999,
      status: 2,
      payMethod: 1,
      payTime: '2024-01-15 10:35:00',
      createTime: '2024-01-15 10:30:00',
      items: [
        {
          id: 1,
          name: 'iPhone 15 Pro',
          image: 'https://picsum.photos/60/60?random=1',
          price: 7999,
          quantity: 1
        }
      ]
    }
    loading.value = false
  }, 300)
}

const handleShip = () => {
  Modal.confirm({
    title: '确认发货',
    content: '确定要发货吗？',
    onOk: () => {
      if (orderInfo.value) {
        orderInfo.value.status = 2
        message.success('发货成功')
      }
    }
  })
}

const handleConfirmReceive = () => {
  Modal.confirm({
    title: '确认收货',
    content: '确定用户已收到货物吗？',
    onOk: () => {
      if (orderInfo.value) {
        orderInfo.value.status = 3
        message.success('已确认收货')
      }
    }
  })
}

const handleBack = () => {
  router.push('/orders')
}

const columns = [
  {
    title: '商品图片',
    dataIndex: 'image',
    key: 'image',
    width: 100
  },
  {
    title: '商品名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '单价',
    dataIndex: 'price',
    key: 'price'
  },
  {
    title: '数量',
    dataIndex: 'quantity',
    key: 'quantity'
  },
  {
    title: '小计',
    key: 'subtotal'
  }
]

onMounted(() => {
  loadOrderDetail()
})
</script>

<template>
  <div class="order-detail">
    <div class="header">
      <Button @click="handleBack">
        <ArrowLeftOutlined />
        返回
      </Button>
      <h2>订单详情</h2>
    </div>

    <div v-if="orderInfo" class="content">
      <Card title="订单信息" :loading="loading">
        <Descriptions :column="2" bordered>
          <Descriptions.Item label="订单编号">{{ orderInfo.orderNo }}</Descriptions.Item>
          <Descriptions.Item label="订单状态">
            <Tag :color="statusMap[orderInfo.status].color">
              {{ statusMap[orderInfo.status].text }}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="下单时间">{{ orderInfo.createTime }}</Descriptions.Item>
          <Descriptions.Item label="支付时间">{{ orderInfo.payTime }}</Descriptions.Item>
          <Descriptions.Item label="支付方式">{{ payMethodMap[orderInfo.payMethod] }}</Descriptions.Item>
          <Descriptions.Item label="订单金额">¥{{ orderInfo.totalAmount.toLocaleString() }}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="收货信息" :loading="loading" style="margin-top: 16px">
        <Descriptions :column="2" bordered>
          <Descriptions.Item label="收货人">{{ orderInfo.userName }}</Descriptions.Item>
          <Descriptions.Item label="联系电话">{{ orderInfo.userPhone }}</Descriptions.Item>
          <Descriptions.Item label="收货地址" :column="2">{{ orderInfo.userAddress }}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="商品信息" :loading="loading" style="margin-top: 16px">
        <Table
          :columns="columns"
          :data-source="orderInfo.items"
          :pagination="false"
          row-key="id"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'image'">
              <img :src="record.image" style="width: 60px; height: 60px; object-fit: cover" />
            </template>
            <template v-else-if="column.key === 'price'">
              ¥{{ record.price.toLocaleString() }}
            </template>
            <template v-else-if="column.key === 'subtotal'">
              ¥{{ (record.price * record.quantity).toLocaleString() }}
            </template>
          </template>
        </Table>
      </Card>

      <div v-if="orderInfo.status === 1" class="action-bar">
        <Button type="primary" @click="handleShip">确认发货</Button>
      </div>

      <div v-if="orderInfo.status === 2" class="action-bar">
        <Button type="primary" @click="handleConfirmReceive">确认收货</Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.order-detail {
  padding: 0;
}

.header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.header h2 {
  margin: 0;
}

.content {
  padding: 0;
}

.action-bar {
  margin-top: 16px;
  text-align: right;
}
</style>
