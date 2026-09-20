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
        <RouterLink class="nav-item" to="/trash">回收站</RouterLink>
        <RouterLink class="nav-item active" to="/profile">个人中心</RouterLink>
      </nav>
    </aside>

    <main class="content-panel">
      <header class="topbar">
        <div class="page-title">个人中心</div>
      </header>

      <div class="profile-card card">
        <div class="user-row">
          <img class="avatar" :src="avatarUrl || placeholder" alt="avatar" />
          <div>
            <div class="name">{{ user?.name || '用户' }}</div>
            <div class="meta">Open ID: {{ user?.open_id || 'unknown' }}</div>
          </div>
        </div>

        <div class="stats">
          <div class="stat-item">
            <span>已使用</span>
            <strong>1.2 TB</strong>
          </div>
          <div class="stat-item">
            <span>总容量</span>
            <strong>1.8 TB</strong>
          </div>
        </div>

        <el-progress :percentage="68" />

        <el-button class="logout-btn" type="danger" @click="handleLogout">退出登录</el-button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElButton, ElProgress } from 'element-plus'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()
const user = computed(() => userStore.userInfo)
const avatarUrl = computed(() => user.value?.avatar_url || '')
const placeholder = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c0827a736a6.png'

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.page-title {
  font-size: 24px;
  font-weight: 700;
}

.profile-card {
  max-width: 520px;
  padding: 24px;
}

.user-row {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 24px;
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
}

.name {
  font-size: 24px;
  font-weight: 700;
}

.meta {
  margin-top: 4px;
  color: var(--subtext);
  font-size: 12px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.stat-item {
  background: var(--primary-soft);
  border-radius: 12px;
  padding: 14px;
}

.stat-item span {
  display: block;
  color: var(--subtext);
  font-size: 12px;
  margin-bottom: 8px;
}

.logout-btn {
  margin-top: 20px;
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
