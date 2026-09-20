<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand-row">
        <div class="brand-badge">P</div>
        <div>
          <div class="brand-name">Pan-Ult</div>
          <div class="brand-sub">网盘</div>
        </div>
      </div>

      <nav class="nav-list">
        <RouterLink class="nav-item active" to="/files">全部文件</RouterLink>
        <RouterLink class="nav-item" to="/shares">我的分享</RouterLink>
        <RouterLink class="nav-item" to="/downloads">下载列表</RouterLink>
        <RouterLink class="nav-item" to="/trash">回收站</RouterLink>
        <RouterLink class="nav-item" to="/profile">个人中心</RouterLink>
      </nav>

      <div class="storage-box card">
        <div class="storage-header">
          <span>存储空间</span>
          <span>68%</span>
        </div>
        <el-progress :percentage="68" :show-text="false" />
        <div class="storage-meta">1.2 TB / 1.8 TB</div>
      </div>
    </aside>

    <main class="content-panel">
      <header class="topbar">
        <div class="search-box">
          <el-input v-model="keyword" placeholder="搜索文件或文件夹" clearable />
        </div>

        <div class="toolbar-actions">
          <el-button type="primary" :loading="uploading" @click="triggerUpload">上传</el-button>
          <input
            ref="fileInputRef"
            type="file"
            multiple
            class="hidden-file-input"
            @change="handleFileSelected"
          />
          <el-button @click="openCreateFolderDialog">新建文件夹</el-button>
          <el-button @click="handleBatchDownload">批量下载</el-button>
          <el-dropdown trigger="click">
            <el-button class="avatar-button">
              {{ user?.name || '用户' }}
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="router.push('/profile')">个人中心</el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <section class="panel-head">
        <div>
          <h2>{{ currentFolderName || '全部文件' }}</h2>
          <p v-if="currentFolderId">
            <a class="back-link" @click="goBackToRoot">全部文件</a> / {{ currentFolderName }}
          </p>
          <p v-else-if="keyword.trim()">搜索“{{ keyword.trim() }}”，共 {{ filteredFileList.length }} 项结果</p>
          <p v-else>最近更新：今天 09:40</p>
        </div>
        <div class="actions-inline">
          <el-button size="small" @click="toggleViewMode">{{ viewMode === 'grid' ? '列表视图' : '网格视图' }}</el-button>
          <el-button size="small">排序：时间</el-button>
        </div>
      </section>

      <section v-if="selectedItems.length > 0" class="selection-bar card">
        <el-checkbox
          :model-value="allSelected"
          :indeterminate="someSelected"
          @change="toggleSelectAll"
        >
          已选择 {{ selectedItems.length }} 项
        </el-checkbox>
        <div class="selection-actions">
          <el-button size="small" type="primary" @click="handleBatchDownload">批量下载</el-button>
          <el-button size="small" type="danger" plain @click="handleBatchDelete">批量删除</el-button>
          <el-button size="small" @click="clearSelection">取消选择</el-button>
        </div>
      </section>
      <section v-else-if="filteredFileList.length > 0" class="selection-bar card select-all-bar">
        <el-checkbox :model-value="false" @change="toggleSelectAll">全选</el-checkbox>
      </section>

      <section v-if="viewMode === 'grid'" class="folder-grid">
        <div
          class="file-card card"
          :class="{ selected: isSelected(item) }"
          v-for="item in filteredFileList"
          :key="`${item.type}-${item.id}`"
        >
          <div class="file-card-top">
            <el-checkbox :model-value="isSelected(item)" @change="() => toggleSelect(item)" @click.stop />
            <el-dropdown trigger="click" @command="(command: string) => handleCommand(command, item)">
              <span class="more-trigger" @click.stop>⋯</span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-if="item.type === 'folder'" command="open">打开文件夹</el-dropdown-item>
                  <el-dropdown-item v-if="item.type === 'file'" command="download">下载</el-dropdown-item>
                  <el-dropdown-item command="rename">重命名</el-dropdown-item>
                  <el-dropdown-item command="copy">复制到...</el-dropdown-item>
                  <el-dropdown-item command="move">移动到...</el-dropdown-item>
                  <el-dropdown-item command="delete" divided>删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div class="file-icon" @click="handleItemClick(item)">{{ item.type === 'folder' ? '📁' : '📄' }}</div>
          <div class="file-title" @click="handleItemClick(item)">{{ item.type === 'folder' ? item.folder_name : item.file_name }}</div>
          <div class="file-meta">
            {{ item.type === 'folder' ? `${item.item_count} 项内容` : formatSize(item.file_size) }}
          </div>
        </div>
      </section>

      <section v-else class="file-list card">
        <div class="file-row" :class="{ selected: isSelected(item) }" v-for="item in filteredFileList" :key="`${item.type}-${item.id}`">
          <el-checkbox :model-value="isSelected(item)" @change="() => toggleSelect(item)" />
          <span class="file-icon">{{ item.type === 'folder' ? '📁' : '📄' }}</span>
          <span class="file-title" @click="handleItemClick(item)">{{ item.type === 'folder' ? item.folder_name : item.file_name }}</span>
          <span class="file-meta">
            {{ item.type === 'folder' ? `${item.item_count} 项内容` : formatSize(item.file_size) }}
          </span>
          <span class="file-meta file-date">{{ formatDate(item.created_at) }}</span>
          <el-dropdown trigger="click" @command="(command: string) => handleCommand(command, item)">
            <span class="more-trigger">⋯</span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-if="item.type === 'folder'" command="open">打开文件夹</el-dropdown-item>
                <el-dropdown-item v-if="item.type === 'file'" command="download">下载</el-dropdown-item>
                <el-dropdown-item command="rename">重命名</el-dropdown-item>
                <el-dropdown-item command="copy">复制到...</el-dropdown-item>
                <el-dropdown-item command="move">移动到...</el-dropdown-item>
                <el-dropdown-item command="delete" divided>删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </section>

      <div v-if="fileList.length === 0" class="empty-state card">
        <div class="empty-icon">📦</div>
        <div>暂无文件</div>
        <el-button type="primary" @click="triggerUpload">上传第一个文件</el-button>
      </div>
      <div v-else-if="filteredFileList.length === 0" class="empty-state card">
        <div class="empty-icon">🔍</div>
        <div>未找到与「{{ keyword }}」匹配的文件或文件夹</div>
        <el-button @click="keyword = ''">清空搜索条件</el-button>
      </div>
    </main>

    <el-dialog v-model="renameDialogVisible" title="重命名" width="360px">
      <el-input v-model="renameValue" placeholder="请输入新名称" @keyup.enter="confirmRename" />
      <template #footer>
        <el-button @click="renameDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmRename">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="transferDialogVisible" :title="transferMode === 'copy' ? '复制到指定文件夹' : '移动到指定文件夹'" width="360px">
      <el-input-number v-model="transferFolderId" :min="0" placeholder="目标文件夹 ID，0 表示根目录" style="width: 100%" />
      <div class="dialog-hint">当前暂无文件夹选择器，请直接输入目标文件夹 ID（0 表示根目录）</div>
      <template #footer>
        <el-button @click="transferDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmTransfer">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="createFolderDialogVisible" title="新建文件夹" width="360px">
      <el-input v-model="newFolderName" placeholder="请输入文件夹名称" @keyup.enter="confirmCreateFolder" />
      <template #footer>
        <el-button @click="createFolderDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmCreateFolder">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>


