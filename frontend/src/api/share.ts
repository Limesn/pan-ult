import request from './request'
import type { ApiResponse } from './types'

export function fetchShareList(page = 1, pageSize = 20) {
  return request.get<ApiResponse<{ total: number; list: any[] }>>('/api/shares', {
    params: { page, page_size: pageSize }
  })
}

export function createShare(payload: { file_id: number; expire_days?: number; password?: string }) {
  return request.post<ApiResponse<{ share_id: number; share_code: string; share_url: string; expire_at: string; has_password: boolean }>>('/api/shares', payload)
}

export function cancelShare(id: number) {
  return request.delete<ApiResponse<null>>(`/api/shares/${id}`)
}
