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
        <RouterLink class="nav-item" to="/files">全部文件</RouterLink>
        <RouterLink class="nav-item" to="/shares">我的分享</RouterLink>
        <RouterLink class="nav-item active" to="/downloads">下载列表</RouterLink>
        <RouterLink class="nav-item" to="/trash">回收站</RouterLink>
        <RouterLink class="nav-item" to="/profile">个人中心</RouterLink>
      </nav>
    </aside>

    <main class="content-panel">
      <header class="topbar">
        <div class="page-title">下载列表</div>
      </header>

      <div class="cards-grid">
        <div class="task-card card" v-for="task in tasks" :key="task.task_id">
          <div class="task-head">
            <strong>{{ task.archive_name }}</strong>
            <span class="status" :class="task.status">{{ statusText(task.status) }}</span>
          </div>
          <div class="task-meta">{{ task.total_files }} 个文件 · {{ formatSize(task.total_size) }}</div>
          <el-progress :percentage="task.progress" :status="task.status === 'error' ? 'exception' : 'success'" />
          <div class="task-actions">
            <el-button size="small" type="primary">重新下载</el-button>
            <el-button size="small" plain>删除</el-button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElButton, ElProgress } from 'element-plus'

const tasks = ref([
  { task_id: 'pkg_001', archive_name: 'pan-ult-20260921.zip', status: 'success', total_files: 7, total_size: 1288490188, progress: 100 },
  { task_id: 'pkg_002', archive_name: '项目资料.zip', status: 'processing', total_files: 12, total_size: 2147483648, progress: 68 }
])

const statusText = (status: string) => {
  if (status === 'success') return '已完成'
  if (status === 'processing') return '进行中'
  if (status === 'error') return '失败'
  if (status === 'cancelled') return '已取消'
  return '待处理'
}

const formatSize = (size: number) => {
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}
</script>

<style scoped>
.page-title {
  font-size: 24px;
  font-weight: 700;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.task-card {
  padding: 18px;
}

.task-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.task-meta {
  color: var(--subtext);
  font-size: 12px;
  margin-bottom: 12px;
}

.status {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 999px;
}

.status.success {
  background: rgba(52, 199, 89, 0.12);
  color: var(--success);
}

.status.processing {
  background: rgba(69, 184, 240, 0.12);
  color: var(--primary);
}

.status.error {
  background: rgba(255, 59, 48, 0.12);
  color: var(--error);
}

.task-actions {
  margin-top: 14px;
  display: flex;
  gap: 8px;
}

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
}

.nav-item {
  padding: 10px 12px;
  border-radius: 8px;
  color: var(--text);
}

.nav-item:hover,
.nav-item.active {
  background: var(--primary-soft);
  color: var(--primary);
  font-weight: 600;
}
</style>