<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ElButton,
  ElCheckbox,
  ElDialog,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElInput,
  ElInputNumber,
  ElMessage,
  ElMessageBox,
  ElProgress
} from 'element-plus'
import type { ListItem } from '@/api/types'
import {
  copyFile,
  copyFolder,
  createFolder,
  createPackageTask,
  deleteFile,
  deleteFolder,
  downloadFile,
  fetchFiles,
  moveFile,
  moveFolder,
  renameFile,
  renameFolder,
  uploadFile
} from '@/api/file'
import { logout } from '@/api/auth'
import { isMockEnabled } from '@/api/request'
import { useUserStore } from '@/store/user'

const router = useRouter()
const route = useRoute()
const keyword = ref('')
const viewMode = ref<'grid' | 'list'>('grid')
const fileList = ref<ListItem[]>([
  { id: 1, type: 'folder', folder_name: '项目资料', item_count: 12, created_at: '2026-09-21T09:00:00Z' },
  { id: 2, type: 'file', file_name: '报销单.pdf', file_size: 204800, file_hash: 'abc', mime_type: 'application/pdf', created_at: '2026-09-21T08:30:00Z' },
  { id: 3, type: 'file', file_name: '设计稿.sketch', file_size: 1048576, file_hash: 'def', mime_type: 'application/octet-stream', created_at: '2026-09-20T18:00:00Z' }
])

