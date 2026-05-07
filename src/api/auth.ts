import request from '@/utils/request'

interface LoginParams {
  username: string
  password: string
}

interface LoginResult {
  token: string
}

export const loginApi = (data: LoginParams) => {
  return request.post<LoginResult>('/auth/login', data)
}
