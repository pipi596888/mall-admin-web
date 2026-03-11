<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card, Row, Col, Statistic } from 'ant-design-vue'
import {
  ShoppingOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  RiseOutlined
} from '@ant-design/icons-vue'

const stats = ref({
  totalProducts: 0,
  totalOrders: 0,
  totalUsers: 0,
  todayOrders: 0
})

onMounted(() => {
  // 模拟数据 - 实际项目中从 API 获取
  stats.value = {
    totalProducts: 156,
    totalOrders: 892,
    totalUsers: 3256,
    todayOrders: 28
  }
})
</script>

<template>
  <div class="dashboard">
    <Row :gutter="[16, 16]">
      <Col :xs="24" :sm="12" :lg="6">
        <Card>
          <Statistic
            title="商品总数"
            :value="stats.totalProducts"
            :value-style="{ color: '#3f8600' }"
          >
            <template #prefix>
              <ShoppingOutlined />
            </template>
          </Statistic>
        </Card>
      </Col>
      <Col :xs="24" :sm="12" :lg="6">
        <Card>
          <Statistic
            title="订单总数"
            :value="stats.totalOrders"
            :value-style="{ color: '#cf1322' }"
          >
            <template #prefix>
              <ShoppingCartOutlined />
            </template>
          </Statistic>
        </Card>
      </Col>
      <Col :xs="24" :sm="12" :lg="6">
        <Card>
          <Statistic
            title="用户总数"
            :value="stats.totalUsers"
            :value-style="{ color: '#1890ff' }"
          >
            <template #prefix>
              <UserOutlined />
            </template>
          </Statistic>
        </Card>
      </Col>
      <Col :xs="24" :sm="12" :lg="6">
        <Card>
          <Statistic
            title="今日订单"
            :value="stats.todayOrders"
            :value-style="{ color: '#faad14' }"
          >
            <template #prefix>
              <RiseOutlined />
            </template>
          </Statistic>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 0;
}
</style>
