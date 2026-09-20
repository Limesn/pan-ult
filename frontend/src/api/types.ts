export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

export interface UserResponse {
  id: number
  open_id: string
  name: string
  avatar_url: string
  created_at: string
}

export interface FileItem {
  id: number
  type: 'file'
  file_name: string
  file_size: number
  file_hash: string
  mime_type: string
  created_at: string
}

export interface FolderItem {
  id: number
  type: 'folder'
  folder_name: string
  item_count: number
  created_at: string
}

export type ListItem = FileItem | FolderItem

export interface FileListResponse {
  total: number
  page: number
  page_size: number
  list: ListItem[]
}

export interface PackagePayload {
  file_ids: number[]
  folder_ids: number[]
  archive_name?: string
  compression?: 'normal' | 'store'
}

export interface PackageTask {
  task_id: string
  status: 'pending' | 'processing' | 'paused' | 'success' | 'error' | 'cancelled'
  progress: number
  current_file?: string
  speed?: number
  processed_files: number
  total_files: number
  total_size: number
  estimated_remaining?: number
  download_url?: string
}
