<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Upload,
  message,
  Card
} from 'ant-design-vue'
import { PlusOutlined, UploadOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()

const isEdit = computed(() => !!route.params.id)
const loading = ref(false)

const formRef = ref()
const formState = ref({
  name: '',
  category: '',
  price: 0,
  stock: 0,
  description: '',
  status: 1,
  image: ''
})

const rules = {
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择商品分类', trigger: 'change' }
  ],
  price: [
    { required: true, message: '请输入商品价格', trigger: 'blur' }
  ],
  stock: [
    { required: true, message: '请输入商品库存', trigger: 'blur' }
  ]
}

const categories = [
  { value: '手机', label: '手机' },
  { value: '电脑', label: '电脑' },
  { value: '平板', label: '平板' },
  { value: '耳机', label: '耳机' },
  { value: '手表', label: '手表' },
  { value: '配件', label: '配件' }
]

const statusOptions = [
  { value: 1, label: '上架' },
  { value: 0, label: '下架' }
]

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    loading.value = true

    // 模拟提交
    setTimeout(() => {
      message.success(isEdit.value ? '修改成功' : '添加成功')
      loading.value = false
      router.push('/products')
    }, 500)
  } catch (error) {
    console.error('表单验证失败', error)
  }
}

const handleCancel = () => {
  router.push('/products')
}

const handleImageChange = (info: any) => {
  if (info.file.status === 'done') {
    message.success('图片上传成功')
    formState.value.image = 'https://picsum.photos/200/200?random=' + Date.now()
  }
}

onMounted(() => {
  if (isEdit.value) {
    // 模拟加载商品数据
    setTimeout(() => {
      formState.value = {
        name: 'iPhone 15 Pro',
        category: '手机',
        price: 7999,
        stock: 100,
        description: '最新款 iPhone，配备 A17 Pro 芯片',
        status: 1,
        image: 'https://picsum.photos/200/200?random=1'
      }
    }, 300)
  }
})
</script>

<template>
  <div class="product-form">
    <Card :title="isEdit ? '编辑商品' : '新增商品'">
      <Form
        ref="formRef"
        :model="formState"
        :rules="rules"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 16 }"
      >
        <Form.Item label="商品名称" name="name">
          <Input v-model:value="formState.name" placeholder="请输入商品名称" />
        </Form.Item>

        <Form.Item label="商品分类" name="category">
          <Select v-model:value="formState.category" placeholder="请选择商品分类">
            <Select.Option v-for="item in categories" :key="item.value" :value="item.value">
              {{ item.label }}
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="价格" name="price">
          <InputNumber
            v-model:value="formState.price"
            :min="0"
            :precision="2"
            style="width: 100%"
            placeholder="请输入价格"
          >
            <template #addonBefore>¥</template>
          </InputNumber>
        </Form.Item>

        <Form.Item label="库存" name="stock">
          <InputNumber
            v-model:value="formState.stock"
            :min="0"
            :precision="0"
            style="width: 100%"
            placeholder="请输入库存"
          />
        </Form.Item>

        <Form.Item label="商品状态" name="status">
          <Select v-model:value="formState.status" placeholder="请选择商品状态">
            <Select.Option v-for="item in statusOptions" :key="item.value" :value="item.value">
              {{ item.label }}
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="商品图片" name="image">
          <div class="image-upload">
            <Upload
              :show-upload-list="false"
              :before-upload="() => false"
              @change="handleImageChange"
            >
              <div v-if="formState.image" class="image-preview">
                <img :src="formState.image" />
              </div>
              <Button v-else>
                <PlusOutlined />
                上传图片
              </Button>
            </Upload>
          </div>
        </Form.Item>

        <Form.Item label="商品描述" name="description">
          <Input.TextArea
            v-model:value="formState.description"
            :rows="4"
            placeholder="请输入商品描述"
          />
        </Form.Item>

        <Form.Item :wrapper-col="{ offset: 4, span: 16 }">
          <Space>
            <Button type="primary" html-type="submit" :loading="loading" @click="handleSubmit">
              提交
            </Button>
            <Button @click="handleCancel">取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  </div>
</template>

<style scoped>
.product-form {
  padding: 0;
}

.image-upload {
  display: inline-block;
}

.image-preview {
  width: 100px;
  height: 100px;
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  overflow: hidden;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