const userStore = useUserStore()
const user = computed(() => userStore.userInfo)

const currentFolderId = computed(() => {
  const raw = route.params.folderId
  return raw ? Number(raw) : null
})
const currentFolderName = computed(() => (route.query.name as string) || '')

const filteredFileList = computed(() => {
  const normalizedKeyword = keyword.value.trim().toLowerCase()
  if (!normalizedKeyword) return fileList.value

  return fileList.value.filter((item) => itemLabel(item).toLowerCase().includes(normalizedKeyword))
})

const selectedItems = ref<ListItem[]>([])
const allSelected = computed(() => filteredFileList.value.length > 0 && selectedItems.value.length === filteredFileList.value.length)
const someSelected = computed(() => selectedItems.value.length > 0 && !allSelected.value)

const fileInputRef = ref<HTMLInputElement | null>(null)
const uploading = ref(false)

const renameDialogVisible = ref(false)
const renameValue = ref('')
let renameTarget: ListItem | null = null

const transferDialogVisible = ref(false)
const transferMode = ref<'copy' | 'move'>('copy')
const transferFolderId = ref<number | null>(0)
let transferTarget: ListItem | null = null

const createFolderDialogVisible = ref(false)
const newFolderName = ref('')

const formatSize = (size: number) => {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

const formatDate = (isoDate: string) => {
  if (!isoDate) return ''
  return isoDate.slice(0, 10)
}

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
}

const itemLabel = (item: ListItem) => (item.type === 'folder' ? item.folder_name : item.file_name)

const isSelected = (item: ListItem) => selectedItems.value.some((i) => i.type === item.type && i.id === item.id)

const toggleSelect = (item: ListItem) => {
  if (isSelected(item)) {
    selectedItems.value = selectedItems.value.filter((i) => !(i.type === item.type && i.id === item.id))
  } else {
    selectedItems.value = [...selectedItems.value, item]
  }
}

const toggleSelectAll = () => {
  selectedItems.value = allSelected.value ? [] : [...filteredFileList.value]
}

const clearSelection = () => {
  selectedItems.value = []
}

const loadFiles = async () => {
  try {
    const res = await fetchFiles({
      page: 1,
      page_size: 20,
      parent_id: currentFolderId.value ?? undefined
    })
    if (res.data?.data?.list) {
      fileList.value = res.data.data.list
    }
  } catch (error) {
    ElMessage.warning('获取文件列表失败，后端未连接或 token 失效')
    console.error(error)
  } finally {
    clearSelection()
  }
}

const handleItemClick = (item: ListItem) => {
  if (item.type === 'folder') {
    openFolder(item)
  }
}

const openFolder = (item: Extract<ListItem, { type: 'folder' }>) => {
  router.push({ path: `/files/${item.id}`, query: { name: item.folder_name } })
}

const goBackToRoot = () => {
  router.push('/files')
}

const openRenameDialog = (item: ListItem) => {
  renameTarget = item
  renameValue.value = itemLabel(item)
  renameDialogVisible.value = true
}

const confirmRename = async () => {
  if (!renameTarget || !renameValue.value.trim()) {
    ElMessage.warning('名称不能为空')
    return
  }

  try {
    if (renameTarget.type === 'folder') {
      await renameFolder(renameTarget.id, renameValue.value.trim())
    } else {
      await renameFile(renameTarget.id, renameValue.value.trim())
    }

    const target = renameTarget
    fileList.value = fileList.value.map((item) => {
      if (item.type === target.type && item.id === target.id) {
        return target.type === 'folder'
          ? { ...item, folder_name: renameValue.value.trim() }
          : { ...item, file_name: renameValue.value.trim() }
      }
      return item
    })

    ElMessage.success('重命名成功')
    renameDialogVisible.value = false
  } catch (error) {
    ElMessage.error('重命名失败')
    console.error(error)
  }
}

const openTransferDialog = (item: ListItem, mode: 'copy' | 'move') => {
  transferTarget = item
  transferMode.value = mode
  transferFolderId.value = 0
  transferDialogVisible.value = true
}

