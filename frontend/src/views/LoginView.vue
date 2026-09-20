<template>
  <div class="login-page">
    <div class="login-card card">
      <div class="brand-block">
        <div class="logo">P</div>
        <h1>Pan-Ult</h1>
        <p>轻量团队文件分享网盘</p>
      </div>

      <el-button class="login-button" type="primary" size="large" @click="handleLogin">
        飞书登录
      </el-button>

      <div class="api-note">
        API 地址：{{ apiBaseUrl }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElButton, ElMessage } from 'element-plus'
import { getFeishuAuthUrl } from '@/api/auth'
import { apiBaseUrl } from '@/api/request'

const handleLogin = async () => {
  try {
    const res = await getFeishuAuthUrl()
    const url = res.data?.data?.url
    if (url) {
      window.location.href = url
      return
    }

    ElMessage.error('未获取到飞书授权地址')
  } catch (error) {
    ElMessage.error('飞书登录失败，请检查 API 配置')
    console.error(error)
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(74, 144, 226, 0.12), rgba(167, 139, 250, 0.12));
}

.login-card {
  width: 420px;
  padding: 40px 28px;
  text-align: center;
}

.brand-block {
  margin-bottom: 28px;
}

.logo {
  width: 72px;
  height: 72px;
  margin: 0 auto 16px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  font-size: 28px;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #4a90e2, #a78bfa);
  box-shadow: 0 8px 24px rgba(74, 144, 226, 0.18);
}

.brand-block h1 {
  margin: 0;
  font-size: 32px;
}

.brand-block p {
  margin: 10px 0 0;
  color: var(--subtext);
}

.login-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
}

.api-note {
  margin-top: 18px;
  color: var(--subtext);
  font-size: 12px;
  word-break: break-all;
}
</style>
