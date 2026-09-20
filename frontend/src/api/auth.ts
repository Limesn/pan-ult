import request from './request'
import type { ApiResponse, UserResponse } from './types'

export function getFeishuAuthUrl() {
  return request.get<ApiResponse<{ url: string }>>('/api/auth/feishu/url')
}

export function getCurrentUser() {
  return request.get<ApiResponse<UserResponse>>('/api/auth/me')
}

export function logout() {
  return request.post<ApiResponse<null>>('/api/auth/logout')
}
