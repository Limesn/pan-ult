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
        <RouterLink class="nav-item active" to="/shares">我的分享</RouterLink>
        <RouterLink class="nav-item" to="/downloads">下载列表</RouterLink>
        <RouterLink class="nav-item" to="/trash">回收站</RouterLink>
        <RouterLink class="nav-item" to="/profile">个人中心</RouterLink>
      </nav>
    </aside>

    <main class="content-panel">
      <header class="topbar">
        <div class="page-title">我的分享</div>
        <el-button type="primary">新建分享</el-button>
      </header>

      <div class="card share-table">
        <el-table :data="shares" stripe>
          <el-table-column prop="file_name" label="文件名" />
          <el-table-column prop="share_code" label="分享码" />
          <el-table-column prop="expire_at" label="有效期" />
          <el-table-column prop="created_at" label="创建时间" />
          <el-table-column label="操作" width="180">
            <template #default="scope">
              <el-button size="small" @click="copyUrl(scope.row)">复制链接</el-button>
              <el-button size="small" type="danger" plain @click="cancelShare(scope.row.id)">取消</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElButton, ElTable, ElTableColumn, ElMessage } from 'element-plus'

const shares = ref([
  {
    id: 1,
    file_name: '说明文档.pdf',
    share_code: 'ab12cd',
    expire_at: '2026-09-27',
    created_at: '2026-09-21'
  }
])

const copyUrl = async (row: any) => {
  const url = `https://pan.your-domain.com/s/${row.share_code}`
  try {
    await navigator.clipboard.writeText(url)
    ElMessage.success('分享链接已复制')
  } catch {
    ElMessage.warning('复制失败，请手动复制：' + url)
  }
}

const cancelShare = (id: number) => {
  shares.value = shares.value.filter((item) => item.id !== id)
  ElMessage.success('分享已取消')
}
</script>

<style scoped>
.page-title {
  font-size: 24px;
  font-weight: 700;
}

.share-table {
  padding: 12px;
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
