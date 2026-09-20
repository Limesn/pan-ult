import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import LoginView from '@/views/LoginView.vue'
import FileListView from '@/views/FileListView.vue'
import ShareManageView from '@/views/ShareManageView.vue'
import DownloadListView from '@/views/DownloadListView.vue'
import TrashView from '@/views/TrashView.vue'
import ProfileView from '@/views/ProfileView.vue'
import ShareAccessView from '@/views/ShareAccessView.vue'

const routes: RouteRecordRaw[] = [
  { path: '/login', name: 'login', component: LoginView },
  { path: '/', redirect: '/files' },
  { path: '/files', name: 'files', component: FileListView, meta: { requiresAuth: true } },
  { path: '/files/:folderId(\\d+)', name: 'folder', component: FileListView, meta: { requiresAuth: true } },
  { path: '/shares', name: 'shares', component: ShareManageView, meta: { requiresAuth: true } },
  { path: '/downloads', name: 'downloads', component: DownloadListView, meta: { requiresAuth: true } },
  { path: '/trash', name: 'trash', component: TrashView, meta: { requiresAuth: true } },
  { path: '/profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/s/:code', name: 'share-access', component: ShareAccessView },
  { path: '/:pathMatch(.*)*', redirect: '/files' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('pan_ult_token')

  if (to.meta.requiresAuth && !token) {
    next('/login')
    return
  }

  if (to.path === '/login' && token) {
    next('/files')
    return
  }

  next()
})

export default router
