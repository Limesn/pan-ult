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
          <el-button type="primary">上传</el-button>
          <el-button>新建文件夹</el-button>
          <el-button>批量下载</el-button>
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
          <h2>全部文件</h2>
          <p>最近更新：今天 09:40</p>
        </div>
        <div class="actions-inline">
          <el-button size="small">列表视图</el-button>
          <el-button size="small">排序：时间</el-button>
        </div>
      </section>

      <section class="folder-grid">
        <div class="file-card card" v-for="item in fileList" :key="item.id">
          <div class="file-icon">{{ item.type === 'folder' ? '📁' : '📄' }}</div>
          <div class="file-title">{{ item.type === 'folder' ? item.folder_name : item.file_name }}</div>
          <div class="file-meta">
            {{ item.type === 'folder' ? `${item.item_count} 项内容` : formatSize(item.file_size) }}
          </div>
        </div>
      </section>

      <div v-if="fileList.length === 0" class="empty-state card">
        <div class="empty-icon">📦</div>
        <div>暂无文件</div>
        <el-button type="primary">上传第一个文件</el-button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElButton, ElDropdown, ElDropdownItem, ElDropdownMenu, ElInput, ElProgress, ElMessage } from 'element-plus'
import { fetchFiles } from '@/api/file'
import { logout } from '@/api/auth'
import { useUserStore } from '@/store/user'

const router = useRouter()
const keyword = ref('')
const fileList = ref<any[]>([
  { id: 1, type: 'folder', folder_name: '项目资料', item_count: 12, created_at: '2026-09-21T09:00:00Z' },
  { id: 2, type: 'file', file_name: '报销单.pdf', file_size: 204800, file_hash: 'abc', mime_type: 'application/pdf', created_at: '2026-09-21T08:30:00Z' },
  { id: 3, type: 'file', file_name: '设计稿.sketch', file_size: 1048576, file_hash: 'def', mime_type: 'application/octet-stream', created_at: '2026-09-20T18:00:00Z' }
])

const userStore = useUserStore()
const user = computed(() => userStore.userInfo)

const formatSize = (size: number) => {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
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

onMounted(async () => {
  try {
    const res = await fetchFiles({ page: 1, page_size: 20 })
    if (res.data?.data?.list) {
      fileList.value = res.data.data.list
    }
  } catch (error) {
    ElMessage.warning('获取文件列表失败，后端未连接或 token 失效')
    console.error(error)
  }
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
  background: linear-gradient(135deg, #4a90e2, #a78bfa);
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
}

.file-title {
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-meta {
  color: var(--subtext);
  font-size: 12px;
}

.empty-state {
  margin-top: 24px;
}

.empty-icon {
  font-size: 54px;
}
</style>
