import request from './request'
import type { ApiResponse, FileItem, FileListResponse, PackagePayload, PackageTask } from './types'

export function fetchFiles(params: Record<string, string | number | undefined> = {}) {
  return request.get<ApiResponse<FileListResponse>>('/api/files', { params })
}

export function uploadFile(file: File, parentId?: number | null, onProgress?: (percent: number) => void) {
  const formData = new FormData()
  formData.append('file', file)
  if (parentId) {
    formData.append('parent_id', String(parentId))
  }

  return request.post<ApiResponse<FileItem>>('/api/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (onProgress && event.total) {
        onProgress(Math.round((event.loaded / event.total) * 100))
      }
    }
  })
}

export function createFolder(payload: { folder_name: string; parent_id?: number | null }) {
  return request.post<ApiResponse<{ id: number; folder_name: string; parent_id?: number | null; created_at: string }>>('/api/folders', payload)
}

export function renameFile(id: number, name: string) {
  return request.patch<ApiResponse<null>>(`/api/files/${id}`, { name })
}

export function renameFolder(id: number, name: string) {
  return request.patch<ApiResponse<null>>(`/api/folders/${id}`, { name })
}

export function deleteFile(id: number) {
  return request.delete<ApiResponse<null>>(`/api/files/${id}`)
}

export function deleteFolder(id: number) {
  return request.delete<ApiResponse<null>>(`/api/folders/${id}`)
}

export function copyFile(id: number, targetFolderId: number | null) {
  return request.post<ApiResponse<{ new_id: number }>>(`/api/files/${id}/copy`, { target_folder_id: targetFolderId })
}

export function moveFile(id: number, targetFolderId: number | null) {
  return request.post<ApiResponse<null>>(`/api/files/${id}/move`, { target_folder_id: targetFolderId })
}

export function copyFolder(id: number, targetFolderId: number | null) {
  return request.post<ApiResponse<{ new_id: number }>>(`/api/folders/${id}/copy`, { target_folder_id: targetFolderId })
}

export function moveFolder(id: number, targetFolderId: number | null) {
  return request.post<ApiResponse<null>>(`/api/folders/${id}/move`, { target_folder_id: targetFolderId })
}

export function downloadFile(id: number) {
  return request.get(`/api/files/${id}/download`, { responseType: 'blob' })
}

export function createPackageTask(payload: PackagePayload) {
  return request.post<ApiResponse<PackageTask>>('/api/files/download/package', payload)
}

export function getPackageProgress(taskId: string) {
  return request.get<ApiResponse<PackageTask>>(`/api/files/download/package/${taskId}`)
}

export function cancelPackageTask(taskId: string) {
  return request.delete<ApiResponse<null>>(`/api/files/download/package/${taskId}`)
}

export function getPackageTasks() {
  return request.get<ApiResponse<PackageTask[]>>('/api/files/download/tasks')
}
