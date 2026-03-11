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
  Modal,
  message,
  Popconfirm
} from 'ant-design-vue'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UpOutlined,
  DownOutlined
} from '@ant-design/icons-vue'

interface Product {
  id: number
  name: string
  category: string
  price: number
  stock: number
  status: 0 | 1
  image: string
  createTime: string
}

const router = useRouter()

const loading = ref(false)
const searchKeyword = ref('')
const statusFilter = ref<number | null>(null)
const products = ref<Product[]>([])
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0
})

const statusMap = {
  0: { text: '下架', color: 'default' },
  1: { text: '上架', color: 'success' }
}

const filteredProducts = computed(() => {
  let data = [...products.value]
  if (searchKeyword.value) {
    data = data.filter(p => p.name.includes(searchKeyword.value))
  }
  if (statusFilter.value !== null) {
    data = data.filter(p => p.status === statusFilter.value)
  }
  return data
})

const loadProducts = () => {
  loading.value = true
  // 模拟数据
  setTimeout(() => {
    products.value = [
      {
        id: 1,
        name: 'iPhone 15 Pro',
        category: '手机',
        price: 7999,
        stock: 100,
        status: 1,
        image: 'https://picsum.photos/100/100?random=1',
        createTime: '2024-01-15 10:30:00'
      },
      {
        id: 2,
        name: 'MacBook Pro M3',
        category: '电脑',
        price: 12999,
        stock: 50,
        status: 1,
        image: 'https://picsum.photos/100/100?random=2',
        createTime: '2024-01-14 15:20:00'
      },
      {
        id: 3,
        name: 'AirPods Pro',
        category: '耳机',
        price: 1999,
        stock: 0,
        status: 0,
        image: 'https://picsum.photos/100/100?random=3',
        createTime: '2024-01-13 09:00:00'
      },
      {
        id: 4,
        name: 'iPad Air',
        category: '平板',
        price: 4599,
        stock: 80,
        status: 1,
        image: 'https://picsum.photos/100/100?random=4',
        createTime: '2024-01-12 14:10:00'
      },
      {
        id: 5,
        name: 'Apple Watch',
        category: '手表',
        price: 2999,
        stock: 120,
        status: 1,
        image: 'https://picsum.photos/100/100?random=5',
        createTime: '2024-01-11 11:00:00'
      }
    ]
    pagination.value.total = products.value.length
    loading.value = false
  }, 500)
}

const handleAdd = () => {
  router.push('/products/add')
}

const handleEdit = (id: number) => {
  router.push(`/products/${id}/edit`)
}

const handleDelete = (id: number) => {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除该商品吗？',
    onOk: () => {
      products.value = products.value.filter(p => p.id !== id)
      message.success('删除成功')
    }
  })
}

const handleToggleStatus = (record: Product) => {
  const newStatus = record.status === 1 ? 0 : 1
  const product = products.value.find(p => p.id === record.id)
  if (product) {
    product.status = newStatus
    message.success(newStatus === 1 ? '已上架' : '已下架')
  }
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
    title: '分类',
    dataIndex: 'category',
    key: 'category'
  },
  {
    title: '价格',
    dataIndex: 'price',
    key: 'price',
    width: 120
  },
  {
    title: '库存',
    dataIndex: 'stock',
    key: 'stock',
    width: 100
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 180
  },
  {
    title: '操作',
    key: 'action',
    width: 200
  }
]

onMounted(() => {
  loadProducts()
})
</script>

<template>
  <div class="product-list">
    <div class="toolbar">
      <Space>
        <Input
          v-model:value="searchKeyword"
          placeholder="搜索商品名称"
          style="width: 200px"
          allow-clear
        >
          <template #prefix>
            <SearchOutlined />
          </template>
        </Input>
        <Select
          v-model:value="statusFilter"
          placeholder="商品状态"
          style="width: 120px"
          allow-clear
        >
          <Select.Option :value="1">上架</Select.Option>
          <Select.Option :value="0">下架</Select.Option>
        </Select>
        <Button type="primary" @click="loadProducts">
          <SearchOutlined />
          搜索
        </Button>
      </Space>
      <Button type="primary" @click="handleAdd">
        <PlusOutlined />
        新增商品
      </Button>
    </div>

    <Table
      :columns="columns"
      :data-source="filteredProducts"
      :loading="loading"
      :pagination="pagination"
      row-key="id"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'image'">
          <img :src="record.image" style="width: 60px; height: 60px; object-fit: cover" />
        </template>
        <template v-else-if="column.key === 'price'">
          ¥{{ record.price.toLocaleString() }}
        </template>
        <template v-else-if="column.key === 'status'">
          <Tag :color="statusMap[record.status].color">
            {{ statusMap[record.status].text }}
          </Tag>
        </template>
        <template v-else-if="column.key === 'action'">
          <Space>
            <Button size="small" type="link" @click="handleEdit(record.id)">
              <EditOutlined />
              编辑
            </Button>
            <Button size="small" type="link" @click="handleToggleStatus(record)">
              <component :is="record.status === 1 ? DownOutlined : UpOutlined" />
              {{ record.status === 1 ? '下架' : '上架' }}
            </Button>
            <Popconfirm title="确定删除该商品?" @confirm="handleDelete(record.id)">
              <Button size="small" type="link" danger>
                <DeleteOutlined />
                删除
              </Button>
            </Popconfirm>
          </Space>
        </template>
      </template>
    </Table>
  </div>
</template>

<style scoped>
.product-list {
  padding: 0;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}
</style>
