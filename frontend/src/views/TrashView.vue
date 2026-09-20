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
        <RouterLink class="nav-item" to="/downloads">下载列表</RouterLink>
        <RouterLink class="nav-item active" to="/trash">回收站</RouterLink>
        <RouterLink class="nav-item" to="/profile">个人中心</RouterLink>
      </nav>
    </aside>

    <main class="content-panel">
      <header class="topbar">
        <div>
          <div class="page-title">回收站</div>
          <div class="hint">回收站中的文件将在 30 天后自动清除</div>
        </div>
        <el-button type="primary">批量恢复</el-button>
      </header>

      <div class="card trash-list">
        <div class="row" v-for="item in items" :key="item.id">
          <div class="row-main">
            <span class="file-symbol">{{ item.type === 'folder' ? '📁' : '📄' }}</span>
            <span>{{ item.name }}</span>
          </div>
          <div class="row-actions">
            <el-button size="small">恢复</el-button>
            <el-button size="small" type="danger" plain>彻底删除</el-button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElButton } from 'element-plus'

const items = ref([
  { id: 1, type: 'file', name: '旧文档.pdf' },
  { id: 2, type: 'folder', name: '过期资料' }
])
</script>

<style scoped>
.page-title {
  font-size: 24px;
  font-weight: 700;
}

.hint {
  color: var(--subtext);
  margin-top: 6px;
}

.trash-list {
  padding: 12px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
}

.row:last-child {
  border-bottom: none;
}

.row-main {
  display: flex;
  align-items: center;
  gap: 10px;
}

.file-symbol {
  font-size: 22px;
}

.row-actions {
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