const confirmTransfer = async () => {
  if (!transferTarget) return
  const targetFolderId = transferFolderId.value || null

  try {
    if (transferMode.value === 'copy') {
      if (transferTarget.type === 'folder') {
        await copyFolder(transferTarget.id, targetFolderId)
      } else {
        await copyFile(transferTarget.id, targetFolderId)
      }
      ElMessage.success('复制成功')
    } else {
      if (transferTarget.type === 'folder') {
        await moveFolder(transferTarget.id, targetFolderId)
      } else {
        await moveFile(transferTarget.id, targetFolderId)
      }
      ElMessage.success('移动成功')
      await loadFiles()
    }

    transferDialogVisible.value = false
  } catch (error) {
    ElMessage.error(transferMode.value === 'copy' ? '复制失败' : '移动失败')
    console.error(error)
  }
}

const removeFromList = (items: ListItem[]) => {
  fileList.value = fileList.value.filter(
    (item) => !items.some((target) => target.type === item.type && target.id === item.id)
  )
  selectedItems.value = selectedItems.value.filter(
    (item) => !items.some((target) => target.type === item.type && target.id === item.id)
  )
}

const deleteItem = (item: ListItem) => (item.type === 'folder' ? deleteFolder(item.id) : deleteFile(item.id))

const handleDeleteOne = async (item: ListItem) => {
  try {
    await ElMessageBox.confirm(`确定要删除「${itemLabel(item)}」吗？删除后可在回收站中恢复。`, '删除确认', {
      type: 'warning'
    })
  } catch {
    return
  }

  try {
    await deleteItem(item)
    removeFromList([item])
    ElMessage.success('已删除')
  } catch (error) {
    ElMessage.error('删除失败')
    console.error(error)
  }
}

