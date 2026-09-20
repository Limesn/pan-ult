<template>
  <div class="share-access-page">
    <div class="share-card card">
      <div class="brand-row">
        <div class="brand-badge">P</div>
        <div>
          <div class="brand-name">Pan-Ult</div>
          <div class="brand-sub">分享访问</div>
        </div>
      </div>

      <h2>文件分享</h2>
      <p class="hint">这个链接来自 Pan-Ult 网盘，输入提取码后即可查看或下载文件。</p>

      <el-input v-model="password" placeholder="请输入提取码" class="password-input" />
      <el-button type="primary" class="download-btn">下载文件</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElButton, ElInput } from 'element-plus'

const password = ref('')
</script>

<style scoped>
.share-access-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(74, 144, 226, 0.12), rgba(167, 139, 250, 0.12));
}

.share-card {
  width: min(480px, 90vw);
  padding: 24px;
}

.brand-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
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

h2 {
  margin: 0 0 8px;
}

.hint {
  color: var(--subtext);
  margin-bottom: 18px;
}

.password-input {
  margin-bottom: 16px;
}

.download-btn {
  width: 100%;
}
</style>
