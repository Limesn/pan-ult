import type { FileListResponse, ListItem, PackageTask, UserResponse } from '@/api/types'

// 仅用于本地开发预览的模拟数据，不参与生产构建逻辑
export const mockUser: UserResponse = {
  id: 1,
  open_id: 'mock_open_id_0001',
  name: '演示用户',
  avatar_url: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c0827a736a6.png',
  created_at: '2026-09-01T09:00:00Z'
}

export const mockFileList: ListItem[] = [
  { id: 1, type: 'folder', folder_name: '项目资料', item_count: 2, created_at: '2026-09-21T09:00:00Z' },
  { id: 2, type: 'folder', folder_name: '设计素材', item_count: 0, created_at: '2026-09-20T11:20:00Z' },
  { id: 3, type: 'file', file_name: '报销单.pdf', file_size: 204800, file_hash: 'mockhash-001', mime_type: 'application/pdf', created_at: '2026-09-21T08:30:00Z' },
  { id: 4, type: 'file', file_name: '设计稿.sketch', file_size: 1048576, file_hash: 'mockhash-002', mime_type: 'application/octet-stream', created_at: '2026-09-20T18:00:00Z' },
  { id: 5, type: 'file', file_name: '需求评审录音.mp3', file_size: 5242880, file_hash: 'mockhash-003', mime_type: 'audio/mpeg', created_at: '2026-09-19T14:10:00Z' }
]

// 模拟文件夹嵌套结构：key 为父文件夹 id，value 为该文件夹下的子项
export const mockFolderChildren: Record<number, ListItem[]> = {
  1: [
    { id: 101, type: 'file', file_name: '需求文档.docx', file_size: 51200, file_hash: 'mockhash-101', mime_type: 'application/msword', created_at: '2026-09-21T09:10:00Z' },
    { id: 102, type: 'file', file_name: '会议纪要.pdf', file_size: 102400, file_hash: 'mockhash-102', mime_type: 'application/pdf', created_at: '2026-09-21T09:20:00Z' }
  ]
}

export function buildMockFileListResponse(page = 1, pageSize = 20, parentId?: number | null): FileListResponse {
  const list = parentId ? mockFolderChildren[parentId] ?? [] : mockFileList
  return {
    total: list.length,
    page,
    page_size: pageSize,
    list
  }
}


export const mockShareList = [
  {
    id: 1,
    file_name: '说明文档.pdf',
    share_code: 'ab12cd',
    expire_at: '2026-09-27',
    created_at: '2026-09-21'
  }
]

export const mockPackageTasks: PackageTask[] = [
  {
    task_id: 'pkg_mock_001',
    status: 'success',
    progress: 100,
    processed_files: 7,
    total_files: 7,
    total_size: 1288490188,
    download_url: '#'
  }
]
