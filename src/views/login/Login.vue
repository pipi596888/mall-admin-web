<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { Form, Input, Button, message } from 'ant-design-vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const formRef = ref()
const formState = ref({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    loading.value = true

    // 模拟登录 - 实际项目中调用 API
    setTimeout(() => {
      if (formState.value.username === 'admin' && formState.value.password === 'admin123') {
        userStore.setToken('mock-token-' + Date.now())
        userStore.setUserInfo({
          id: 1,
          username: 'admin',
          nickname: '管理员'
        })
        message.success('登录成功')
        router.push('/')
      } else {
        message.error('用户名或密码错误')
      }
      loading.value = false
    }, 500)
  } catch (error) {
    console.error('表单验证失败', error)
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <h1 class="title">壹品后台管理系统</h1>
      <Form
        ref="formRef"
        :model="formState"
        :rules="rules"
        class="login-form"
      >
        <Form.Item name="username">
          <Input
            v-model:value="formState.username"
            size="large"
            placeholder="用户名"
          >
            <template #prefix>
              <UserOutlined />
            </template>
          </Input>
        </Form.Item>
        <Form.Item name="password">
          <Input.Password
            v-model:value="formState.password"
            size="large"
            placeholder="密码"
          >
            <template #prefix>
              <LockOutlined />
            </template>
          </Input.Password>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            html-type="submit"
            size="large"
            block
            :loading="loading"
            @click="handleSubmit"
          >
            登录
          </Button>
        </Form.Item>
      </Form>
      <div class="tips">
        <p>测试账号: admin / admin123</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 32px;
  font-size: 24px;
  color: #333;
}

.login-form {
  margin-top: 24px;
}

.tips {
  text-align: center;
  color: #999;
  font-size: 12px;
  margin-top: 16px;
}
</style>