const handleBatchDelete = async () => {
  if (selectedItems.value.length === 0) return

  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedItems.value.length} 项吗？删除后可在回收站中恢复。`, '批量删除确认', {
      type: 'warning'
    })
  } catch {
    return
  }

  const targets = [...selectedItems.value]

  try {
    await Promise.all(targets.map((item) => deleteItem(item)))
    removeFromList(targets)
    ElMessage.success('批量删除成功')
  } catch (error) {
    ElMessage.error('部分文件删除失败')
    console.error(error)
  }
}

const handleDownloadOne = async (item: ListItem) => {
  if (item.type !== 'file') return

  if (isMockEnabled) {
    ElMessage.success(`（测试模式）已模拟触发下载：${item.file_name}`)
    return
  }

  try {
    const res = await downloadFile(item.id)
    const blobUrl = URL.createObjectURL(res.data as Blob)
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = item.file_name
    link.click()
    URL.revokeObjectURL(blobUrl)
  } catch (error) {
    ElMessage.error('下载失败')
    console.error(error)
  }
}

const handleBatchDownload = async () => {
  if (selectedItems.value.length === 0) {
    ElMessage.warning('请先勾选要下载的文件或文件夹')
    return
  }

  const fileIds = selectedItems.value.filter((item) => item.type === 'file').map((item) => item.id)
  const folderIds = selectedItems.value.filter((item) => item.type === 'folder').map((item) => item.id)

  try {
    await createPackageTask({ file_ids: fileIds, folder_ids: folderIds })
    ElMessage.success('打包任务已创建，请前往下载列表查看进度')
    clearSelection()
    router.push('/downloads')
  } catch (error) {
    ElMessage.error('创建打包任务失败')
    console.error(error)
  }
}

const handleCommand = (command: string, item: ListItem) => {
  if (command === 'open' && item.type === 'folder') {
    openFolder(item)
  } else if (command === 'download') {
    handleDownloadOne(item)
  } else if (command === 'rename') {
    openRenameDialog(item)
  } else if (command === 'copy') {
    openTransferDialog(item, 'copy')
  } else if (command === 'move') {
    openTransferDialog(item, 'move')
  } else if (command === 'delete') {
    handleDeleteOne(item)
  }
}

const openCreateFolderDialog = () => {
  newFolderName.value = ''
  createFolderDialogVisible.value = true
}

const confirmCreateFolder = async () => {
  if (!newFolderName.value.trim()) {
    ElMessage.warning('文件夹名称不能为空')
    return
  }

  try {
    const res = await createFolder({ folder_name: newFolderName.value.trim(), parent_id: currentFolderId.value })
    const created = res.data?.data
    fileList.value = [
      {
        id: created?.id ?? Date.now(),
        type: 'folder',
        folder_name: created?.folder_name ?? newFolderName.value.trim(),
        item_count: 0,
        created_at: created?.created_at ?? new Date().toISOString()
      },
      ...fileList.value
    ]
    ElMessage.success('文件夹创建成功')
    createFolderDialogVisible.value = false
  } catch (error) {
    ElMessage.error('创建文件夹失败')
    console.error(error)
  }
}

const triggerUpload = () => {
  fileInputRef.value?.click()
}

const handleFileSelected = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = input.files ? Array.from(input.files) : []
  if (files.length === 0) return

  uploading.value = true

  const results = await Promise.allSettled(
    files.map((file) => uploadFile(file, currentFolderId.value))
  )

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      const uploaded = result.value.data?.data
      fileList.value = [
        {
          id: uploaded?.id ?? Date.now() + index,
          type: 'file',
          file_name: uploaded?.file_name ?? files[index].name,
          file_size: uploaded?.file_size ?? files[index].size,
          file_hash: uploaded?.file_hash ?? '',
          mime_type: uploaded?.mime_type ?? files[index].type,
          created_at: uploaded?.created_at ?? new Date().toISOString()
        },
        ...fileList.value
      ]
    } else {
      console.error(result.reason)
    }
  })

  const successCount = results.filter((r) => r.status === 'fulfilled').length
  const failCount = results.length - successCount

  if (successCount > 0) {
    ElMessage.success(`成功上传 ${successCount} 个文件`)
  }
  if (failCount > 0) {
    ElMessage.error(`${failCount} 个文件上传失败`)
  }

  uploading.value = false
  input.value = ''
}

const handleLogout = async () => {
  try {
    await logout()
  } catch (error) {
    console.warn(error)
  } finally {
    userStore.logout()
    router.push('/login')
  }
}

watch(() => route.params.folderId, () => {
  loadFiles()
})

onMounted(() => {
  loadFiles()
})
</script>


<style scoped>
.brand-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 28px;
}

.brand-badge {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.brand-name {
  font-weight: 700;
}

.brand-sub {
  color: var(--subtext);
  font-size: 12px;
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 22px;
}

.nav-item {
  padding: 10px 12px;
  border-radius: 8px;
  color: var(--text);
  transition: 0.2s;
}

.nav-item:hover,
.nav-item.active {
  background: var(--primary-soft);
  color: var(--primary);
  font-weight: 600;
}

.storage-box {
  padding: 14px;
  margin-top: 24px;
}

.storage-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 13px;
}

.storage-meta {
  margin-top: 6px;
  color: var(--subtext);
  font-size: 12px;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.panel-head h2 {
  margin: 0;
  font-size: 24px;
}

.panel-head p {
  margin: 6px 0 0;
  color: var(--subtext);
}

.toolbar-actions,
.actions-inline {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar-button {
  min-width: 120px;
}

.folder-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.file-card {
  padding: 18px 16px;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
}

.file-icon {
  font-size: 28px;
  cursor: pointer;
}

.file-title {
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

.file-meta {
  color: var(--subtext);
  font-size: 12px;
}

.file-list {
  padding: 4px 0;
}

.file-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
}

.file-row:last-child {
  border-bottom: none;
}

.file-row .file-icon {
  font-size: 20px;
}

.file-row .file-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

.file-row .file-meta {
  width: 120px;
  flex-shrink: 0;
}

.file-row .file-date {
  width: 100px;
  text-align: right;
}

.empty-state {
  margin-top: 24px;
}

.empty-icon {
  font-size: 54px;
}

.back-link {
  color: var(--primary);
  cursor: pointer;
}

.selection-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  margin-bottom: 16px;
}

.select-all-bar {
  justify-content: flex-start;
}

.selection-actions {
  display: flex;
  gap: 8px;
}

.file-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: -4px;
}

.more-trigger {
  cursor: pointer;
  color: var(--subtext);
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 6px;
}

.more-trigger:hover {
  background: var(--primary-soft);
  color: var(--primary);
}

.file-card.selected,
.file-row.selected {
  border-color: var(--primary);
  background: var(--primary-soft);
}

.dialog-hint {
  margin-top: 8px;
  color: var(--subtext);
  font-size: 12px;
}

.hidden-file-input {
  display: none;
}
</style>
