<script setup lang="ts">
import { ref, computed, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/user'
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Breadcrumb
} from 'ant-design-vue'
import {
  DashboardOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons-vue'

const { Header, Sider, Content } = Layout

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const collapsed = ref(false)

const selectedKeys = computed(() => {
  const path = route.path
  if (path.startsWith('/products')) return ['products']
  if (path.startsWith('/orders')) return ['orders']
  if (path.startsWith('/users')) return ['users']
  if (path.startsWith('/dashboard')) return ['dashboard']
  return ['dashboard']
})

const openKeys = computed(() => {
  const path = route.path
  if (path.startsWith('/products') || path.startsWith('/orders') || path.startsWith('/users')) {
    return ['business']
  }
  return []
})

const menuItems = [
  {
    key: 'dashboard',
    icon: () => h(DashboardOutlined),
    label: '控制台',
    path: '/dashboard'
  },
  {
    key: 'business',
    icon: () => h(ShoppingOutlined),
    label: '业务管理',
    children: [
      {
        key: 'products',
        icon: () => h(ShoppingOutlined),
        label: '商品管理',
        path: '/products'
      },
      {
        key: 'orders',
        icon: () => h(ShoppingCartOutlined),
        label: '订单管理',
        path: '/orders'
      },
      {
        key: 'users',
        icon: () => h(UserOutlined),
        label: '用户管理',
        path: '/users'
      }
    ]
  }
]

const breadcrumbs = computed(() => {
  const items: { title: string; path?: string }[] = [{ title: '首页', path: '/dashboard' }]
  const path = route.path

  if (path.includes('products')) {
    items.push({ title: '商品管理' })
    if (path.includes('add')) {
      items.push({ title: '新增商品' })
    } else if (path.includes('edit')) {
      items.push({ title: '编辑商品' })
    }
  } else if (path.includes('orders')) {
    items.push({ title: '订单管理' })
    if (path.match(/\/orders\/\d+/)) {
      items.push({ title: '订单详情' })
    }
  } else if (path.includes('users')) {
    items.push({ title: '用户管理' })
  }

  return items
})

const handleMenuClick = ({ key }: { key: string }) => {
  const item = menuItems.find(m => m.key === key)
  if (item && item.path) {
    router.push(item.path)
  }
}

const handleSubMenuClick = (key: string) => {
  const item = menuItems.find(m => m.children?.find(c => c.key === key))
  if (item) {
    const child = item.children?.find(c => c.key === key)
    if (child?.path) {
      router.push(child.path)
    }
  }
}

const handleMenuSelect = (info: { key: string; keyPath: string[] }) => {
  if (info.keyPath.length > 1) {
    handleSubMenuClick(info.key)
  } else {
    handleMenuClick(info)
  }
}

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<template>
  <Layout style="min-height: 100vh">
    <Sider v-model:collapsed="collapsed" collapsible trigger-null-icon>
      <div class="logo">
        {{ collapsed ? '壹品' : '壹品后台管理系统' }}
      </div>
      <Menu
        v-model:selectedKeys="selectedKeys"
        v-model:openKeys="openKeys"
        mode="inline"
        :items="menuItems"
        @select="handleMenuSelect"
      />
    </Sider>
    <Layout>
      <Header style="padding: 0 16px; background: #fff; display: flex; align-items: center; justify-content: space-between">
        <div style="display: flex; align-items: center">
          <component
            :is="collapsed ? MenuUnfoldOutlined : MenuFoldOutlined"
            style="font-size: 18px; cursor: pointer"
            @click="collapsed = !collapsed"
          />
          <Breadcrumb style="margin-left: 16px" :items="breadcrumbs" />
        </div>
        <Dropdown>
          <div style="cursor: pointer; display: flex; align-items: center; gap: 8px">
            <Avatar :icon="h(UserOutlined)" />
            <span>管理员</span>
          </div>
          <template #overlay>
            <Menu>
              <Menu.Item key="logout" @click="handleLogout">
                <LogoutOutlined />
                退出登录
              </Menu.Item>
            </Menu>
          </template>
        </Dropdown>
      </Header>
      <Content style="margin: 16px; padding: 16px; background: #fff; min-height: 280px">
        <RouterView />
      </Content>
    </Layout>
  </Layout>
</template>

<style scoped>
.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
}
</style>
